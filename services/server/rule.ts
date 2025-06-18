import {
  RuleResponse,
  RulePost,
  RulePatch,
  RuleResponseSchema,
} from "../../types/zod/rule";
import { APIService } from "./api";

export class RuleService extends APIService {
  constructor() {
    super();
  }

  async getAllRules(): Promise<RuleResponse[]> {
    try {
      const response = await this.get<any[]>(`/rules`);
      return response.data.map((rule) => RuleResponseSchema.parse(rule));
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async createRule(data: RulePost): Promise<RuleResponse> {
    try {
      const response = await this.post<RulePost, any>(`/rules/`, data);
      return RuleResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async getRuleById(id: string): Promise<RuleResponse> {
    try {
      const response = await this.get<any>(`/rules/${id}`);
      return RuleResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async updateRuleById(id: string, data: RulePatch): Promise<RuleResponse> {
    try {
      const response = await this.patch<RulePatch, any>(`/rules/${id}`, data);
      return RuleResponseSchema.parse(response.data);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }

  async deleteRuleById(id: string) {
    try {
      await this.delete(`/rules/${id}`);
    } catch (error: any) {
      throw {
        message: error?.response?.data.message || "An unknown error occurred.",
        status: error?.response?.status,
      };
    }
  }
}
