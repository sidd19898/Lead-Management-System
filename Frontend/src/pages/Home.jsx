import { useState, useEffect } from "react";
import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";
import { getLeads } from "../services/api";

function Home() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    const data = await getLeads();
    setLeads(data);
   
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  //  FILTER
const filteredLeads = Array.isArray(leads)
  ? leads.filter(
      (lead) =>
        lead?.name &&
        lead.name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  return (
    <div className="container">
      <h1>Lead Manager</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <LeadForm onAdd={fetchLeads} />

      {/*  ONLY ONE LeadList */}
      <LeadList leads={filteredLeads} refresh={fetchLeads} />
    </div>
  );
}

export default Home;