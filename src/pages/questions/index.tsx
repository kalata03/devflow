import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type QuestionWithCount = Prisma.QuestionGetPayload<{
  include: { _count: { select: { answers: true } } };
}>;

export default function QuestionsPage() {
    
    const { data, isLoading } = useQuery({
        queryKey: ['questions'],
        queryFn: async() => {
            const res = await fetch('/api/questions')
            return res.json();
        }
    })

    if (isLoading) return <p className="p-6 text-gray-500">Loading...</p>;
    
    return (
        <main className="max-w-2xl mx-auto p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Questions</h1>
            <Link href="/questions/create">
              <Button size="sm">+ New</Button>
            </Link>
          </div>
    
          <section className="flex flex-col gap-3">
            {data?.questions.map((q: QuestionWithCount) => (
              <Link key={q.id} href={`/questions/${q.id}`} className="block">
                <Card className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-150">
                <CardContent>
                    <h2 className="text-base font-medium text-gray-900 truncate">
                      {q.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {q.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      💬 {q._count.answers} {q._count.answers === 1 ? "answer" : "answers"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
    
            {data?.questions.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No questions yet — create one!
              </p>
            )}
          </section>
        </main>
      );
}