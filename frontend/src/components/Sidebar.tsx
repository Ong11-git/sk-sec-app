import {
  FiBarChart2,
  FiMap,
  FiFlag,
  FiLayers,
  FiUsers,
  FiFilter,
  FiUserPlus,
  FiX,
  FiHome,
} from "react-icons/fi";
import type { SidebarProps } from "../types";
import Logout from "./Logout";
import Footer from "./Footer";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}) => {
  const iconColors: Record<string, string> = {
    dashboard: "text-blue-500",
    district: "text-green-600",
    constituency: "text-purple-600",
    territorialConstituency: "text-orange-500",
    voters: "text-teal-600",
    votersFilters: "text-pink-500",
    addVoters: "text-red-500",
    gpu: "text-yellow-500",
    ward: "text-yellow-500",
  };

  // Add handleLogout function
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-indigo-200">
          <div>
            <h2 className="text-base font-bold text-indigo-900">
              State Election Commission, Sikkim
            </h2>
            <p className="text-xs text-indigo-700/70 flex items-center gap-1">
              <span className="px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-700 rounded-full">
                Admin Dashboard
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-square"
            aria-label="Close menu"
          >
            <FiX className="h-4 w-4 text-indigo-700" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-4 border-b border-indigo-200">
          <h2 className="text-lg font-bold text-indigo-900">
            State Election Commission
          </h2>
          <p className="text-xs text-indigo-700/70 flex items-center gap-1 mt-1">
            <span className="px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-700 rounded-full">
              Admin Dashboard
            </span>
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-6 space-y-1 text-sm">
          {[
            { key: "dashboard", label: "Dashboard", icon: FiBarChart2 },
            { key: "district", label: "District", icon: FiMap },
            { key: "constituency", label: "Constituency", icon: FiFlag },
            {
              key: "territorialConstituency",
              label: "Territorial Constituency",
              icon: FiLayers,
            },
            { key: "gpu", label: "GPU", icon: FiHome },
            { key: "ward", label: "Ward", icon: FiHome },
            { key: "voters", label: "Voters List", icon: FiUsers },
            { key: "votersFilters", label: "Voters Filters", icon: FiFilter },
            { key: "addVoters", label: "Add Voters", icon: FiUserPlus },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                onTabChange(key);
                onClose();
              }}
              className={`w-full flex items-center px-4 py-2 text-left transition-colors rounded-r-lg text-sm ${
                activeTab === key
                  ? "bg-indigo-200 text-indigo-900 font-semibold"
                  : "text-indigo-800/80 hover:bg-indigo-100"
              }`}
            >
              <Icon className={`${iconColors[key]} h-4 w-4 mr-2`} />
              {label}
            </button>
          ))}
        </nav>
        <Footer onLogout={handleLogout} />
        {/* <Logout onLogout={handleLogout} /> */}
      </div>
    </>
  );
};

export default Sidebar;
