import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const worker = new Worker(
  "tasks",
  async (job) => {
    const { taskId, command } = job.data;

    try {
      // Update task status to processing
      await prisma.task.update({
        where: { id: taskId },
        data: { status: "PROCESSING" },
      });

      // Simulate task processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Process the command (implement your actual command processing logic here)
      const result = `Processed command: ${command}`;

      // Update task with result
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: "COMPLETED",
          result,
        },
      });

      return result;
    } catch (error) {
      console.error(`Error processing task ${taskId}:`, error);
      // Update task status to failed
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: "FAILED",
          result: error instanceof Error ? error.message : "Unknown error",
        },
      });
      throw error;
    }
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`Task ${job.data.taskId} completed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`Task ${job.data.taskId} failed:`, error);
});

process.on("SIGTERM", async () => {
  await worker.close();
  await redis.quit();
  await prisma.$disconnect();
});