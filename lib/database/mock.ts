import { DatabaseInterface, SubMind, Task, TaskStatus } from './types';

class MockDatabase implements DatabaseInterface {
  private subminds: SubMind[] = [];
  private tasks: Task[] = [];

  constructor() {
    // Initialize with some mock data
    this.subminds = [
      {
        id: '1',
        name: 'Research Assistant',
        description: 'Helps with academic research and paper summaries',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
        tasks: [],
      },
      {
        id: '2',
        name: 'Code Reviewer',
        description: 'Reviews code and suggests improvements',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(),
        tasks: [],
      },
    ];

    this.tasks = [
      {
        id: '1',
        command: 'Summarize the latest AI research papers',
        status: TaskStatus.COMPLETED,
        result: 'Summary of 5 papers completed',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(),
        subMindId: '1',
      },
      {
        id: '2',
        command: 'Review pull request #123',
        status: TaskStatus.PROCESSING,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        updatedAt: new Date(),
        subMindId: '2',
      },
    ];
  }

  async getSubMinds(): Promise<SubMind[]> {
    return this.subminds.map(submind => ({
      ...submind,
      tasks: this.tasks.filter(task => task.subMindId === submind.id),
    }));
  }

  async getSubMindById(id: string): Promise<SubMind | null> {
    const submind = this.subminds.find(s => s.id === id);
    if (!submind) return null;
    
    return {
      ...submind,
      tasks: this.tasks.filter(task => task.subMindId === id),
    };
  }

  async createSubMind(data: {
    name: string;
    description?: string;
  }): Promise<SubMind> {
    const newSubMind: SubMind = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    };

    this.subminds.push(newSubMind);
    return newSubMind;
  }

  async createTask(data: {
    command: string;
    subMindId: string;
    status?: TaskStatus;
  }): Promise<Task> {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      command: data.command,
      status: data.status || TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      subMindId: data.subMindId,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    result?: string
  ): Promise<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    task.status = status;
    task.result = result;
    task.updatedAt = new Date();

    return task;
  }

  async getRecentTasks(subMindId: string, limit: number = 3): Promise<Task[]> {
    return this.tasks
      .filter(task => task.subMindId === subMindId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}