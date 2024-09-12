import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const questionSet = await prisma.questionSet.create({
    data: {
      id: "set1",
      title: "Question 1: Introduction to React",
      questions: {
        create: [
          {
            id: "q1",
            text: "What is React?",
            options: ["A JS library", "A database", "A server"],
            correctAnswer: "A JS library",
          },
        ],
      },
    },
  });

  await prisma.video.createMany({
    data: [
      {
        id: "video1",
        title: "React Basics",
        url: "/videos/q1/video1.mp4",
        questionSetId: questionSet.id,
      },
      {
        id: "video2",
        title: "React Components",
        url: "/videos/q1/video2.mp4",
        questionSetId: questionSet.id,
      },
      {
        id: "video3",
        title: "React Hooks",
        url: "/videos/q1/video3.mp4",
        questionSetId: questionSet.id,
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
