import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Report from "@/lib/models/Report";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find and verify ownership
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    
    if (report.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to resolve this case" }, { status: 403 });
    }

    report.status = "resolved";
    report.resolvedAt = new Date();
    report.timeline.push({
      id: Date.now().toString(),
      type: "resolved",
      label: "Marked as Resolved",
      date: new Date()
    });

    await report.save();

    const reportJson = report.toJSON();
    reportJson.id = report._id.toString();
    reportJson.userId = report.userId?.toString();
    reportJson.displayId = report.displayId;

    return NextResponse.json(reportJson, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
