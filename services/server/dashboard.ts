import { z } from "zod";
import { APIService } from "./api";
import { EventResponseSchema } from "@/types/zod/event";
import { RefundResponseSchema } from "@/types/zod/refund";
import { TaskResponseSchema } from "@/types/zod/task";

export class DashboardService extends APIService {
  constructor() {
    super();
  }

  async getUserTasks(): Promise<ReturnType<typeof TaskResponseSchema.parse>[]> {
    const response = await this.get("/tasks/user");
    return z.array(TaskResponseSchema).parse(response.data);
  }

  async getUserEvents(): Promise<
    ReturnType<typeof EventResponseSchema.parse>[]
  > {
    const response = await this.get("/events/user");
    return z.array(EventResponseSchema).parse(response.data);
  }

  async getUserRefunds(): Promise<
    ReturnType<typeof RefundResponseSchema.parse>[]
  > {
    const response = await this.get("/refunds/user");
    return z.array(RefundResponseSchema).parse(response.data);
  }
}
