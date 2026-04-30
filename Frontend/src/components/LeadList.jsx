import { updateStatus, deleteLead } from "../services/api";

function LeadList({ leads, refresh }) {

  const handleUpdate = async (id, status) => {
    await updateStatus({ id, status });
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteLead(id);
    refresh();
  };

  return (
    <div>
      <h2>Lead List</h2>

      {leads.map((lead) => (
        <div key={lead.id} className="lead-card">
          <p><b>Name:</b> {lead.name}</p>
          <p><b>Phone:</b> {lead.phone}</p>
          <p><b>Source:</b> {lead.source}</p>

          <select
            value={lead.status}
            onChange={(e) => handleUpdate(lead.id, e.target.value)}
          >
            <option>Interested</option>
            <option>Not Interested</option>
            <option>Converted</option>
          </select>

          <button className="delete-btn" onClick={() => handleDelete(lead.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default LeadList;