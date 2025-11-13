import { useEffect, useState } from "react";
import { Users, BarChart3, TrendingUp, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // LineChart,
  // Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
// import {
//   ageGroupData,
//   genderData,
//   trendData,
// } from "../data";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

const Dashboard: React.FC = () => {
  const [totalVoters, setTotalVoters] = useState<number | null>(null);
  const [totalConstituency, settotalConstituency] = useState<number | null>(null);
  const [totalDistrict, settotalDistrict] = useState<number | null>(null);

  const [voterAvgAge, setvoterAvgAge] = useState<number | null>(null);
  const [districtData, setDistrictData] = useState<{ district: string; voters: number }[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupData[]>([]);

  const [genderData, setGenderData] = useState<any[]>([]);
  const [loadingGender, setLoadingGender] = useState(true);
  const [errorGender, setErrorGender] = useState<string | null>(null);

  const [constituencyData, setConstituencyData] = useState<any[]>([]);
  const [loadingConstituency, setLoadingConstituency] = useState(true);
  const [errorConstituency, setErrorConstituency] = useState<string | null>(null);



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [communityData, setCommunityData] = useState<any[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [errorCommunity, setErrorCommunity] = useState<string | null>(null);



  useEffect(() => {
    const fetchVoterCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/count`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch voter count: ${res.statusText}`);
        }
        const data = await res.json();
        setTotalVoters(data.totalVoters);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVoterCount();
  }, []);

  useEffect(() => {
    const fetchConstituencyCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/constituencies/count`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch constituency count: ${res.statusText}`);
        }
        const data = await res.json();
        console.log(data.count);
        settotalConstituency(data.count)
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencyCount();
  }, []);

    useEffect(() => {
      const fetchDistrictCount = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/districts/count`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error(`Failed to fetch district count: ${res.statusText}`);
          }
          const data = await res.json();
          console.log(data.count);
          settotalDistrict(data.count)
        } catch (err: any) {
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      fetchDistrictCount();
  }, []);


    useEffect(() => {
    const fetchVoterAvgAge = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/average-age`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch average-age: ${res.statusText}`);
        }
        const data = await res.json();
        setvoterAvgAge(data.averageAge)
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVoterAvgAge();
  }, []);

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voters/district-wise-count`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch district data");
        }
        const data = await res.json();
        console.log(data);
        
        setDistrictData(data);
      } catch (err) {
        console.error("Error fetching district-wise voter count:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, []);

  useEffect(() => {
    const fetchAgeGroupData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/age-group`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch age group data: ${res.statusText}`);
        }

        const data = await res.json();

        // API returns { ageGroup: "18-25", voters: 320 } → recharts expects "count"
        const formatted = data.map((item: any) => ({
          ageGroup: item.ageGroup,
          count: item.voters,
        }));

        setAgeGroupData(formatted);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAgeGroupData();
  }, []);

  useEffect(() => {
  const fetchGenderData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/voters/gender-distribution`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch gender data: ${res.statusText}`);
      }

      const data = await res.json();

      // API returns { gender: "Male", count: 120 } → recharts expects { name, value }
      const formatted = data.map((item: any) => ({
        name: item.gender,
        value: item.count,
        color:
          item.gender === "Male"
            ? "#3B82F6"
            : item.gender === "Female"
            ? "#EC4899"
            : "#8B5CF6", // fallback for "Other"
      }));
      console.log(formatted);
      
      setGenderData(formatted);
    } catch (err: any) {
      setErrorGender(err.message || "Something went wrong");
    } finally {
      setLoadingGender(false);
    }
  };

  fetchGenderData();
}, []);

useEffect(() => {
  const fetchConstituencyVoters = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/voters/constituency-voters`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch constituency voters: ${res.statusText}`);
      }

      const data = await res.json();
      console.log(data);
      
      // API returns [{ constituency: "ABC", count: 100 }, ...]
      // Recharts expects { name, value }
      const formatted = data.map((item: any) => ({
        name: item.constituency,
        value: item.voters,
      }));

      console.log("Constituency voters:", formatted);
      setConstituencyData(formatted);
    } catch (err: any) {
      setErrorConstituency(err.message || "Something went wrong");
    } finally {
      setLoadingConstituency(false);
    }
  };

  fetchConstituencyVoters();
}, []);

useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/voters/last-names`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch community data: ${res.statusText}`);
        }

        const data = await res.json();

        // ✅ map API response to recharts format
        const formatted = data.map((item: any) => ({
          name: item.lastName,
          value: item.count,
        }));

        setCommunityData(formatted);
      } catch (err: any) {
        setErrorCommunity(err.message || "Something went wrong");
      } finally {
        setLoadingCommunity(false);
      }
    };

    fetchCommunityData();
  }, []);



  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
          Dashboard
        </h1>
        <p className="text-base-content/70 text-sm lg:text-base">
          Overview of voter registration and demographics
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          icon={<Users className="h-full w-full text-blue-500" />}
          title="Total Voters"
          value={
            loading ? "Loading..." : error ? "Error" : totalVoters?.toString()
          }
          colorClass="border-blue-500"
        />
        <StatCard
          icon={<MapPin className="h-full w-full text-green-500" />}
          title="Districts"
          value={
            loading ? "Loading..." : error ? "Error" : totalDistrict?.toString()
          }
          colorClass="border-green-500"
        />
        <StatCard
          icon={<BarChart3 className="h-full w-full text-purple-500" />}
          title="Constituencies"
          value={
            loading ? "Loading..." : error ? "Error" : totalConstituency?.toString()
          }
          colorClass="border-purple-500"
        />
        <StatCard
          icon={<TrendingUp className="h-full w-full text-orange-500" />}
          title="Avg Age"
          value={
            loading
              ? "Loading..."
              : error
              ? "Error"
              : voterAvgAge
              ? Math.round(voterAvgAge).toString() // 👈 round off to nearest whole number
              : "0"
        }

          colorClass="border-orange-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* District */}
        <ChartCard title="Voters by District">
          {loading ? (
            <p className="p-4 text-sm">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="district"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="voters" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Age Group */}
        <ChartCard title="Age Group Distribution">
          {loading ? (
            <p>Loading age group data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Gender */}
        <ChartCard title="Gender Distribution">
          {loadingGender ? (
            <p>Loading gender data...</p>
          ) : errorGender ? (
            <p className="text-red-500">{errorGender}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}` as any}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        </div>

        {/* Constituency → Full width row */}
        <ChartCard title="Voters by Constituency" className="lg:col-span-3">
          {loadingConstituency ? (
            <p className="p-4 text-sm">Loading...</p>
          ) : errorConstituency ? (
            <p className="p-4 text-sm text-red-500">{errorConstituency}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={constituencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  label={{
                    value: "Constituency",
                    position: "insideBottom",
                    offset: -4,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: "Voters", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
         <ChartCard title="Voters by Community (Last Name)" className="lg:col-span-3">
      {loadingCommunity ? (
        <p className="p-4 text-sm">Loading...</p>
      ) : errorCommunity ? (
        <p className="p-4 text-sm text-red-500">{errorCommunity}</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={communityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              label={{
                value: "Community",
                position: "insideBottom",
                offset: 4,
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Voters",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" /> {/* blue bar for community */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
    </div>
    
  );
};

export default Dashboard;
