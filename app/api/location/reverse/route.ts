import { NextRequest, NextResponse } from "next/server";

type NominatimAddress = {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "lat and lon are required" },
        { status: 400 },
      );
    }

    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url, {
      headers: {
        "User-Agent": "CivicLens/0.1 local civic reporting prototype",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Reverse geocoding failed: ${res.status} ${body}`);
    }

    const data = await res.json();
    const address = (data.address || {}) as NominatimAddress;
    const street = [address.house_number, address.road]
      .filter(Boolean)
      .join(" ");
    const area =
      address.neighbourhood ||
      address.suburb ||
      address.quarter ||
      address.county ||
      "";
    const city = address.city || address.town || address.village || "";

    return NextResponse.json({
      street,
      area,
      city,
      state: address.state || "",
      postcode: address.postcode || "",
      displayName: data.display_name || "",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reverse geocoding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
