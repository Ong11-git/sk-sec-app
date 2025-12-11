import { useState } from "react";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import VotersList from "./pages/VotersList";
import "./App.css";
import AddVoters from "./pages/AddVoters";
import VoterFilters from "./pages/VoterFIlters";
import AddConstituency from "./pages/AddConstituency";
import AddTC from "./pages/AddTC";
import AddDistrict from "./pages/AddDistrict";
import AddGpu from "./pages/AddGpu";
import AddWard from "./pages/AddWard";
import Footer from "./components/Footer"; // Import Footer

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "voters"
    | "addVoters"
    | "votersFilters"
    | "constituency"
    | "territorialConstituency"
    | "district"
    | "gpu"
    | "ward"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (): void => {
    // Clear any authentication tokens or user data
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("token");
    // Optionally, redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setSidebarOpen((v) => !v)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-auto bg-gray-50">
        {activeTab === "dashboard" ? (
          <Dashboard />
        ) : activeTab === "district" ? (
          <AddDistrict />
        ) : activeTab === "constituency" ? (
          <AddConstituency />
        ) : activeTab === "territorialConstituency" ? (
          <AddTC />
        ) : activeTab === "gpu" ? (
          <AddGpu />
        ) : activeTab === "ward" ? (
          <AddWard />
        ) : activeTab === "voters" ? (
          <VotersList />
        ) : activeTab === "votersFilters" ? (
          <VoterFilters />
        ) : (
          <AddVoters />
        )}
      </div>

      <Footer onLogout={handleLogout} />
    </div>
  );
};

export default App;
