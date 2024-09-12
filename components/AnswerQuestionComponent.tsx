"use client";

import React, { useState } from "react";
import { Question } from "@/lib/types";
import { Button } from "./ui/button";

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

  const currentQuestion = questions[currentQuestionIndex];
  const hasNextQuestion = currentQuestionIndex < questions.length - 1;

  const handleSubmit = () => {
    fetch("/api/auth/question-sets/questions-completed", {
      method: "POST",
      body: JSON.stringify({
        score,
        questionSetId: questionInfo.questionSetId,
      }),
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (
      selectedAnswer === currentQuestion.correctAnswer &&
      !answeredQuestions.includes(currentQuestion.id)
    ) {
      setScore(score + 1);
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    if (hasNextQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      console.log("Score: ", score);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="text-xl mb-8 text-center text-gray-700">
          {currentQuestion.text}
        </p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full py-3 text-lg transition-colors ${
                selectedAnswer === option
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button
          onClick={hasNextQuestion ? handleNextQuestion : handleSubmit}
          disabled={!selectedAnswer}
          className="mt-8 w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasNextQuestion ? "Next Question" : "Finish"}
        </Button>
      </div>
    </div>
  );
}
