import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
  try {
    const subminds = await database.getSubMinds();
    return NextResponse.json(subminds);
  } catch (error) {
    console.error("Failed to fetch SubMinds:", error);
    return NextResponse.json(
      { error: "Failed to fetch SubMinds" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submind = await database.createSubMind({
      name: body.name,
      description: body.description,
    });
    return NextResponse.json(submind);
  } catch (error) {
    console.error("Failed to create SubMind:", error);
    return NextResponse.json(
      { error: "Failed to create SubMind" },
      { status: 500 }
    );
  }
}