// ============================================
// FILE: App.tsx
// ============================================

import { useState, useEffect } from "react";
import { SidebarProvider } from "./context/SidebarContext";
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

// Main App Component
function AppContent() {
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.classList.add("sidebar-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  // Close sidebar on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        sidebarOpen &&
        window.innerWidth < 1024 &&
        !target.closest(".sidebar-content") &&
        !target.closest(".mobile-menu-button")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard sidebarCollapsed={sidebarCollapsed} />;
      case "district":
        return <AddDistrict />;
      case "constituency":
        return <AddConstituency />;
      case "territorialConstituency":
        return <AddTC />;
      case "gpu":
        return <AddGpu />;
      case "ward":
        return <AddWard />;
      case "voters":
        return <VotersList />;
      case "votersFilters":
        return <VoterFilters />;
      case "addVoters":
        return <AddVoters />;
      default:
        return <Dashboard sidebarCollapsed={sidebarCollapsed} />;
    }
  };

  return (
    <SidebarProvider isSidebarOpen={sidebarOpen} isMobile={isMobile}>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Mobile Header - Only shown on mobile */}
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Main Content - Adjusts based on sidebar state - NO OPACITY CHANGE */}
        <main
          className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          } ${
            sidebarOpen && window.innerWidth < 1024
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <div className="p-4 md:p-6">{renderContent()}</div>
        </main>

        {/* NO TRANSITION OVERLAY - This was causing the blink! */}
      </div>
    </SidebarProvider>
  );
}

// Main App Component
const App: React.FC = () => {
  return <AppContent />;
};

export default App;
