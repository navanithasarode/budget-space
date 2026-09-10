import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { mockBudgets } from "../data/mockData";

const AppContext = createContext(null);

function normalizeBackendBudget(b) {
  return {
    ...b,
    id: b._id,
    budgetAmount: (b.budgetMinor || 0) / 100,
    expenses: [],
    healthcare: b.healthcare ? {
      patientName: b.healthcare.patientName,
      hospital: b.healthcare.hospital,
      doctor: b.healthcare.doctor,
      insuranceProvider: b.healthcare.insuranceProvider,
      insuranceCoverage: (b.healthcare.insuranceCoverageMinor || 0) / 100,
      claimAmount: (b.healthcare.claimAmountMinor || 0) / 100,
      approvedAmount: (b.healthcare.approvedAmountMinor || 0) / 100,
      pendingAmount: (b.healthcare.pendingAmountMinor || 0) / 100,
      outOfPocket: (b.healthcare.outOfPocketMinor || 0) / 100,
      claimStatus: b.healthcare.claimStatus
    } : null
  };
}

export function AppProvider({ children }) {
  const hasApi = Boolean(import.meta.env.VITE_API_URL);
  const [mode, setMode] = useState(hasApi ? "backend" : "demo");
  const [budgets, setBudgets] = useState(hasApi ? [] : mockBudgets);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasApi && localStorage.getItem("budget_token")) {
      api.me().then(x => setUser(x.user)).catch(() => localStorage.removeItem("budget_token"));
    }
  }, [hasApi]);

  const refresh = async () => {
    if (mode !== "backend") return;
    setLoading(true);
    try {
      const list = await api.budgets();
      const full = await Promise.all(list.map(async b => {
        const x = await api.budget(b._id);
        return { ...normalizeBackendBudget(b), expenses: x.expenses.map(e => ({
          ...e, id: e._id, amount: (e.amountMinor || 0) / 100
        })), budgetAmount: (b.budgetMinor || 0) / 100 };
      }));
      setBudgets(full);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, register = false) => {
    if (!hasApi) {
      setMode("demo");
      setUser({ name: credentials.name || "Demo User", email: credentials.email });
      return;
    }
    const result = register ? await api.register(credentials) : await api.login(credentials);
    localStorage.setItem("budget_token", result.token);
    setUser(result.user);
    setMode("backend");
    await refresh();
  };

  const logout = () => {
    localStorage.removeItem("budget_token");
    setUser(null);
    setMode("demo");
    setBudgets(mockBudgets);
  };

  const addExpense = async (budgetId, expense) => {
    if (mode === "backend") {
      await api.createExpense(budgetId, expense);
      await refresh();
      return;
    }
    setBudgets(prev => prev.map(b => b.id === budgetId
      ? { ...b, expenses: [{ ...expense, id: crypto.randomUUID() }, ...b.expenses] }
      : b
    ));
  };

  const deleteExpense = async (budgetId, expenseId) => {
    if (mode === "backend") {
      await api.deleteExpense(expenseId);
      await refresh();
      return;
    }
    setBudgets(prev => prev.map(b => b.id === budgetId
      ? { ...b, expenses: b.expenses.filter(e => e.id !== expenseId) }
      : b
    ));
  };

  const addBudget = async (budget) => {
  if (mode === "backend") {
    await api.createBudget(budget);
    await refresh();
    return;
  }

    setBudgets(prev => [
      {
        ...budget,
        id: crypto.randomUUID(),
        expenses: []
      },
      ...prev.filter(b => !mockBudgets.some(mock => mock.id === b.id))
   ]);
  };

  const deleteBudget = async id => {
    if (mode === "backend") {
      await api.deleteBudget(id);
      await refresh();
      return;
    }
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const value = useMemo(() => ({ budgets, user, loading, mode, login, logout, refresh, addExpense, deleteExpense, addBudget, deleteBudget, hasApi }), [budgets, user, loading, mode, hasApi]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
