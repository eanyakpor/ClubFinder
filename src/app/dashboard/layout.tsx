import React from "react";
import DashboardHero from "./components/Hero/DashboardHero";
import ProtectedRoute from "../components/ProtectedRoute";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <ProtectedRoute>
      <div>
        <DashboardHero />
        {children}
      </div>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
