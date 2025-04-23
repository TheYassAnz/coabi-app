import {
  AccommodationResponse,
  AccommodationPost,
  AccommodationPatch,
  AccommodationResponseSchema,
} from "../../types/zod/accommodation";
import { APIService } from "./api";

export class AccommodationService extends APIService {
  constructor() {
    super();
  }

  async getAllAccommodations(): Promise<AccommodationResponse[]> {
    try {
      const response = await this.get<any[]>(`/accommodations`);
      return response.data.map((accommodation) =>
        AccommodationResponseSchema.parse(accommodation),
      );
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async createAccommodation(
    data: AccommodationPost,
  ): Promise<AccommodationResponse> {
    try {
      const response = await this.post<AccommodationPost, any>(
        `/accommodations/`,
        data,
      );
      return AccommodationResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async getAccommodationById(id: number): Promise<AccommodationResponse> {
    try {
      const response = await this.get<any>(`/accommodations/${id}`);
      return AccommodationResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async updateAccommodationById(
    id: number,
    data: AccommodationPatch,
  ): Promise<AccommodationResponse> {
    try {
      const response = await this.patch<AccommodationPatch, any>(
        `/accommodations/${id}`,
        data,
      );
      return AccommodationResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async deleteAccommodationById(id: number) {
    try {
      const response = await this.delete(`/accommodations/${id}`);
      if (response.status !== 204) {
        throw new Error("Failed to delete accommodation.");
      }
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }
}
