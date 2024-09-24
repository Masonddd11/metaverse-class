import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionSetId, answers } = await request.json();

    console.log("questionSetId", questionSetId);
    console.log("answers", answers);

    if (!questionSetId || !answers) {
      return NextResponse.json(
        { error: "Question set ID and answers are required" },
        { status: 400 }
      );
    }

    const questionSet = await prisma.questionSet.findUnique({
      where: { id: questionSetId },
      include: { questions: true },
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    let score = 0;
    questionSet.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        console.log("Correct answer:", question.correctAnswer);
        console.log("User answer:", answers[question.id]);
        score += 1;
      }
    });

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
