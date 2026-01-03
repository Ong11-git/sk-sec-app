import { useEffect, useState, useCallback } from "react";
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
  Calendar,
  Filter,
  X,
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

interface FilterOptions {
  districts: { id: number; name: string }[];
  constituencies: { id: number; name: string; constituencyNo: number }[];
  municipalities: { id: number; name: string; municipalityNo: number }[];
  tcs: { id: number; tc_name: string; tc_no: number }[];
  gpus: { id: number; gpu_name: string; gpu_no: number }[];
  wards: { id: number; ward_name: string; ward_no: number }[];
  municipalWards: { id: number; name: string; ward_no: number }[];
}

interface AnalyticsData {
  scope: {
    level: string;
    id?: number;
    name?: string;
  };
  totals: {
    voters: number;
    districts: number;
    constituencies: number;
  };
  averageAge: number;
  districtWiseVoters: { district: string; voters: number }[];
  constituencyWiseVoters: {
    constituencyId: number;
    constituency: string;
    voters: number;
  }[];
  ageGroupDistribution: { ageGroup: string; voters: number }[];
  genderDistribution: { gender: string; count: number }[];
  voterLastNames: { lastName: string; count: number }[];
}

interface Filters {
  districtId: string;
  constituencyId: string;
  municipalityId: string;
  tcId: string;
  gpuId: string;
  wardId: string;
  municipalWardId: string;
}

const NewDashboard: React.FC<DashboardProps> = ({
  sidebarCollapsed = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    districts: [],
    constituencies: [],
    municipalities: [],
    tcs: [],
    gpus: [],
    wards: [],
    municipalWards: [],
  });

  const [filters, setFilters] = useState<Filters>({
    districtId: "",
    constituencyId: "",
    municipalityId: "",
    tcId: "",
    gpuId: "",
    wardId: "",
    municipalWardId: "",
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

  const fetchFilterOptions = useCallback(
    async (currentFilters: Partial<Filters> = {}) => {
      try {
        const token = sessionStorage.getItem("token");
        const queryParams = new URLSearchParams();

        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/analytics/filters?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (data.success) {
          setFilterOptions((prev) => ({
            ...prev,
            ...data.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    },
    []
  );

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const token = sessionStorage.getItem("token");
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/analytics/dashboard?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
        setLastUpdated(
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
    fetchAnalytics();
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback(
    async (filterKey: keyof Filters, value: string) => {
      const newFilters = { ...filters };

      // Clear dependent filters when parent changes
      if (filterKey === "districtId") {
        newFilters.constituencyId = "";
        newFilters.municipalityId = "";
        newFilters.tcId = "";
        newFilters.gpuId = "";
        newFilters.wardId = "";
        newFilters.municipalWardId = "";
      } else if (filterKey === "constituencyId") {
        newFilters.municipalityId = "";
        newFilters.tcId = "";
        newFilters.gpuId = "";
        newFilters.wardId = "";
        newFilters.municipalWardId = "";
      } else if (filterKey === "municipalityId") {
        newFilters.municipalWardId = "";
      } else if (filterKey === "tcId") {
        newFilters.gpuId = "";
        newFilters.wardId = "";
      } else if (filterKey === "gpuId") {
        newFilters.wardId = "";
      }

      newFilters[filterKey] = value;
      setFilters(newFilters);

      // Fetch new filter options and analytics
      await fetchFilterOptions(newFilters);

      // We'll trigger analytics fetch through useEffect dependency
    },
    [filters, fetchFilterOptions]
  );

  // Fetch analytics when filters change
  useEffect(() => {
    if (Object.values(filters).some((v) => v)) {
      fetchAnalytics();
    }
  }, [fetchAnalytics]);

  const clearFilters = () => {
    setFilters({
      districtId: "",
      constituencyId: "",
      municipalityId: "",
      tcId: "",
      gpuId: "",
      wardId: "",
      municipalWardId: "",
    });
    fetchFilterOptions();
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((v) => v).length;
  };

  const getScopeDescription = () => {
    if (!analyticsData?.scope) return "All Sikkim";

    const { level, name } = analyticsData.scope;
    const levelNames: Record<string, string> = {
      districtId: "District",
      constituencyId: "Constituency",
      municipalityId: "Municipality",
      tcId: "TC",
      gpuId: "GPU",
      wardId: "Ward",
      municipalWardId: "Municipal Ward",
    };

    return name || `${levelNames[level] || level}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#061E47]" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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

  const prepareChartData = () => {
    if (!analyticsData)
      return {
        districtData: [],
        ageGroupData: [],
        genderData: [],
        constituencyData: [],
        communityData: [],
      };

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

    return {
      districtData: analyticsData.districtWiseVoters.map((item, index) => ({
        ...item,
        color: districtColors[index % districtColors.length],
      })),
      ageGroupData: analyticsData.ageGroupDistribution.map((item) => ({
        ageGroup: item.ageGroup,
        count: item.voters,
      })),
      genderData: analyticsData.genderDistribution.map((item) => ({
        name: item.gender,
        value: item.count,
        color:
          item.gender === "Male"
            ? "#3B82F6"
            : item.gender === "Female"
            ? "#EC4899"
            : "#8B5CF6",
      })),
      constituencyData: analyticsData.constituencyWiseVoters.map((item) => ({
        name: item.constituency,
        value: item.voters,
      })),
      communityData: analyticsData.voterLastNames.map((item) => ({
        name: item.lastName,
        value: item.count,
      })),
    };
  };

  const charts = prepareChartData();

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
            Real-time voter statistics for {getScopeDescription()}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 ml-11 md:ml-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm md:btn-md ${
              showFilters
                ? "bg-[#061E47] text-white"
                : "btn-outline border-gray-300 hover:border-[#061E47]"
            } hover:bg-[#061E47] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters{" "}
            {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </button>
          <button
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="btn btn-sm md:btn-md btn-outline border-gray-300 hover:border-[#061E47] hover:bg-[#061E47] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filter Options</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                value={filters.districtId}
                onChange={(e) =>
                  handleFilterChange("districtId", e.target.value)
                }
                className="select select-bordered w-full select-sm"
              >
                <option value="">All Districts</option>
                {filterOptions.districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Constituency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Constituency
              </label>
              <select
                value={filters.constituencyId}
                onChange={(e) =>
                  handleFilterChange("constituencyId", e.target.value)
                }
                className="select select-bordered w-full select-sm"
                disabled={!filters.districtId}
              >
                <option value="">All Constituencies</option>
                {filterOptions.constituencies.map((constituency) => (
                  <option key={constituency.id} value={constituency.id}>
                    {constituency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipality
              </label>
              <select
                value={filters.municipalityId}
                onChange={(e) =>
                  handleFilterChange("municipalityId", e.target.value)
                }
                className="select select-bordered w-full select-sm"
                disabled={!filters.constituencyId}
              >
                <option value="">All Municipalities</option>
                {filterOptions.municipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipal Ward Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipal Ward
              </label>
              <select
                value={filters.municipalWardId}
                onChange={(e) =>
                  handleFilterChange("municipalWardId", e.target.value)
                }
                className="select select-bordered w-full select-sm"
                disabled={!filters.municipalityId}
              >
                <option value="">All Municipal Wards</option>
                {filterOptions.municipalWards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    Ward {ward.ward_no} - {ward.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TC Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TC
              </label>
              <select
                value={filters.tcId}
                onChange={(e) => handleFilterChange("tcId", e.target.value)}
                className="select select-bordered w-full select-sm"
                disabled={!filters.constituencyId}
              >
                <option value="">All TCs</option>
                {filterOptions.tcs.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    TC {tc.tc_no} - {tc.tc_name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPU Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPU
              </label>
              <select
                value={filters.gpuId}
                onChange={(e) => handleFilterChange("gpuId", e.target.value)}
                className="select select-bordered w-full select-sm"
                disabled={!filters.tcId}
              >
                <option value="">All GPUs</option>
                {filterOptions.gpus.map((gpu) => (
                  <option key={gpu.id} value={gpu.id}>
                    GPU {gpu.gpu_no} - {gpu.gpu_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ward
              </label>
              <select
                value={filters.wardId}
                onChange={(e) => handleFilterChange("wardId", e.target.value)}
                className="select select-bordered w-full select-sm"
                disabled={!filters.gpuId}
              >
                <option value="">All Wards</option>
                {filterOptions.wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    Ward {ward.ward_no} - {ward.ward_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm w-full"
                disabled={getActiveFilterCount() === 0}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

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
              {getScopeDescription()}
            </div>
            <div className="text-xs text-gray-500">Data Source: SEC API</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 transition-all duration-300 ${
          sidebarCollapsed ? "xl:grid-cols-4" : ""
        }`}
      >
        {[
          {
            icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Total Voters",
            value: analyticsData?.totals.voters.toLocaleString() || "0",
            color: "from-blue-500 to-blue-600",
            border: "border-l-blue-500",
          },
          {
            icon: <MapPin className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Districts",
            value: analyticsData?.totals.districts || "0",
            color: "from-green-500 to-emerald-600",
            border: "border-l-green-500",
          },
          {
            icon: <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Constituencies",
            value: analyticsData?.totals.constituencies || "0",
            color: "from-purple-500 to-purple-600",
            border: "border-l-purple-500",
          },
          {
            icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Average Age",
            value: `${Math.round(analyticsData?.averageAge || 0)} yrs`,
            color: "from-orange-500 to-amber-600",
            border: "border-l-orange-500",
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

      {/* Charts Grid */}
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
              Community Distribution (Top 10)
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={charts.communityData.slice(0, 10)}>
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
                {charts.ageGroupData.reduce(
                  (max, curr) => (curr.count > max.count ? curr : max),
                  charts.ageGroupData[0]
                )?.ageGroup || "N/A"}
              </p>
              <p className="text-sm text-green-700">
                {charts.ageGroupData
                  .reduce(
                    (max, curr) => (curr.count > max.count ? curr : max),
                    charts.ageGroupData[0]
                  )
                  ?.count?.toLocaleString() || 0}{" "}
                voters
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
          Data refreshed automatically. For official use only. © 2026 State
          Election Commission, Sikkim
        </p>
      </div>
    </div>
  );
};

export default NewDashboard;
