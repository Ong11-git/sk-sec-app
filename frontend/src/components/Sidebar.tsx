import { useState, useEffect } from "react";
import {
  BarChart3,
  Map,
  Flag,
  Layers,
  Filter,
  UserPlus,
  X,
  Home,
  ChevronLeft,
  LogOut,
  User,
  Shield,
  Building2,
} from "lucide-react";

type TabKey =
  | "dashboard"
  | "voters"
  | "addVoters"
  | "votersFilters"
  | "constituency"
  | "territorialConstituency"
  | "district"
  | "gpu"
  | "ward"
  | "municipality"
  | "municipalWard";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onSidebarToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  sidebarCollapsed,
  setSidebarCollapsed,
  onSidebarToggle,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [setSidebarCollapsed]);

  const navItems = [
    { key: "dashboard" as TabKey, label: "Dashboard", icon: BarChart3 },
    { key: "district" as TabKey, label: "District", icon: Map },
    { key: "constituency" as TabKey, label: "Constituency", icon: Flag },
    {
      key: "territorialConstituency" as TabKey,
      label: "Territorial Constituency",
      icon: Layers,
    },
    { key: "gpu" as TabKey, label: "GPU", icon: Home },
    { key: "ward" as TabKey, label: "Ward", icon: Home },
    { key: "municipality" as TabKey, label: "Municipality", icon: Building2 },
    {
      key: "municipalWard" as TabKey,
      label: "Municipal Ward",
      icon: Building2,
    },
    // { key: "voters" as TabKey, label: "Voters List", icon: Users },
    { key: "votersFilters" as TabKey, label: "Voters Filters", icon: Filter },
    { key: "addVoters" as TabKey, label: "Add Voters", icon: UserPlus },
  ];

  const iconColors: Record<TabKey, string> = {
    dashboard: "text-blue-500",
    district: "text-green-500",
    constituency: "text-purple-500",
    territorialConstituency: "text-amber-500",
    municipality: "text-cyan-500",
    municipalWard: "text-teal-500",
    voters: "text-teal-500",
    votersFilters: "text-pink-500",
    addVoters: "text-red-500",
    gpu: "text-yellow-500",
    ward: "text-indigo-500",
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleToggle = () => {
    if (!isMobile) {
      onSidebarToggle();
    }
  };

  const renderSidebarContent = () => (
    <div
      className="h-full flex flex-col bg-white border-r border-gray-200 shadow-xl"
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#061E47] to-[#0A2E6E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center flex-1 overflow-hidden">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-transform duration-200 hover:scale-105">
              <Shield className="w-5 h-5 text-[#061E47]" />
            </div>

            <div
              className={`ml-3 min-w-0 transition-all duration-300 ease-in-out ${
                sidebarCollapsed && !isMobile
                  ? "opacity-0 translate-x-[-10px] w-0"
                  : "opacity-100 translate-x-0 w-auto"
              }`}
              style={{
                transitionProperty: "opacity, transform, width",
              }}
            >
              <h2 className="text-base font-bold text-white leading-tight truncate whitespace-nowrap">
                Election Commission
              </h2>
              <p className="text-xs text-blue-100 mt-0.5 truncate whitespace-nowrap">
                Govt. of Sikkim
              </p>
            </div>
          </div>

          {!isMobile && (
            <button
              onClick={handleToggle}
              className="ml-2 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <div
                className="transition-transform duration-300 ease-in-out"
                style={{
                  transform: sidebarCollapsed
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </div>
            </button>
          )}

          {isMobile && (
            <button
              onClick={onClose}
              className="ml-2 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            sidebarCollapsed && !isMobile
              ? "mt-0 opacity-0 max-h-0"
              : "mt-4 opacity-100 max-h-24"
          }`}
        >
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition-all duration-200 hover:scale-[1.02] hover:bg-white/15">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-transform duration-300 hover:rotate-[360deg]">
                <User className="w-4 h-4 text-[#061E47]" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Administrator
                </p>
                <p className="text-xs text-blue-200 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="flex-1 min-h-0"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          <nav className="p-3 space-y-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => {
                  onTabChange(key);
                  if (isMobile) onClose();
                }}
                className={`w-full flex items-center rounded-lg p-3 transition-all duration-200 group relative ${
                  activeTab === key
                    ? "bg-gradient-to-r from-[#061E47] to-[#0A2E6E] text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#061E47]"
                } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    className={`${iconColors[key]} ${
                      activeTab === key ? "text-white" : ""
                    } w-5 h-5 transition-colors duration-200`}
                  />
                </div>

                <span
                  className={`ml-3 text-sm font-medium truncate flex-1 text-left transition-all duration-300 ease-in-out ${
                    sidebarCollapsed && !isMobile
                      ? "opacity-0 translate-x-[-10px] w-0 ml-0"
                      : "opacity-100 translate-x-0 w-auto ml-3"
                  }`}
                  style={{
                    transitionProperty: "opacity, transform, width, margin",
                  }}
                >
                  {label}
                </span>

                {activeTab === key && !sidebarCollapsed && !isMobile && (
                  <div className="absolute right-3 w-1.5 h-6 bg-white rounded-full transition-all duration-200" />
                )}

                {sidebarCollapsed && !isMobile && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-lg p-3 text-red-600 hover:bg-red-50 transition-all duration-200 ${
            sidebarCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={`ml-3 text-sm font-medium transition-all duration-300 ease-in-out ${
              sidebarCollapsed && !isMobile
                ? "opacity-0 translate-x-[-10px] w-0 ml-0"
                : "opacity-100 translate-x-0 w-auto ml-3"
            }`}
            style={{
              transitionProperty: "opacity, transform, width, margin",
            }}
          >
            Logout
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            sidebarCollapsed && !isMobile
              ? "mt-0 opacity-0 max-h-0"
              : "mt-4 pt-4 opacity-100 max-h-24"
          }`}
        >
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span>System Active</span>
              </div>
              <span className="font-semibold text-[#061E47]">v2.4.1</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              © 2026 SEC Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
          }}
        />

        <aside
          className="fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out print:hidden"
          style={{
            height: "100vh",
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            boxShadow: "2px 0 30px rgba(0, 0, 0, 0.15)",
          }}
        >
          {renderSidebarContent()}
        </aside>
      </>
    );
  }

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out print:hidden"
      style={{
        height: "100vh",
        width: sidebarCollapsed ? "80px" : "260px",
        boxShadow: "2px 0 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;
