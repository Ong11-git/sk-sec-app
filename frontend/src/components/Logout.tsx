import { FiLogOut } from "react-icons/fi";

interface LogoutProps {
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <div className="fixed bottom-4 left-4 lg:left-72"> 
      {/* lg:left-72 aligns it with the sidebar width on desktop */}
      <button
        onClick={onLogout}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
      >
        <FiLogOut className="mr-2 h-5 w-5" />
        Logout
      </button>
    </div>
  );
};

export default Logout;
