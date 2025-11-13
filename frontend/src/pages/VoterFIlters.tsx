import { useEffect, useState } from "react";
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
} from "recharts";
import { Users } from "lucide-react"; // Example icon
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

const COLORS = ["#3B82F6", "#EC4899", "#8B5CF6", "#10B981", "#F59E0B"];

export default function VoterFilters() {
  const [constituencies, setConstituencies] = useState<any[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all constituencies
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/constituencies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch constituencies");

        const data = await res.json();
        setConstituencies(data);
      } catch (err) {
        console.error("Error fetching constituencies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, []);

  // 🔹 Fetch stats when constituency selected
  useEffect(() => {
    if (!selectedConstituency) return;

    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/by-constituency/${selectedConstituency}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        // ✅ Ensure safe defaults if backend misses fields
        setStats({
          ...data,
          genderCounts: data.genderCounts || {},
          communityCounts: data.communityCounts || {},
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [selectedConstituency]);

  if (loading) return <p>Loading constituencies...</p>;

  // 🔹 Prepare chart data (safe fallbacks)
  const genderData = stats?.genderCounts
    ? Object.entries(stats.genderCounts).map(([gender, count]) => ({
        name: gender,
        value: count as number,
        color:
          gender === "Male"
            ? "#3B82F6"
            : gender === "Female"
            ? "#EC4899"
            : "#8B5CF6",
      }))
    : [];

  const communityData = stats?.communityCounts
    ? Object.entries(stats.communityCounts).map(([community, count]) => ({
        name: community,
        value: count as number,
      }))
    : [];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Voter Filters</h1>
        <p className="text-base-content/70 text-sm">
          Select a constituency to view detailed voter insights
        </p>
      </div>

      {/* Constituency Dropdown */}
      <div className="mb-6">
        <label htmlFor="constituency" className="mr-2 font-medium">
          Select Constituency:
        </label>
        <select
          id="constituency"
          className="border rounded p-2"
          value={selectedConstituency}
          onChange={(e) => setSelectedConstituency(e.target.value)}
        >
          <option value="">-- Select Constituency --</option>
          {constituencies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {stats && (
        <>
          {/* Stat Card Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Users className="h-full w-full text-blue-500" />}
              title="Total Voters"
              value={stats.totalVoters?.toString() || "0"}
              colorClass="border-blue-500"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender Distribution */}
            <ChartCard title="Gender Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Community Distribution */}
            <ChartCard title="Community Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={communityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
