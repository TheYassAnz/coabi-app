import {
  RefundResponse,
  RefundBatchPost,
  RefundPatch,
  RefundResponseSchema,
} from "../../types/zod/refund";
import { APIService } from "./api";

export class RefundService extends APIService {
  constructor() {
    super();
  }

  async getAllRefunds(): Promise<RefundResponse[]> {
    try {
      const response = await this.get<any[]>(`/refunds`);
      return response.data.map((refund) => RefundResponseSchema.parse(refund));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async createRefunds(data: RefundBatchPost): Promise<RefundResponse[]> {
    try {
      const response = await this.post<RefundBatchPost, any[]>(
        `/refunds/`,
        data,
      );
      return response.data.map((refund) => RefundResponseSchema.parse(refund));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async getRefundById(id: number): Promise<RefundResponse> {
    try {
      const response = await this.get<any>(`/refunds/${id}`);
      return RefundResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async updateRefundById(
    id: number,
    data: RefundPatch,
  ): Promise<RefundResponse> {
    try {
      const response = await this.patch<RefundPatch, any>(
        `/refunds/${id}`,
        data,
      );
      return RefundResponseSchema.parse(response.data);
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async deleteRefundById(id: number) {
    try {
      const response = await this.delete(`/refunds/${id}`);
      if (response.status !== 204) {
        throw new Error("Failed to delete refund.");
      }
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }

  async filterRefunds(
    filters: Record<string, any> = {},
  ): Promise<RefundResponse[]> {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await this.get<any[]>(`/refunds/filter?${query}`);
      return response.data.map((refund) => RefundResponseSchema.parse(refund));
    } catch (error: any) {
      throw error?.response?.data || new Error("Unknown error occurred.");
    }
  }
}
