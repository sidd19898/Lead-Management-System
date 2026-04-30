import { useState } from "react";
import { addLead } from "../services/api.js";

function LeadForm({onAdd}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addLead(form);
    alert("Lead added ");

    setForm({ name: "", phone: "", source: "Call" });

    onAdd(); //  refresh list

  } catch (err) {
    console.error(err);
    alert("Error adding lead ");
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Lead</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <select
        name="source"
        value={form.source}
        onChange={handleChange}
      >
        <option value="Call">Call</option>
        <option value="WhatsApp">WhatsApp</option>
        <option value="Field">Field</option>
      </select>

      <button type="submit">Add Lead</button>
    </form>
  );
}

export default LeadForm;