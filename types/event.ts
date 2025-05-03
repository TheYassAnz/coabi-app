export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  priority?: "high" | "medium" | "low";
  status?: "pending" | "completed" | "cancelled";
}
