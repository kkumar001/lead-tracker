import { useCallback, useEffect, useRef, useState } from "react";

import { createLead, fetchLeads, updateLeadStatus } from "../api/leads";
import type { Lead, LeadStatus, LeadResponse, LeadsListResponse, NewLeadInput } from "../types/lead";

interface Pagination {
  page: number;
  size: number;
  totalPages: number;
}

const initialPagination: Pagination = {
  page: 1,
  size: 10,
  totalPages: 1,
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<number[]>([]);

  const searchTimeoutRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const getApiErrorMessage = useCallback((caughtError: unknown, fallback: string) => {
    if (typeof caughtError === "object" && caughtError !== null && "response" in caughtError) {
      const response = (caughtError as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        return response.data.message;
      }
    }

    return caughtError instanceof Error ? caughtError.message : fallback;
  }, []);

  const loadLeads = useCallback(
    async (nextPage: number, nextSearch: string) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const response: LeadsListResponse = await fetchLeads({
          page: nextPage,
          pageSize: pagination.size,
          search: nextSearch,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setLeads(response.data);
        setPagination(response.pagination);
      } catch (caughtError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        const message = getApiErrorMessage(caughtError, "Could not load leads.");
        setError(message);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [getApiErrorMessage, pagination.size],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    void loadLeads(page, debouncedSearch);
  }, [page, debouncedSearch, loadLeads]);

  const addLead = useCallback(
    async (input: NewLeadInput): Promise<{ success: boolean; message?: string }> => {
      setIsCreating(true);
      setError(null);

      try {
        const response: LeadResponse = await createLead(input);
        setLeads((currentLeads) => [response.data, ...currentLeads]);
        setPage(1);
        setSearch("");
        await loadLeads(1, "");
        return { success: true };
      } catch (caughtError) {
        const message = getApiErrorMessage(caughtError, "Could not create lead. Please try again.");
        return { success: false, message };
      } finally {
        setIsCreating(false);
      }
    },
    [getApiErrorMessage, loadLeads],
  );

  const changeStatus = useCallback(
    async (id: number, status: LeadStatus): Promise<boolean> => {
      const previousLead = leads.find((lead) => lead.id === id);
      const previousStatus = previousLead?.status ?? status;

      setUpdatingStatusIds((currentIds) => (currentIds.includes(id) ? currentIds : [...currentIds, id]));

      if (previousLead) {
        setLeads((currentLeads) =>
          currentLeads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        );
      }

      try {
        const response: LeadResponse = await updateLeadStatus(id, status);
        setLeads((currentLeads) =>
          currentLeads.map((lead) => (lead.id === id ? response.data : lead)),
        );
        setError(null);
        return true;
      } catch (caughtError) {
        setLeads((currentLeads) =>
          currentLeads.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  status: previousStatus,
                }
              : lead,
          ),
        );

        const message = getApiErrorMessage(caughtError, "Could not update status.");
        setError(message);
        return false;
      } finally {
        setUpdatingStatusIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
      }
    },
    [getApiErrorMessage, leads],
  );

  return {
    leads,
    pagination,
    search,
    page,
    loading,
    error,
    isCreating,
    updatingStatusIds,
    setSearch,
    setPage,
    addLead,
    changeStatus,
  };
};
