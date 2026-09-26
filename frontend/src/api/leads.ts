import axios from "axios";

import type { Lead, LeadStatus, LeadsListResponse, LeadResponse, NewLeadInput } from "../types/lead";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchLeads = async (params: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<LeadsListResponse> => {
  const response = await api.get<LeadsListResponse>("/leads", {
    params,
  });

  return response.data;
};

export const createLead = async (payload: NewLeadInput): Promise<LeadResponse> => {
  const response = await api.post<LeadResponse>("/leads", payload);
  return response.data;
};

export const updateLeadStatus = async (id: number, status: LeadStatus): Promise<LeadResponse> => {
  const response = await api.patch<LeadResponse>(`/leads/${id}/status`, { status });
  return response.data;
};

export type { Lead, LeadStatus, LeadResponse, LeadsListResponse, NewLeadInput };
