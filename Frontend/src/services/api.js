export const addLead = async (data) => {
  const res = await fetch("http://localhost:3000/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
};

export const getLeads = async () => {
  const res = await fetch("http://localhost:3000/leads");
  return res.json();
};

export const updateStatus = async (data) => {
  const res = await fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteLead = async (id) => {
  const res = await fetch(`http://localhost:3000/delete/${id}`, {
    method: "DELETE",
  });
  return res.json();
};