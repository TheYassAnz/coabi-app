import {
  TaskResponse,
  TaskPost,
  TaskPatch,
  TaskResponseSchema,
} from "../../types/zod/task";
import { APIService } from "./api";

export class TaskService extends APIService {
  constructor() {
    super();
  }

  async getAllTasks(): Promise<TaskResponse[]> {
    try {
      const response = await this.get<any[]>(`/tasks`);
      return response.data.map((task) => TaskResponseSchema.parse(task));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async createTask(data: TaskPost): Promise<TaskResponse> {
    try {
      const response = await this.post<TaskPost, any>(`/tasks/`, data);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async getTaskById(id: number): Promise<TaskResponse> {
    try {
      const response = await this.get<any>(`/tasks/${id}`);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async updateTaskById(id: number, data: TaskPatch): Promise<TaskResponse> {
    try {
      const response = await this.patch<TaskPatch, any>(`/tasks/${id}`, data);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async deleteTaskById(id: number) {
    try {
      const response = await this.delete(`/tasks/${id}`);
      if (response.status !== 204) {
        throw new Error("Failed to delete task.");
      }
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async filterTasks(
    filters: Record<string, any> = {},
  ): Promise<TaskResponse[]> {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await this.get<any[]>(`/tasks/filter?${query}`);
      return response.data.map((task) => TaskResponseSchema.parse(task));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }
}
