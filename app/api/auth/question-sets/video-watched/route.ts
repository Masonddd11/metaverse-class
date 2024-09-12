import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSetId } = await request.json();

    console.log("questionSetId", questionSetId);

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    const userProgress = await prisma.userProgress.create({
      data: {
        userId: session.userId,
        questionSetId,
        allVideosWatched: true,
        points: 0,
        completed: false,
      },
    });

    return NextResponse.json({
      message: "Video watched status updated successfully",
      progress: userProgress,
    });
  } catch (error) {
    console.error("Error in video-watched API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
