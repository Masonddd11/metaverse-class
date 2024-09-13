import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSetId } = await request.json();

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_questionSetId: {
          userId: session.userId,
          questionSetId: questionSetId,
        },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { error: "User progress not found" },
        { status: 404 }
      );
    }

    const updatedUserProgress = await prisma.userProgress.update({
      where: {
        id: userProgress.id,
        questionSetId: questionSetId,
      },
      data: {
        allVideosWatched: false,
      },
    });

    return NextResponse.json({
      message: "Video rewatch status updated successfully",
      progress: updatedUserProgress,
    });
  } catch (error) {
    console.error("Error in video rewatch API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
