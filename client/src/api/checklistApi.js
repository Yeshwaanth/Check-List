const apiBaseUrl = process.env.REACT_APP_API_URL || "";
async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}
export const checklistApi = {
  list: () => request("/api/checklists"),
  create: (name) =>
    request("/api/checklists", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  update: (id, name) =>
    request(`/api/checklists/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  remove: (id) => request(`/api/checklists/${id}`, { method: "DELETE" }),
  addItem: (id, title, startDate, endDate) =>
    request(`/api/checklists/${id}/items`, {
      method: "POST",
      body: JSON.stringify({ title, startDate, endDate }),
    }),
  updateItem: (id, itemId, changes) =>
    request(`/api/checklists/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  removeItem: (id, itemId) =>
    request(`/api/checklists/${id}/items/${itemId}`, { method: "DELETE" }),
};
