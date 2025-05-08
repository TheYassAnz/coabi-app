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
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async createTask(data: TaskPost): Promise<TaskResponse> {
    try {
      const response = await this.post<TaskPost, any>(`/tasks/`, data);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async getTaskById(id: string): Promise<TaskResponse> {
    try {
      const response = await this.get<any>(`/tasks/${id}`);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async updateTaskById(id: string, data: TaskPatch): Promise<TaskResponse> {
    try {
      const response = await this.patch<TaskPatch, any>(`/tasks/${id}`, data);
      return TaskResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async deleteTaskById(id: string) {
    try {
      await this.delete(`/tasks/${id}`);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
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
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }
}
