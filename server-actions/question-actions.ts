/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { QuestionSet } from "@/lib/types";

export async function getQuestionSetById(
  id: string
): Promise<QuestionSet | null> {
  const questionSet = await prisma.questionSet.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  });

  if (!questionSet) return null;

  // Fetch videos separately as they're not directly related in the schema
  const videos = await prisma.video.findMany({
    where: { questionSetId: id },
  });

  return {
    ...questionSet,
    videos,
  };
}
