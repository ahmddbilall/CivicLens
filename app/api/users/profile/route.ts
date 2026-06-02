import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userJson = user.toJSON();
    userJson.id = user._id.toString();

    return NextResponse.json(userJson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (data.preferences) {
      if (!user.preferences) user.preferences = {};
      if (data.preferences.pushNotifications !== undefined) user.preferences.pushNotifications = data.preferences.pushNotifications;
      if (data.preferences.emailAlerts !== undefined) user.preferences.emailAlerts = data.preferences.emailAlerts;
      if (data.preferences.language !== undefined) user.preferences.language = data.preferences.language;
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.city !== undefined) user.city = data.city;
    if (data.street !== undefined) user.street = data.street;
    if (data.area !== undefined) user.area = data.area;
    if (data.phone !== undefined) user.phone = data.phone;
    
    await user.save();

    const userJson = user.toJSON();
    userJson.id = user._id.toString();
    delete userJson.password;

    return NextResponse.json(userJson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
