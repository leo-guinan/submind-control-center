export interface SubMind {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
}

export interface Task {
  id: string;
  command: string;
  status: TaskStatus;
  result?: string;
  createdAt: Date;
  updatedAt: Date;
  subMindId: string;
}

export enum TaskStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export interface DatabaseInterface {
  // SubMind operations
  getSubMinds(): Promise<SubMind[]>;
  getSubMindById(id: string): Promise<SubMind | null>;
  createSubMind(data: { name: string; description?: string }): Promise<SubMind>;
  
  // Task operations
  createTask(data: {
    command: string;
    subMindId: string;
    status?: TaskStatus;
  }): Promise<Task>;
  updateTaskStatus(
    id: string,
    status: TaskStatus,
    result?: string
  ): Promise<Task>;
  getRecentTasks(subMindId: string, limit?: number): Promise<Task[]>;
}