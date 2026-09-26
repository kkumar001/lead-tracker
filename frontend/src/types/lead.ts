export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  created_at?: string;
  createdAt?: string;
}

export interface NewLeadInput {
  name: string;
  email: string;
  phone: string;
}

export interface LeadsListResponse {
  status: string;
  message: string;
  data: Lead[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface LeadResponse {
  status: string;
  message: string;
  data: Lead;
}
