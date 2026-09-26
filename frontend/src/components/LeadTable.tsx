import StatusBadge from "./StatusBadge";

import type { Lead, LeadStatus } from "../types/lead";

const statusAccentMap: Record<LeadStatus, string> = {
  New: "var(--color-steel)",
  Contacted: "var(--color-brass)",
  Qualified: "var(--color-forest)",
  Lost: "var(--color-brick)",
};

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: number, status: LeadStatus) => void;
}

const LeadTable = ({ leads, onStatusChange }: LeadTableProps) => {
  if (leads.length === 0) {
    return <div className="empty-state">No leads found. Try adjusting your search.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              style={{
                ["--row-accent" as string]: statusAccentMap[lead.status],
              }}
            >
              <td className="lead-name">{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>
                <StatusBadge status={lead.status} onChange={(nextStatus) => onStatusChange(lead.id, nextStatus)} />
              </td>
              <td>{new Date(lead.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
