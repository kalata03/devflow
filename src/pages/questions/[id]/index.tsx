import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function QuestionDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [content, setContent] = useState("");

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['questions', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await fetch(`/api/questions/${id}`);
            if (!res.ok) throw new Error("Failed to fetch question");
            return res.json();
          },
    })

    const {data:answers} = useQuery({
      queryKey: ['answers', id],
      enabled: !!id,
      queryFn: async () => {
        const res = await fetch(`/api/questions/${id}/answers`);
        return res.json();
      }
    })

    const answerMutation = useMutation({
      mutationFn: async(newAnswer: { content: string}) => {
        const res = await fetch(`/api/questions/${id}/answers`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(newAnswer)
        });

        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['answers', id]});
        toast.success("Answer sucessfully added");
      }
      
    })

    const deleteMutation = useMutation({
        mutationFn: async() => {
            const res = await fetch(`/api/questions/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete question');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            toast.success("Question deleted successfully");
            router.push("/questions");
          },
          onError: () => {
            toast.error("Failed to delete question");
          },
    })

    if (isLoading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (isError) return <p className="p-6 text-red-500">Failed to load question</p>;

    const question = data?.question;

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/questions")}>
              ← Back
            </Button>
    
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/questions/${id}/edit`)}
              >
                ✏️ Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this question?")
                  ) {
                    deleteMutation.mutate();
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
    
          <Card className="border border-gray-200 shadow-md">
            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {question?.title}
              </h1>
              <p className="text-gray-700 leading-relaxed">
                {question?.description}
              </p>
    
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Created at:{" "}
                  <span className="font-medium">
                    {new Date(question?.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
  <h2 className="text-lg font-semibold">Answers</h2>

  <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg border border-gray-200">
    {answers?.answers?.length ? (
      <div className="space-y-3 p-2">
        {answers.answers.map((a: any) => (
          <Card
            key={a.id}
            className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4 text-sm text-gray-800">
              {a.content}
              <p className="text-xs text-gray-500 mt-2">
                Posted {new Date(a.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 p-3">
        No answers yet — be the first!
      </p>
    )}
  </div>
</section>

          <form
        onSubmit={(e) => {
          e.preventDefault();
          answerMutation.mutate({ content });
        }}
        className="space-y-3"
      >
        <Input
          placeholder="Write your answer..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button disabled={answerMutation.isPending}>
          {answerMutation.isPending ? "Posting..." : "Post Answer"}
        </Button>
      </form>
        </main>
      );
}