import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to DevFlow 🚀</h1>
      <p className="text-gray-600 max-w-md mb-6">
        A modern Q&A platform built with <strong>Next.js</strong>, <strong>React Query</strong>, and <strong>Prisma</strong>.
      </p>

      <div className="flex gap-4">
        <Link href="/questions">
          <Button size="lg">View Questions</Button>
        </Link>
        <Link href="/auth/signin">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </main>
  );
}
