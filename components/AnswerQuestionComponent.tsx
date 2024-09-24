"use client";

import React, { useState } from "react";
import { Question } from "@/lib/types";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AnswerQuestionComponentProps {
  questions: Question[];
  questionInfo: {
    title: string;
    questionSetId: string;
  };
}

export default function AnswerQuestionComponent({
  questions,
  questionInfo,
}: AnswerQuestionComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRewatching, setIsRewatching] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const hasNextQuestion = currentQuestionIndex < questions.length - 1;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    correctAnswer();
    try {
      const response = await fetch(
        "/api/auth/question-sets/questions-completed",
        {
          method: "POST",
          body: JSON.stringify({
            score,
            questionSetId: questionInfo.questionSetId,
          }),
        }
      );
      if (response.ok) {
        router.refresh();
        router.push("/metaverse");
      } else {
        console.error("Failed to submit questions");
      }
    } catch (error) {
      console.error("Error submitting questions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  function correctAnswer() {
    if (
      selectedAnswer === currentQuestion.correctAnswer &&
      !answeredQuestions.includes(currentQuestion.id)
    ) {
      setScore(score + 1);
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }
  }

  const handleNextQuestion = () => {
    correctAnswer();
    if (hasNextQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      console.log("Score: ", score);
    }
  };

  const handleRewatchVideo = async () => {
    setIsRewatching(true);
    try {
      const response = await fetch("/api/auth/question-sets/video/rewatch", {
        method: "POST",
        body: JSON.stringify({ questionSetId: questionInfo.questionSetId }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to rewatch video");
      }
    } catch (error) {
      console.error("Error rewatching video:", error);
    } finally {
      setIsRewatching(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl w-full mx-auto p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-800">
          {questionInfo.title}
        </h2>
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <p className="text-2xl mb-10 text-center text-gray-700 font-medium">
          {currentQuestion.text}
        </p>
        <div className="space-y-4 mb-10">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full py-4 text-lg transition-all duration-200 rounded-lg ${
                selectedAnswer === option
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white transform scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-md"
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={hasNextQuestion ? handleNextQuestion : handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full py-4 text-xl bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isSubmitting
              ? "Submitting..."
              : hasNextQuestion
              ? "Next Question"
              : "Finish"}
          </Button>
          <Button
            onClick={handleRewatchVideo}
            disabled={isRewatching}
            className="w-full py-4 text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isRewatching ? "Rewatching..." : "Rewatch Video"}
          </Button>
        </div>
      </div>
    </div>
  );
}
