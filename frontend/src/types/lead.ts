export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_at: string;
}

export interface NewLeadInput {
  name: string;
  email: string;
  phone: string;
}
