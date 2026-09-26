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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<number[]>([]);

  const searchTimeoutRef = useRef<number | null>(null);

  const loadLeads = useCallback(
    async (nextPage: number, nextSearch: string) => {
      setLoading(true);
      setError(null);

      try {
        const response: LeadsListResponse = await fetchLeads({
          page: nextPage,
          pageSize: pagination.size,
          search: nextSearch,
        });

        setLeads(response.data);
        setPagination(response.pagination);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Could not load leads.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [pagination.size],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setPage(1);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  useEffect(() => {
    void loadLeads(page, search);
  }, [page, search, loadLeads]);

  const addLead = useCallback(
    async (input: NewLeadInput): Promise<boolean> => {
      setIsCreating(true);
      setError(null);

      try {
        const response: LeadResponse = await createLead(input);
        setLeads((currentLeads) => [response.data, ...currentLeads]);
        setPage(1);
        setSearch("");
        await loadLeads(1, "");
        return true;
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Could not create lead. Please try again.";
        setError(message);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [loadLeads],
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

        const message = caughtError instanceof Error ? caughtError.message : "Could not update status.";
        setError(message);
        return false;
      } finally {
        setUpdatingStatusIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
      }
    },
    [leads],
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
