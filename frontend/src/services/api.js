const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("budget_token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  register: body => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: body => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  budgets: () => request("/budgets"),
  budget: id => request(`/budgets/${id}`),
  createBudget: body => request("/budgets", { method: "POST", body: JSON.stringify(body) }),
  deleteBudget: id => request(`/budgets/${id}`, { method: "DELETE" }),
  createExpense: (id, body) => request(`/budgets/${id}/expenses`, { method: "POST", body: JSON.stringify(body) }),
  deleteExpense: id => request(`/expenses/${id}`, { method: "DELETE" })
};
