import { useMemo, useState } from "react";

import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import { mockLeads } from "./mocks/leads";
import type { Lead, LeadStatus, NewLeadInput } from "./types/lead";

const App = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchText, setSearchText] = useState<string>("");

  const filteredLeads = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return leads;
    }

    return leads.filter((lead) => {
      const matchesName = lead.name.toLowerCase().includes(normalizedSearch);
      const matchesEmail = lead.email.toLowerCase().includes(normalizedSearch);
      return matchesName || matchesEmail;
    });
  }, [leads, searchText]);

  const handleAddLead = (input: NewLeadInput) => {
    const nextLead: Lead = {
      id: Date.now(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: "New",
      created_at: new Date().toISOString(),
    };

    setLeads((currentLeads) => [nextLead, ...currentLeads]);
  };

  const handleStatusChange = (id: number, nextStatus: LeadStatus) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status: nextStatus,
            }
          : lead,
      ),
    );
  };

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
        <LeadForm onSubmit={handleAddLead} />
      </section>

      <section className="mb-4">
        <div className="table-toolbar">
          <SearchBar value={searchText} onChange={setSearchText} />
        </div>
      </section>

      <section className="table-shell">
        <LeadTable leads={filteredLeads} onStatusChange={handleStatusChange} />
      </section>

      <Pagination page={1} totalPages={1} onPageChange={() => undefined} />
    </main>
  );
};

export default App;