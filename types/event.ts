export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  status?: "pending" | "completed" | "cancelled";
}
