import { NextRequest, NextResponse } from "next/server";

type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);

function getGeminiApiKeys() {
  const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  const seen = new Set<string>();

  return rawKeys
    .split(",")
    .map((key) => key.trim())
    .filter((key) => {
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function maskKey(key: string) {
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function extractDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return { mimeType: "image/jpeg", data: dataUrl };
  }
  return { mimeType: match[1], data: match[2] };
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return JSON");
  }

  return JSON.parse(raw.slice(start, end + 1));
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function inferDepartment(faultType: string) {
  if (faultType === "garbage") return "Solid Waste Management";
  if (faultType === "broken_light") return "Street Lights Department";
  if (faultType === "road_damage") return "Roads and Public Works";
  if (faultType === "infrastructure") return "Municipal Infrastructure";
  return "Public Works";
}

function buildFallbackAuthority(context: any) {
  const location = context?.location || {};
  const userProfile = context?.userProfile || {};
  const vision = context?.vision || {};
  const city =
    readString(location.city) ||
    readString(userProfile.city) ||
    "your city";
  const area = readString(location.area);
  const address = readString(location.address) || readString(location.displayName);
  const faultType = readString(vision.faultType);
  const department = inferDepartment(faultType);
  const localLabel =
    area && city !== "your city"
      ? `${area} Local Civic Office`
      : city === "your city"
        ? "Nearest Local Civic Office"
        : `${city} Local Civic Office`;
  const officeLabel = area
    ? `Nearest ${department} Office - ${area}`
    : `Nearest ${department} Office - ${city}`;

  return {
    authority: {
      name: localLabel,
      department,
      email: `complaints@${city.toLowerCase().replace(/[^a-z0-9]+/g, "") || "municipal"}-authority.gov`,
      phone: "Local municipal helpline",
      hours: "Standard public office hours",
      officeName: officeLabel,
      officeAddress: address || `${department}, ${city}`,
      officeLocation: {
        lat: readNumber(location.lat),
        lng: readNumber(location.lng),
      },
      distanceKm: 0,
      sourceUrl: "",
    },
    reasoning:
      "Best-effort fallback selected from the nearest available area, report city, and issue type because exact office details were unavailable.",
    sources: [],
  };
}

function normalizeAuthorityResponse(input: any, context: any) {
  const fallback = buildFallbackAuthority(context);
  const authority = input?.authority || {};
  const sources = Array.isArray(input?.sources) ? input.sources : [];
  const firstSourceUrl =
    readString(authority.sourceUrl) ||
    readString(sources.find((source: any) => readString(source?.url))?.url);

  return {
    authority: {
      name: readString(authority.name) || fallback.authority.name,
      department:
        readString(authority.department) || fallback.authority.department,
      email: readString(authority.email) || fallback.authority.email,
      phone: readString(authority.phone) || fallback.authority.phone,
      hours: readString(authority.hours) || fallback.authority.hours,
      officeName:
        readString(authority.officeName) || fallback.authority.officeName,
      officeAddress:
        readString(authority.officeAddress) ||
        fallback.authority.officeAddress,
      officeLocation: {
        lat:
          readNumber(authority.officeLocation?.lat) ??
          fallback.authority.officeLocation.lat,
        lng:
          readNumber(authority.officeLocation?.lng) ??
          fallback.authority.officeLocation.lng,
      },
      distanceKm:
        readNumber(authority.distanceKm) ?? fallback.authority.distanceKm,
      sourceUrl: firstSourceUrl || fallback.authority.sourceUrl,
    },
    reasoning: readString(input?.reasoning) || fallback.reasoning,
    sources,
  };
}

async function callGemini(parts: GeminiPart[], useGoogleSearch = false) {
  const apiKeys = getGeminiApiKeys();

  if (apiKeys.length === 0) {
    throw new Error("Missing GEMINI_API_KEY or GEMINI_API_KEYS in .env.local");
  }

  const payload = {
    contents: [{ parts }],
    ...(useGoogleSearch ? { tools: [{ google_search: {} }] } : {}),
    generationConfig: useGoogleSearch
      ? { temperature: 0.2 }
      : {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
  };

  let lastRetryableError = "";

  for (const apiKey of apiKeys) {
    let res: Response;

    try {
      res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      lastRetryableError =
        error instanceof Error
          ? `Network error with Gemini key ${maskKey(apiKey)}: ${error.message}`
          : `Network error with Gemini key ${maskKey(apiKey)}`;
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      const message = `Gemini request failed with key ${maskKey(apiKey)}: ${res.status} ${body}`;

      if (RETRYABLE_GEMINI_STATUSES.has(res.status)) {
        lastRetryableError = message;
        continue;
      }

      throw new Error(message);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      lastRetryableError = `Gemini returned an empty response with key ${maskKey(apiKey)}`;
      continue;
    }

    return {
      json: extractJson(text),
      groundingMetadata: data.candidates?.[0]?.groundingMetadata,
    };
  }

  throw new Error(lastRetryableError || "All Gemini API keys failed");
}

function buildVisionPrompt(userDescription: string) {
  return `You are the Vision Agent for CivicLens, a civic fault reporting app.

Analyze the uploaded civic fault image and the user's description.

User description:
${userDescription || "No user description provided."}

Return ONLY valid JSON with this exact shape:
{
  "faultType": "road_damage" | "garbage" | "broken_light" | "infrastructure" | "other",
  "severity": "low" | "medium" | "high",
  "issueDetected": "short clear issue name",
  "refinedDescription": "detailed citizen-report description combining visual evidence and user description",
  "visualEvidence": ["specific visible cue 1", "specific visible cue 2"],
  "immediateActions": ["specific immediate action 1", "specific immediate action 2"],
  "publicSafetyRisk": "short risk assessment",
  "confidence": 0.0
}

Use only what is visible or reasonably inferable. Do not invent exact addresses.`;
}

function buildAuthorityPrompt(context: unknown) {
  return `You are the Authority Lookup Agent for CivicLens.

Use Google Search grounding to identify the most relevant public authority for this civic issue.
Your main priority is proximity and usefulness for the citizen.

Search in this order and stop at the first useful result:
1. Exact nearby office for the street, neighbourhood, society, area, or coordinates.
2. Union council, town, zone, tehsil, local municipal office, complaint center, or field office serving that area.
3. City-level department or municipal authority serving the issue type.
4. Provincial/regional authority only if no local/city office can be identified.

Prioritize official government, municipal, utility, and authority sources when possible.
If the nearest exact office cannot be found, choose a less exact but still nearby and valid authority.
Never return an empty authority object. Prefer a useful local/city fallback over blank fields.
For unknown email/phone/hours, return useful public-facing fallback text such as "Local municipal helpline" or "Standard public office hours".
When possible, officeName and officeAddress should describe the nearest office, not only the parent authority.
In reasoning, briefly state which search tier was used: exact nearby, local area, city-level, or regional fallback.

Context:
${JSON.stringify(context, null, 2)}

Return ONLY valid JSON with this exact shape:
{
  "authority": {
    "name": "authority or department name",
    "department": "specific department",
    "email": "public complaint email or best fallback text",
    "phone": "public phone or best fallback text",
    "hours": "office hours, complaint timing, or best fallback text",
    "officeName": "nearest relevant office name or best fallback office label",
    "officeAddress": "nearest office street address or best fallback area/city address",
    "officeLocation": {
      "lat": 0,
      "lng": 0
    },
    "distanceKm": 0,
    "sourceUrl": "best official source URL if found, otherwise empty string"
  },
  "reasoning": "why this authority is relevant",
  "sources": [{"title": "source title", "url": "source URL"}]
}`;
}

function buildCommunicationsPrompt(context: unknown) {
  return `You are the Communications Agent for CivicLens.

Use the full agent context to write a clear, actionable civic complaint. Include:
- issue detected
- user's original description
- AI-refined description
- human-readable location context such as street, area, city, and nearby address. Do not lead with raw coordinates unless no readable location is available.
- immediate action plan
- authority being contacted
- nearest authority office name, address, timings, email, and phone if available

Formatting rules:
- Return plain text only inside JSON string values.
- Do not use Markdown.
- Do not use **bold**, headings with #, bullet symbols, or tables.
- Use readable section labels like "Issue Detected:" without Markdown markers.

Context:
${JSON.stringify(context, null, 2)}

Return ONLY valid JSON with this exact shape:
{
  "detailedReport": "a detailed report written for the citizen to review",
  "emails": {
    "polite": "polite formal complaint email with a respectful collaborative tone",
    "firm": "firm formal complaint email that requests accountability and a clear timeline",
    "urgent": "urgent formal complaint email for immediate action where safety or public impact is emphasized"
  },
  "email": "same value as emails.firm for backward compatibility",
  "socialPost": "short public social post",
  "immediateActionPlan": ["step 1", "step 2", "step 3"]
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.stage === "vision") {
      const { mimeType, data } = extractDataUrl(body.imageDataUrl || "");
      const result = await callGemini([
        { inline_data: { mime_type: mimeType, data } },
        { text: buildVisionPrompt(body.userDescription || "") },
      ]);
      return NextResponse.json(result.json);
    }

    if (body.stage === "authority") {
      try {
        const result = await callGemini(
          [{ text: buildAuthorityPrompt(body.context) }],
          true,
        );
        return NextResponse.json({
          ...normalizeAuthorityResponse(result.json, body.context),
          groundingMetadata: result.groundingMetadata,
        });
      } catch (error) {
        const fallback = normalizeAuthorityResponse(null, body.context);
        return NextResponse.json({
          ...fallback,
          warning:
            error instanceof Error
              ? `Authority lookup used fallback: ${error.message}`
              : "Authority lookup used fallback",
        });
      }
    }

    if (body.stage === "communications") {
      const result = await callGemini([
        { text: buildCommunicationsPrompt(body.context) },
      ]);
      const email = result.json.email || result.json.emails?.firm || "";
      return NextResponse.json({ ...result.json, email });
    }

    return NextResponse.json({ error: "Unknown agent stage" }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected Gemini agent error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
