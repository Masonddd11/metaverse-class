import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const questionSets = await prisma.questionSet.createMany({
    data: [
      {
        id: "set1",
        title: "Leung Fei Tung",
      },
      {
        id: "set2",
        title: "D2 Place",
      },
      {
        id: "set3",
        title: "Jeff Leung",
      },
      {
        id: "set4",
        title: "Alice So",
      },
      {
        id: "set5",
        title: "Youth Mental Health",
      },
    ],
  });

  await prisma.question.createMany({
    data: [
      // Set 1 Questions (Leung Fei Tung)
      {
        id: "q1",
        text: "What colour are Feitung's opera shoes in her studio when she practices?",
        options: ["Purple", "Yellow", "Red", "Blue"],
        correctAnswer: "Red",
        questionSetId: "set1",
      },
      {
        id: "q2",
        text: "What was the most memorable project that Fei Tung did at CityUHk?",
        options: ["Bamboo theatre", "Hong Kong Milk Tea", "Hong Kong Signage", "Fire Dragon"],
        correctAnswer: "Bamboo theatre",
        questionSetId: "set1",
      },

      // Set 2 Question (D2 Place)
      {
        id: "q3",
        text: "What does \"D2\" in D2 place stand for?",
        options: ["Driving Dreams", "Designer's Dream", "Dedicated Designers", "Day Dreams"],
        correctAnswer: "Driving Dreams",
        questionSetId: "set2",
      },

      // Set 3 Questions (Jeff Leung)
      {
        id: "q4",
        text: "What was Jeff's first stop of visiting in the video?",
        options: ["Subdivided Housing", "Elderly House", "Ethnic Minority Center", "Sham Shui Po Market"],
        correctAnswer: "Subdivided Housing",
        questionSetId: "set3",
      },
      {
        id: "q5",
        text: "What is the super power that Jeff hopes he has?",
        options: ["Accessible Elderly Care", "Affordable Housing for All", "Quality Education for Children", "Community Wellbeing and Happiness"],
        correctAnswer: "Community Wellbeing and Happiness",
        questionSetId: "set3",
      },

      // Set 4 Questions (Alice So)
      {
        id: "q6",
        text: "According to Alice So, what was Not the key vibe of Cyberport?",
        options: ["Innovative", "Transformative", "Proactive", "Collaborative"],
        correctAnswer: "Proactive",
        questionSetId: "set4",
      },
      {
        id: "q7",
        text: "What might NOT be a key part of the future of entrepreneurship that Alice sees?",
        options: ["Data Usage", "A.I Application", "Digital Entertainment", "Sustainability and green financing"],
        correctAnswer: "Digital Entertainment",
        questionSetId: "set4",
      },

      // Set 5 Questions (Youth Mental Health)
      {
        id: "q8",
        text: "From the trailer, how many main characters in the coming film?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "Three",
        questionSetId: "set5",
      },
      {
        id: "q9",
        text: "How many psychiatrists in Hong Kong?",
        options: ["Around 400", "Around 600", "Around 800", "Around 1000"],
        correctAnswer: "Around 400",
        questionSetId: "set5",
      },
    ],
  });

  await prisma.video.createMany({
    data: [
      {
        id: "video1",
        title: "Leung Fei Tung",
        url: "https://youtu.be/Wbyje5oyYyI",
        questionSetId: "set1",
      },
      {
        id: "video2",
        title: "D2 Place",
        url: "https://youtu.be/BsYrQSVd0do",
        questionSetId: "set2",
      },
      {
        id: "video3",
        title: "Jeff Leung",
        url: "https://youtu.be/your_jeff_leung_video_id",
        questionSetId: "set3",
      },
      {
        id: "video4",
        title: "Alice So",
        url: "https://youtu.be/your_alice_so_video_id",
        questionSetId: "set4",
      },
      {
        id: "video5",
        title: "Youth Mental Health",
        url: "https://youtu.be/your_youth_mental_health_video_id",
        questionSetId: "set5",
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
