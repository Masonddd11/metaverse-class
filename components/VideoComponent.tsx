"use client";

import { QuestionSet, Video } from "@/lib/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import YouTube from "react-youtube";

export default function VideoComponent({
  questionInfo,
  videos,
}: {
  questionInfo: {
    title: string;
    questionSetId: string;
  };
  videos: Video[];
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      handleVideoWatched();
    }
  };

  async function handleVideoWatched() {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/question-sets/video/watched", {
        method: "POST",
        body: JSON.stringify({ questionSetId: questionInfo.questionSetId }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to mark video as watched");
      }
    } catch (error) {
      console.error("Error marking video as watched:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentVideo = videos[currentVideoIndex];
  const hasNextVideo = currentVideoIndex < videos.length - 1;

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(currentVideo.url);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="mx-auto mt-8 w-[70%]">
        <h2 className="text-2xl font-bold mb-4">{questionInfo.title}</h2>
        <div className="mb-4">
          <YouTube
            videoId={videoId || ""}
            className="aspect-video"
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
              },
            }}
          />
        </div>
        <Button
          onClick={handleNextVideo}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            !isSubmitting
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting
            ? "Submitting..."
            : hasNextVideo
            ? "Next Video"
            : "Answer Questions"}
        </Button>
        <div className="mt-4">
          <p>
            Video {currentVideoIndex + 1} of {videos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
