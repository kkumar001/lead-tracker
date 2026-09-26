import { useState } from "react";

import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import { useLeads } from "./hooks/useLeads";
import type { LeadStatus, NewLeadInput } from "./types/lead";

const App = () => {
  const { leads, pagination, search, page, loading, error, isCreating, updatingStatusIds, setSearch, setPage, addLead, changeStatus } = useLeads();
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddLead = async (input: NewLeadInput): Promise<boolean> => {
    const didCreate = await addLead(input);
    if (didCreate) {
      setFormError(null);
      return true;
    }

    const message = "Could not create lead. Please try again.";
    setFormError(message);
    return false;
  };

  const handleStatusChange = async (id: number, nextStatus: LeadStatus): Promise<boolean> => {
    const didUpdate = await changeStatus(id, nextStatus);
    return didUpdate;
  };

  const currentPage = pagination.page || page;
  const totalPages = pagination.totalPages || 1;

  return (
    <main className="app-shell">
      <header className="page-header mb-8">
        <div className="page-mark" aria-hidden="true">
          <svg viewBox="0 0 64 24" className="page-mark__svg" role="img">
            <path d="M6 13.5c3.5-7.5 10.8-10.5 18.6-10.5 8.2 0 14.8 4.2 19.4 11.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M23.5 7.5c3.5 4.2 4.8 10 2.9 15.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M37.8 5.8c4.2 1.6 7.4 5.3 8.3 9.9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <span className="page-rule" />
        </div>
        <div>
          <h1 className="page-title">Lead Tracker</h1>
          <p className="page-subtitle">Track and qualify incoming leads from your pipeline.</p>
        </div>
      </header>

      <section className="panel form-panel mb-6">
        <LeadForm onSubmit={handleAddLead} submitError={formError} isSubmitting={isCreating} />
      </section>

      <section className="mb-4">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </section>

      <section className="table-shell">
        {loading && leads.length === 0 ? (
          <div className="empty-state">Loading leads...</div>
        ) : error && leads.length === 0 ? (
          <div className="empty-state">{error}</div>
        ) : (
          <LeadTable leads={leads} onStatusChange={handleStatusChange} updatingLeadId={updatingStatusIds[0] ?? null} />
        )}
      </section>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
};

export default App;