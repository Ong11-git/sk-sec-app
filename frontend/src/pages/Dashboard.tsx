// ============================================
// FILE: Dashboard.tsx
// ============================================

import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  TrendingUp,
  MapPin,
  Shield,
  Target,
  Globe,
  Users2,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

interface DashboardProps {
  sidebarCollapsed?: boolean;
  isTransitioning?: boolean;
}

interface AgeGroupData {
  ageGroup: string;
  count: number;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed = false }) => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalDistricts: 0,
    totalConstituencies: 0,
    avgAge: 0,
  });

  const [charts, setCharts] = useState({
    districtData: [] as { district: string; voters: number; color: string }[],
    ageGroupData: [] as AgeGroupData[],
    genderData: [] as any[],
    constituencyData: [] as any[],
    communityData: [] as any[],
  });

  const [isMobile, setIsMobile] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchAllData = async () => {
    try {
      setIsRefreshing(true);
      const token = sessionStorage.getItem("token");

      const [
        votersRes,
        districtsRes,
        constituenciesRes,
        ageRes,
        genderRes,
        districtChartRes,
        ageChartRes,
        constituencyChartRes,
        communityRes,
      ] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/voters/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/districts/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/constituencies/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/voters/average-age`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/gender-distribution`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/district-wise-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/voters/age-group`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/constituency-voters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/voters/last-names`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [
        votersData,
        districtsData,
        constituenciesData,
        ageData,
        genderData,
        districtChartData,
        ageChartData,
        constituencyChartData,
        communityData,
      ] = await Promise.all([
        votersRes.json(),
        districtsRes.json(),
        constituenciesRes.json(),
        ageRes.json(),
        genderRes.json(),
        districtChartRes.json(),
        ageChartRes.json(),
        constituencyChartRes.json(),
        communityRes.json(),
      ]);

      const districtColors = [
        "#3B82F6",
        "#10B981",
        "#8B5CF6",
        "#F59E0B",
        "#EF4444",
        "#06B6D4",
        "#84CC16",
        "#F97316",
        "#8B5CF6",
        "#EC4899",
      ];

      setStats({
        totalVoters: votersData.totalVoters || 0,
        totalDistricts: districtsData.count || 0,
        totalConstituencies: constituenciesData.count || 0,
        avgAge: Math.round(ageData.averageAge || 0),
      });

      setCharts({
        districtData: (districtChartData || []).map(
          (item: any, index: number) => ({
            ...item,
            color: districtColors[index % districtColors.length],
          })
        ),
        ageGroupData: (ageChartData || []).map((item: any) => ({
          ageGroup: item.ageGroup,
          count: item.voters,
        })),
        genderData: (genderData || []).map((item: any) => ({
          name: item.gender,
          value: item.count,
          color:
            item.gender === "Male"
              ? "#3B82F6"
              : item.gender === "Female"
              ? "#EC4899"
              : "#8B5CF6",
        })),
        constituencyData: (constituencyChartData || []).map((item: any) => ({
          name: item.constituency,
          value: item.voters,
        })),
        communityData: (communityData || []).map((item: any) => ({
          name: item.lastName,
          value: item.count,
        })),
      });

      setLastUpdated(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            Voters:{" "}
            <span className="font-bold text-[#061E47]">
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-6 transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#061E47] to-[#0A2B6B] rounded-lg shadow-lg transition-transform duration-200 hover:rotate-6 hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#061E47] to-[#1E40AF] bg-clip-text text-transparent">
              Election Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-11">
            Real-time voter statistics and demographic insights for Sikkim State
            Election Commission
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 ml-11 md:ml-0">
          <button
            onClick={fetchAllData}
            disabled={isRefreshing}
            className="btn btn-sm md:btn-md btn-outline border-gray-300 hover:border-[#061E47] hover:bg-[#061E47] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          {/* <button className="btn btn-sm md:btn-md bg-[#061E47] hover:bg-[#0A2B6B] text-white border-0 transition-all duration-200 hover:scale-105 active:scale-95">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button> */}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                }`}
              />
              <span className="text-sm font-medium">
                {loading ? "Loading data..." : "All systems operational"}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated || "--:--:--"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge badge-lg badge-outline border-[#061E47] text-[#061E47]">
              {isMobile ? "📱 Mobile" : "🖥️ Desktop"}
            </div>
            <div className="text-xs text-gray-500">Data Source: SEC API</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - NO FRAMER MOTION */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 transition-all duration-300 ${
          sidebarCollapsed ? "xl:grid-cols-4" : ""
        }`}
      >
        {[
          {
            icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Total Voters",
            value: loading ? "..." : stats.totalVoters.toLocaleString(),
            color: "from-blue-500 to-blue-600",
            border: "border-l-blue-500",
            trend: "+5.2%",
          },
          {
            icon: <MapPin className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Districts",
            value: loading ? "..." : stats.totalDistricts,
            color: "from-green-500 to-emerald-600",
            border: "border-l-green-500",
            trend: null,
          },
          {
            icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Constituencies",
            value: loading ? "..." : stats.totalConstituencies,
            color: "from-purple-500 to-purple-600",
            border: "border-l-purple-500",
            trend: "+2",
          },
          {
            icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Average Age",
            value: loading ? "..." : `${stats.avgAge} yrs`,
            color: "from-orange-500 to-amber-600",
            border: "border-l-orange-500",
            trend: "-1.2yrs",
          },
        ].map((stat, index) => (
          <div
            key={stat.title}
            className="relative transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
          >
            <div
              className={`bg-white rounded-xl shadow-md border-l-4 ${stat.border} p-4 h-full transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} transition-transform duration-200 hover:rotate-12 hover:scale-110`}
                >
                  {stat.icon}
                </div>
                {stat.trend && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
                    {stat.trend}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid - NO FRAMER MOTION */}
      <div className="space-y-4 md:space-y-6 transition-all duration-300">
        {/* First Row */}
        <div
          className={`grid gap-4 md:gap-6 transition-all duration-300 ${
            sidebarCollapsed
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {/* District Chart */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Voters by District
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={charts.districtData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="district"
                  fontSize={isMobile ? 10 : 12}
                  angle={isMobile ? -45 : sidebarCollapsed ? -45 : -30}
                  textAnchor="end"
                  height={isMobile ? 50 : 70}
                  stroke="#6B7280"
                />
                <YAxis fontSize={isMobile ? 10 : 12} stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="voters"
                  radius={[6, 6, 0, 0]}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {charts.districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Gender Distribution
            </h3>
            <div
              className={`flex ${
                sidebarCollapsed ? "flex-col" : "flex-col lg:flex-row"
              } h-full`}
            >
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                  <PieChart>
                    <Pie
                      data={charts.genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 70 : 90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {charts.genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div
                className={`${
                  sidebarCollapsed
                    ? "w-full mt-4"
                    : "lg:w-1/3 mt-4 lg:mt-0 lg:pl-4"
                }`}
              >
                <div className="space-y-3">
                  {charts.genderData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div
          className={`grid gap-4 md:gap-6 transition-all duration-300 ${
            sidebarCollapsed
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {/* Age Group Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Age Group Distribution
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <AreaChart data={charts.ageGroupData}>
                <defs>
                  <linearGradient id="ageColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="ageGroup"
                  fontSize={isMobile ? 10 : 12}
                  stroke="#6B7280"
                />
                <YAxis fontSize={isMobile ? 10 : 12} stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#ageColor)"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Community Distribution */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Community Distribution
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={charts.communityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  fontSize={isMobile ? 9 : 10}
                  angle={isMobile ? -45 : sidebarCollapsed ? -45 : -30}
                  textAnchor="end"
                  height={isMobile ? 50 : 70}
                  stroke="#6B7280"
                />
                <YAxis fontSize={isMobile ? 10 : 12} stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Width Constituency Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transition-all duration-200 hover:shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Voters by Constituency
            </h3>
            <div className="text-sm text-gray-500">
              Showing top {Math.min(10, charts.constituencyData.length)}{" "}
              constituencies
            </div>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 350}>
            <BarChart
              data={charts.constituencyData.slice(0, 10)}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                opacity={0.5}
              />
              <XAxis
                type="number"
                fontSize={isMobile ? 10 : 12}
                stroke="#6B7280"
              />
              <YAxis
                type="category"
                dataKey="name"
                fontSize={isMobile ? 10 : 12}
                stroke="#6B7280"
                width={sidebarCollapsed ? 120 : 150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="#F59E0B"
                radius={[0, 6, 6, 0]}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards at Bottom */}
      <div
        className={`grid gap-4 mt-6 md:mt-8 transition-all duration-300 ${
          sidebarCollapsed
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Highest Voter District
            </h3>
          </div>
          {charts.districtData.length > 0 ? (
            <>
              <p className="text-2xl font-bold text-blue-900">
                {charts.districtData[0]?.district || "N/A"}
              </p>
              <p className="text-sm text-blue-700">
                {charts.districtData[0]?.voters?.toLocaleString() || 0} voters
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <Users2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Largest Age Group</h3>
          </div>
          {charts.ageGroupData.length > 0 ? (
            <>
              <p className="text-2xl font-bold text-green-900">
                {charts.ageGroupData[0]?.ageGroup || "N/A"}
              </p>
              <p className="text-sm text-green-700">
                {charts.ageGroupData[0]?.count?.toLocaleString() || 0} voters
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">
              Dominant Community
            </h3>
          </div>
          {charts.communityData.length > 0 ? (
            <>
              <p className="text-2xl font-bold text-purple-900">
                {charts.communityData[0]?.name || "N/A"}
              </p>
              <p className="text-sm text-purple-700">
                {charts.communityData[0]?.value?.toLocaleString() || 0} voters
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 md:mt-8 pt-4 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Data refreshed automatically. For official use only. © 2024 State
          Election Commission, Sikkim
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
