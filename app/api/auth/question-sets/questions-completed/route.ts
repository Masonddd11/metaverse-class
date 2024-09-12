import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSetId, score } = await request.json();

    if (!questionSetId || score === undefined) {
      return NextResponse.json(
        { error: "Question set ID and score are required" },
        { status: 400 }
      );
    }

    const updatedProgress = await prisma.userProgress.update({
      where: {
        userId_questionSetId: {
          userId: session.userId,
          questionSetId,
        },
      },
      data: {
        points: score,
        completed: true,
      },
    });

    return NextResponse.json({
      message: "Question set completed successfully",
      progress: updatedProgress,
    });
  } catch (error) {
    console.error("Error in complete question set API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
