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
  updatingLeadId?: number | null;
}

const formatDateTime = (value: string): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ").replace("Z", "");
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date).replace(",", "");
};

const LeadTable = ({ leads, onStatusChange, updatingLeadId = null }: LeadTableProps) => {
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
                <StatusBadge
                  status={lead.status}
                  isUpdating={updatingLeadId === lead.id}
                  onChange={(nextStatus) => onStatusChange(lead.id, nextStatus)}
                />
              </td>
              <td>{formatDateTime(lead.createdAt ?? lead.created_at ?? "")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
