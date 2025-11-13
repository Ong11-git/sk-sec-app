import { Menu } from "lucide-react";

const MobileHeader: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => (
  <div className="lg:hidden bg-gray-50 shadow-sm border-b border-base-200">
    <div className="flex items-center justify-between p-4">
      <div>
        <h2 className="text-lg font-bold text-base-content">
          State Election Commission
        </h2>
        <p className="text-xs text-base-content/60">Admin Dashboard</p>
      </div>
      <button
        onClick={onMenuClick}
        className="btn btn-ghost btn-square"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  </div>
);

export default MobileHeader;
