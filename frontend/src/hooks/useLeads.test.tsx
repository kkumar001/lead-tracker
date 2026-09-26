import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLeads } from './useLeads';
import * as leadsApi from '../api/leads';

vi.mock('../api/leads', () => ({
  fetchLeads: vi.fn(),
  createLead: vi.fn(),
  updateLeadStatus: vi.fn(),
}));

describe('useLeads search debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('waits for a 300ms pause before hitting the API and uses the newest search value', async () => {
    const fetchLeadsMock = vi.mocked(leadsApi.fetchLeads);

    fetchLeadsMock.mockResolvedValue({
      status: 'success',
      message: 'OK',
      data: [],
      pagination: { page: 1, size: 10, totalPages: 1 },
    });

    const { result } = renderHook(() => useLeads());
    fetchLeadsMock.mockClear();

    act(() => {
      result.current.setSearch('a');
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(fetchLeadsMock).not.toHaveBeenCalled();

    act(() => {
      result.current.setSearch('ab');
    });

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(fetchLeadsMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(fetchLeadsMock).toHaveBeenCalledTimes(1);
    expect(fetchLeadsMock).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: 'ab',
    });
  });

  it('returns the backend duplicate-email message on create failure', async () => {
    const createLeadMock = vi.mocked(leadsApi.createLead);
    createLeadMock.mockRejectedValue({
      response: {
        data: {
          message: 'Lead with this email already exists',
        },
      },
    });

    const { result } = renderHook(() => useLeads());

    const response = await result.current.addLead({
      name: 'Jane',
      email: 'jane@example.com',
      phone: '999',
    });

    expect(response).toEqual({
      success: false,
      message: 'Lead with this email already exists',
    });
  });
});
