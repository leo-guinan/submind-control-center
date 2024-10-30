"use client";

import { useEffect, useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskCommand } from "@/components/task-command";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SubMind {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  tasks: Array<{
    id: string;
    command: string;
    status: string;
    result?: string;
  }>;
}

export function SubMindList() {
  const [subminds, setSubminds] = useState<SubMind[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubMinds();
  }, []);

  async function fetchSubMinds() {
    try {
      const response = await fetch("/api/subminds");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSubminds(data);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch SubMinds";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-destructive text-center">
            {error}. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (subminds.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Brain className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No SubMinds created yet. Create your first one to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subminds.map((submind) => (
        <Card key={submind.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {submind.name}
            </CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(submind.createdAt))} ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submind.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {submind.description}
              </p>
            )}
            <TaskCommand submindId={submind.id} onTaskCreated={fetchSubMinds} />
            {submind.tasks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Recent Tasks</h4>
                <div className="space-y-2">
                  {submind.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="text-sm p-2 rounded-md bg-muted/50"
                    >
                      <p className="font-medium">{task.command}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {task.status}
                      </p>
                      {task.result && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Result: {task.result}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}