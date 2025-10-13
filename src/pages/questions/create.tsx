import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateQuestionPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async(newQuestion: { title: string, description: string}) => {
          const res = await fetch('/api/questions', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQuestion),
          })

          return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
            toast.success("Question created successfully 🎉", { closeButton: true });
            router.push("/questions");
        },
        onError: () => {
          toast.error("Failed to create question ❌", { closeButton: true });
        },
    })

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
          <Card className="w-full max-w-md shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-semibold">
                Create New Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutation.mutate({ title, description });
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <Input
                    placeholder="Enter your question title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
    
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Input
                    placeholder="Write a short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
    
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full mt-2"
                >
                {mutation.isPending ? "Creating..." : "Create Question"}
          </Button>
    
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/questions")}
                  className="w-full"
                >
                  ← Back to Questions
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
    );
}