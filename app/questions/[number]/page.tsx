import React from "react";
import { validateRequest } from "../../libs/auth";
import { redirect } from "next/navigation";

export default async function QuestionsPage({
  params,
}: {
  params: { number: string };
}) {
  const { session } = await validateRequest();

  if (!session) {
    redirect(`/signin?questionId=${params.number}`);
  }

  return <div></div>;
}
