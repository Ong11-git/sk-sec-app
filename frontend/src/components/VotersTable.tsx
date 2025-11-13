import { useEffect, useState } from "react";
import type { Voter } from "../types";

const VotersTable: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // filter state
  const [filters, setFilters] = useState({
    epicNo: "",
    name: "",
    relationType: "",
    relationName: "",
    age: "",
    gender: "",
    country: "",
    gpuName: "",
    gpuNo: "",
    state: "",
    tcName: "",
    tcNo: "",
    wardName: "",
    wardNo: "",
    district: "",
    constituency: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voters`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch voters: ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data);
        setVoters(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  if (loading) return <p className="p-4 text-sm">Loading voters...</p>;
  if (error) return <p className="p-4 text-xs text-red-500">{error}</p>;

  // filtering logic
  const filteredVoters = voters.filter((voter) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const fieldValue = (voter as any)[key];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentVoters = filteredVoters.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredVoters.length / rowsPerPage);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      epicNo: "",
      name: "",
      relationType: "",
      relationName: "",
      age: "",
      gender: "",
      country: "",
      gpuName: "",
      gpuNo: "",
      state: "",
      tcName: "",
      tcNo: "",
      wardName: "",
      wardNo: "",
      district: "",
      constituency: "",
    });
  };

  return (
    <div className="lg:block bg-base-100 rounded-lg shadow-md overflow-hidden text-sm">
      {/* Filter Dropdown */}
      <div className="flex justify-between items-center p-3 bg-base-200">
        <h2 className="font-bold text-base">Voters</h2>
        <div className="relative">
          <button
            className="btn btn-xs btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-[600px] bg-white shadow-lg border rounded-lg z-50 p-4 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto text-xs">
              {Object.keys(filters).map((key) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={(filters as any)[key]}
                  placeholder={`Filter by ${key}`}
                  onChange={handleFilterChange}
                  className="input input-xs input-bordered w-full"
                />
              ))}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button onClick={resetFilters} className="btn btn-xs btn-outline">
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-xs btn-primary"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-base-200 text-xs">
            <tr>
              <th className="px-3 py-2">
                Epic No
              </th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Relation Type</th>
              <th className="px-3 py-2">Relation Name</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Gender</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">GPU</th>
              <th className="px-3 py-2">GPU No</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">TC</th>
              <th className="px-3 py-2">TC No</th>
              <th className="px-3 py-2">Ward Name</th>
              <th className="px-3 py-2">Ward No</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Constituency</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentVoters.map((voter) => (
              <tr key={voter.id} className="hover:bg-base-200/50">
                <td className="px-3 py-2 ">
                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                   {voter.epicNo}
                  </span>
                </td>
                <td className="px-3 py-2">{voter.name}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {voter.relationType}
                   </span>
                </td>
                <td className="px-3 py-2">{voter.relationName}</td>
                <td className="px-3 py-2">{voter.age}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      voter.gender === "Male"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {voter.gender}
                  </span>
                </td>
                <td className="px-3 py-2">{voter.country}</td>
                <td className="px-3 py-2">{voter.gpuName}</td>
                <td className="px-3 py-2">
                   <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {voter.gpuNo}
                   </span>
                </td>
                <td className="px-3 py-2">{voter.state}</td>
                <td className="px-3 py-2">{voter.tcName}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {voter.tcNo}
                   </span>
                </td>
                <td className="px-3 py-2">{voter.wardName}</td>
                <td className="px-3 py-2">
                   <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                         {voter.wardNo}
                   </span>
                </td>
                <td className="px-3 py-2">{voter.district.name}</td>
                <td className="px-3 py-2">{voter.constituency.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-3 bg-base-200 text-xs">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-xs btn-outline"
        >
          Previous
        </button>
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-xs btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VotersTable;
