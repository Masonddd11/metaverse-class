import React from "react";
import { validateRequest } from "../../../lib/auth";
import { redirect } from "next/navigation";
import VideoComponent from "@/components/VideoComponent";
import { getQuestionSetById } from "@/server-actions/question-actions";
import prisma from "@/lib/db";

export default async function QuestionsPage({
  params,
}: {
  params: { number: string };
}) {
  const { session } = await validateRequest();

  if (!session) {
    redirect(`/signin?questionId=${params.number}`);
  }

  const userProgress = await prisma.userProgress.findUnique({
    where: {
      userId_questionSetId: {
        userId: session.userId,
        questionSetId: params.number,
      },
    },
  });

  const currentQuestionSet = await getQuestionSetById(params.number);

  if (!currentQuestionSet) {
    return <div>Question not found</div>;
  }

  return (
    <div>
      {!userProgress?.allVideosWatched ? (
        <VideoComponent questionSet={currentQuestionSet} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
