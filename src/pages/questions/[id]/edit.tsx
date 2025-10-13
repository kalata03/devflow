import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { toast } from "sonner"

export default function QuestionEditPage() {
    const router = useRouter();
    const { id } = router.query;
    const queryClient = new QueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['questions', id],
        enabled: !!id,
        queryFn: async() => {
            const res = await fetch(`/api/questions/${id}`)
            return res.json();
        }
    })

    const mutation = useMutation({
        mutationFn: async(updated: {title: string, description: string}) => {
            const res = await fetch(`/api/questions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              });

              if (!res.ok) throw new Error("Failed to update question");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions', id]});
            queryClient.invalidateQueries({ queryKey: ['questions']});
            toast.success("Question updated successfully!");
            router.push(`/questions/${id}`);
        },
        onError: () => {
            toast.error("Failed to update question");
        },
    })

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (data?.question) {
            setTitle(data.question.title);
            setDescription(data.question.description);
        }
    }, [data])

    if (isLoading) {
        return (
          <main className="flex min-h-screen items-center justify-center">
            <p className="text-gray-500 animate-pulse">Loading question...</p>
          </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">
          <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                ✏️ Edit Question
              </CardTitle>
            </CardHeader>
    
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutation.mutate({ title, description });
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <Input
                    placeholder="Enter question title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <Textarea
                    placeholder="Add more details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
    
                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full transition-colors"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Updating..." : "💾 Save Changes"}
                  </Button>
    
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-100"
                    onClick={() => router.push(`/questions/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      );
} 