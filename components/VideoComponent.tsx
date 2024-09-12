"use client";

import { QuestionSet } from "@/lib/types";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

export default function VideoComponent({
  questionSet,
}: {
  questionSet: QuestionSet;
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastValidTime, setLastValidTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      setIsVideoComplete(true);
    };

    const handleTimeUpdate = () => {
      setLastValidTime(videoElement.currentTime);
    };

    const handleSeeked = () => {
      if (videoElement.currentTime > lastValidTime) {
        videoElement.currentTime = lastValidTime;
      }
    };

    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("seeked", handleSeeked);

    return () => {
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("seeked", handleSeeked);
    };
  }, [currentVideoIndex, lastValidTime]);

  const handleNextVideo = () => {
    if (currentVideoIndex < questionSet.videos.length) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsVideoComplete(false);
    } else {
      console.log("All videos watched");
    }
  };

  function handleVideoWatched() {
    fetch("/api/auth/question-sets/video-watched", {
      method: "POST",
      body: JSON.stringify({ questionSetId: questionSet.id }),
    });
  }

  const currentVideo = questionSet.videos[currentVideoIndex];

  const hasNextVideo = currentVideoIndex < questionSet.videos.length - 1;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-5xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4">{questionSet.title}</h2>
        <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
        <video
          ref={videoRef}
          className="w-full mb-4"
          key={currentVideo.id}
          controls
          onSeeking={(e) => {
            const video = e.currentTarget;
            if (video.currentTime > video.duration) {
              video.currentTime = video.duration;
              video.pause();
            }
          }}
        >
          <source src={currentVideo.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Button
          onClick={hasNextVideo ? handleNextVideo : handleVideoWatched}
          disabled={!isVideoComplete}
          className={`px-4 py-2 rounded ${
            isVideoComplete
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {hasNextVideo ? "Next Video" : "Answer Questions"}
        </Button>
        {!isVideoComplete && (
          <p className="mt-2 text-sm text-gray-600">
            Please watch the entire video to proceed.
          </p>
        )}
        <div className="mt-4">
          <p>
            Video {currentVideoIndex + 1} of {questionSet.videos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
