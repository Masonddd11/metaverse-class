import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const questionSets = await prisma.questionSet.createMany({
    data: [
      {
        id: "set1",
        title: "Question Set 1: Introduction to React",
      },
      {
        id: "set2",
        title: "Question Set 2: Advanced React",
      },
      {
        id: "set3",
        title: "Question Set 3: React Performance",
      },
      {
        id: "set4",
        title: "Question Set 4: React State Management",
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      // Set 1 Questions
      {
        id: "q1",
        text: "What is React?",
        options: ["A JS library", "A database", "A server"],
        correctAnswer: "A JS library",
        questionSetId: "set1",
      },

      // Set 2 Questions
      {
        id: "q3",
        text: "What is JSX?",
        options: ["A JS extension", "A framework", "A language"],
        correctAnswer: "A JS extension",
        questionSetId: "set2",
      },

      // Set 3 Questions
      {
        id: "q5",
        text: "How can you optimize React performance?",
        options: ["Use React.memo", "Use synchronous rendering", "Avoid state"],
        correctAnswer: "Use React.memo",
        questionSetId: "set3",
      },

      // Set 4 Questions
      {
        id: "q7",
        text: "What is React Context used for?",
        options: [
          "Managing global state in a React application",
          "Creating reusable components",
          "Managing side-effects",
        ],
        correctAnswer: "Managing global state in a React application",
        questionSetId: "set4",
      },
    ],
  });

  await prisma.video.createMany({
    data: [
      // Videos for Set 1
      {
        id: "video1",
        title: "React Basics",
        url: "/videos/q1/video1.mp4",
        questionSetId: "set1",
      },

      // Videos for Set 2
      {
        id: "video2",
        title: "Advanced JSX",
        url: "/videos/q2/video1.mp4",
        questionSetId: "set2",
      },

      // Videos for Set 3
      {
        id: "video3",
        title: "Optimizing React Performance",
        url: "/videos/q3/video1.mp4",
        questionSetId: "set3",
      },

      // Videos for Set 4
      {
        id: "video4",
        title: "React Context API",
        url: "/videos/q4/video1.mp4",
        questionSetId: "set4",
      },
    ],
  });

  console.log("Seed data for question sets and videos created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
