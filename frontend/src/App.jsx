import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import BudgetDetails from "./pages/BudgetDetails";
import CreateBudget from "./pages/CreateBudget";

import AuthModal from "./components/AuthModal";
import OnboardingModal from "./components/OnboardingModal";

function AppRoutes() {
  const { user } = useApp();

  const [onboardingStep, setOnboardingStep] = useState(1);

  // Not logged in → show login/signup
  if (!user) {
    return <AuthModal />;
  }

  // Logged in → show onboarding
  if (onboardingStep <= 3) {
    return (
      <OnboardingModal
        step={onboardingStep}
        onComplete={() => {
          setOnboardingStep(onboardingStep + 1);
        }}
      />
    );
  }

  // Onboarding finished → show the actual app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/budgets/new" element={<CreateBudget />} />
        <Route path="/budgets/:id" element={<BudgetDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}