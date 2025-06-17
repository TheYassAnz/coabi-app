import {
  EventResponse,
  EventPost,
  EventPatch,
  EventResponseSchema,
} from "../../types/zod/event";
import { APIService } from "./api";

export class EventService extends APIService {
  constructor() {
    super();
  }

  async getAllEvents(): Promise<EventResponse[]> {
    try {
      const response = await this.get<any[]>(`/events`);
      return response.data.map((event) => EventResponseSchema.parse(event));
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async createEvent(data: EventPost): Promise<EventResponse> {
    try {
      const response = await this.post<EventPost, any>(`/events/`, data);
      return EventResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async getEventById(id: string): Promise<EventResponse> {
    try {
      const response = await this.get<any>(`/events/${id}`);
      return EventResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async updateEventById(id: string, data: EventPatch): Promise<EventResponse> {
    try {
      const response = await this.patch<EventPatch, any>(`/events/${id}`, data);
      return EventResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async deleteEventById(id: string) {
    try {
      await this.delete(`/events/${id}`);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async filterEvents(
    filters: Record<string, any> = {},
  ): Promise<EventResponse[]> {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await this.get<any[]>(`/events/filter?${query}`);
      return response.data.map((event) => EventResponseSchema.parse(event));
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }
}
