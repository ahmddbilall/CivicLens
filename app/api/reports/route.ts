import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Report from "@/lib/models/Report";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const reports = await Report.find().sort({ createdAt: -1 }).limit(50);
    const mappedReports = reports.map(r => {
      const json = r.toJSON();
      json.id = r._id.toString();
      json.userId = r.userId?.toString();
      json.displayId = r.displayId;
      return json;
    });
    return NextResponse.json(mappedReports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    // Mock processing step
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newReport = await Report.create({
      userId: session.user.id,
      displayId: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      photoUrl: data.photoUrl || "",
      faultType: data.faultType || "other",
      severity: data.severity || "medium",
      description: data.description || "",
      location: data.location || { lat: 0, lng: 0, address: "", city: "" },
      authority: data.authority || { name: "Local Authority", department: "Public Works", email: "", phone: "", hours: "" },
      status: "pending",
      emailSent: data.sendEmail || false,
      socialPostPublished: data.postSocial || false,
      timeline: [
        {
          id: Date.now().toString(),
          type: "filed",
          label: "Report Filed",
          date: new Date(),
        },
      ],
    });

    const reportJson = newReport.toJSON();
    reportJson.id = newReport._id.toString();
    reportJson.userId = newReport.userId?.toString();
    reportJson.displayId = newReport.displayId;

    return NextResponse.json(reportJson, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
