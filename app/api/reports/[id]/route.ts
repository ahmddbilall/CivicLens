import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Report from "@/lib/models/Report";
import { auth } from "@/lib/auth";

export async function DELETE(
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
      return NextResponse.json({ error: "Unauthorized to delete this case" }, { status: 403 });
    }

    await Report.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
