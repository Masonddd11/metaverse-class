import { redirect } from "next/navigation";
import { validateRequest } from "../lib/auth";
import Hero from "@/components/Hero";

export default async function HomePage() {
  const { user } = await validateRequest();

  return (
    <div>
      <Hero />
    </div>
  );
}
