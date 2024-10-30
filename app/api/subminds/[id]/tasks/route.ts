import { NextResponse } from "next/server";
import { database, TaskStatus } from "@/lib/database";
import { Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const taskQueue = new Queue("tasks", {
  connection: redis,
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Verify SubMind exists
    const submind = await database.getSubMindById(params.id);
    if (!submind) {
      return NextResponse.json(
        { error: "SubMind not found" },
        { status: 404 }
      );
    }

    const task = await database.createTask({
      command: body.command,
      subMindId: params.id,
      status: TaskStatus.PENDING,
    });

    await taskQueue.add(
      "process-task",
      {
        taskId: task.id,
        command: body.command,
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}