import NewDashboard from "./NewDashboard";

interface DashboardProps {
  sidebarCollapsed?: boolean;
  isTransitioning?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed = false }) => {
  return <NewDashboard sidebarCollapsed={sidebarCollapsed} />;
};

export default Dashboard;
