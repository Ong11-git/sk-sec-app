// ============================================
// FILE: App.tsx (Updated with Municipality)
// ============================================

import { useState, useEffect } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import MobileHeader from "./components/MobileHeader";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import VotersList from "./pages/VotersList";
import "./App.css";
import AddVoters from "./pages/AddVoters";
import AddConstituency from "./pages/AddConstituency";
import AddTC from "./pages/AddTC";
import AddDistrict from "./pages/AddDistrict";
import AddGpu from "./pages/AddGpu";
import Municipality from "./pages/Municipality"; // Add this import
import MunicipalWard from "./pages/MunicipalWard";
import Ward from "./pages/Ward";
import SeatReservationPage from "./pages/SeatReservationPage";

// Main App Component
function AppContent() {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "voters"
    | "addVoters"
    | "constituency"
    | "territorialConstituency"
    | "district"
    | "gpu"
    | "ward"
    | "municipality"
    | "municipalWard"
    | "seatReservation"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdatingHash, setIsUpdatingHash] = useState(false);

  // Hash to tab mapping
  const hashToTab: Record<string, typeof activeTab> = {
    "#dashboard": "dashboard",
    "#voters": "voters",
    "#add-voters": "addVoters",
    "#constituency": "constituency",
    "#territorial-constituency": "territorialConstituency",
    "#district": "district",
    "#gpu": "gpu",
    "#ward": "ward",
    "#municipality": "municipality",
    "#municipal-ward": "municipalWard",
    "#seat-reservation": "seatReservation",
  };

  // Tab to hash mapping
  const tabToHash: Record<typeof activeTab, string> = {
    dashboard: "#dashboard",
    voters: "#voters",
    addVoters: "#add-voters",
    constituency: "#constituency",
    territorialConstituency: "#territorial-constituency",
    district: "#district",
    gpu: "#gpu",
    ward: "#ward",
    municipality: "#municipality",
    municipalWard: "#municipal-ward",
    seatReservation: "#seat-reservation",
  };

  // Initialize activeTab from URL hash on mount
  useEffect(() => {
    // Use setTimeout to ensure this runs after all other initialization
    const timeoutId = setTimeout(() => {
      const hash = window.location.hash;
      if (hash && hashToTab[hash]) {
        setActiveTab(hashToTab[hash]);
      } else if (!hash) {
        // If no hash, set default dashboard hash
        window.location.hash = "#dashboard";
      }
      setIsInitialized(true);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for hash changes (browser back/forward buttons)
  useEffect(() => {
    if (!isInitialized) return;

    const handleHashChange = () => {
      if (isUpdatingHash) return; // Ignore hash changes caused by our own updates

      const newHash = window.location.hash;
      const expectedTab = hashToTab[newHash];

      if (expectedTab && expectedTab !== activeTab) {
        setActiveTab(expectedTab);
      } else if (!expectedTab && newHash !== "#dashboard") {
        // Invalid hash, redirect to dashboard
        setIsUpdatingHash(true);
        window.location.hash = "#dashboard";
        setActiveTab("dashboard");
        setTimeout(() => setIsUpdatingHash(false), 10);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isInitialized, activeTab, isUpdatingHash]);

  // Update URL hash when activeTab changes
  useEffect(() => {
    if (!isInitialized || isUpdatingHash) return;

    const hash = tabToHash[activeTab];
    if (hash && window.location.hash !== hash) {
      setIsUpdatingHash(true);
      window.location.hash = hash;
      // Reset the flag after a short delay
      setTimeout(() => setIsUpdatingHash(false), 10);
    }
  }, [activeTab, isInitialized, isUpdatingHash]);

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
        return <Ward />;
      case "municipality": // Add municipality case
        return <Municipality />;
      case "municipalWard":
        return <MunicipalWard />;
      case "seatReservation":
        return <SeatReservationPage />;
      case "voters":
        return <VotersList />;
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
