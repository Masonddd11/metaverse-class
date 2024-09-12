import React from "react";
import { validateRequest } from "../../../lib/auth";
import { redirect } from "next/navigation";
import VideoComponent from "@/components/VideoComponent";
import { QuestionSet } from "@/lib/types";
import { getQuestionSetById } from "@/server-actions/question-actions";

export default async function QuestionsPage({
  params,
}: {
  params: { number: string };
}) {
  const { session } = await validateRequest();

  if (!session) {
    redirect(`/signin?questionId=${params.number}`);
  }

  const currentQuestionSet = await getQuestionSetById(params.number);

  if (!currentQuestionSet) {
    return <div>Question not found</div>;
  }

  return (
    <div>
      <VideoComponent questionSet={currentQuestionSet} />
    </div>
  );
}
