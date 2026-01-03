import {
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building,
} from "lucide-react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";

type District = {
  id: number;
  name: string;
  code: string | null;
};
type Constituency = {
  id: number;
  name: string;
  constituencyNo: number;
  code?: string | null;
  districts?: District[];
};
type TcItem = {
  id: number;
  tc_no: number;
  tc_name: string;
  constituencyId: number;
  constituency?: Constituency;
};
type GpuItem = {
  id: number;
  gpu_no: number;
  gpu_name: string;
  tc?: TcItem;
  constituency?: Constituency;
  district?: District;
};

export default function AddGpu() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [tcs, setTcs] = useState<TcItem[]>([]);
  const [gpus, setGpus] = useState<GpuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "name" | "district" | "constituency" | "tc"
  >("name");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState<{
    value: number;
    label: string;
    code?: string | null | undefined;
  } | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<{
    value: number;
    label: string;
    code?: string | null;
  } | null>(null);
  const [selectedTc, setSelectedTc] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [gpuNo, setGpuNo] = useState<number | "">("");
  const [gpuName, setGpuName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter GPUs based on search
  const filteredGpus = gpus.filter((item) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    if (searchType === "name") {
      return item.gpu_name.toLowerCase().includes(query);
    } else if (searchType === "district") {
      const districtName =
        item.district?.name ||
        item.constituency?.districts?.[0]?.name ||
        item.tc?.constituency?.districts?.[0]?.name;
      const districtCode =
        item.district?.code || item.constituency?.districts?.[0]?.code;
      return (
        districtName?.toLowerCase().includes(query) ||
        districtCode?.toLowerCase().includes(query)
      );
    } else if (searchType === "constituency") {
      const constituencyName =
        item.constituency?.name || item.tc?.constituency?.name;
      const constituencyNo =
        item.constituency?.constituencyNo ||
        item.tc?.constituency?.constituencyNo;
      return (
        constituencyName?.toLowerCase().includes(query) ||
        constituencyNo?.toString().includes(query)
      );
    } else if (searchType === "tc") {
      const tcName = item.tc?.tc_name;
      const tcNo = item.tc?.tc_no;
      return (
        tcName?.toLowerCase().includes(query) ||
        tcNo?.toString().includes(query)
      );
    }
    return true;
  });

  const sortedGpus = [...filteredGpus].sort((a, b) => a.id - b.id);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedGpus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedGpus.length / itemsPerPage);

  // react-select styles
  const selectStyles: StylesConfig<
    { value: number; label: string; code?: string | null },
    false
  > = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderColor: state.isFocused ? "#061E47" : "#D1D5DB",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(6, 30, 71, 0.1)" : "none",
      "&:hover": { borderColor: "#061E47" },
      fontSize: "0.875rem",
      borderRadius: "6px",
      backgroundColor: "white",
      transition: "all 0.2s ease-in-out",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "6px",
      border: "1px solid #E5E7EB",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      marginTop: "4px",
      overflow: "hidden",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: "180px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#061E47"
        : state.isFocused
        ? "rgba(6, 30, 71, 0.05)"
        : "white",
      color: state.isSelected ? "white" : "#1E293B",
      fontSize: "0.875rem",
      padding: "8px 12px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      "&:active": {
        backgroundColor: state.isSelected ? "#061E47" : "rgba(6, 30, 71, 0.1)",
      },
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontSize: "0.875rem",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#D1D5DB",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#061E47" : "#6B7280",
      padding: "6px",
      transition: "color 0.2s",
      "&:hover": {
        color: "#061E47",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#6B7280",
      padding: "6px",
      "&:hover": {
        color: "#EF4444",
      },
    }),
  };

  useEffect(() => {
    fetchDistricts();
    fetchGpus();
  }, []);

  const fetchDistricts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/districts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch districts");
      const data = await res.json();
      setDistricts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchGpus = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gpus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch GPUs");
      const data = await res.json();
      setGpus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConstituencies = async (districtId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/constituencies/by-district/${districtId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch constituencies");
      const data = await res.json();
      setConstituencies(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchTcs = async (constituencyId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/tcs/by-constituency/${constituencyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch TCs");
      const data = await res.json();
      setTcs(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setSelectedTc(null);
    setGpuNo("");
    setGpuName("");
    setEditingId(null);
    setConstituencies([]);
    setTcs([]);
    setError(null);
  };

  const handleSave = async () => {
    if (
      !gpuNo ||
      !gpuName.trim() ||
      !selectedTc ||
      !selectedConstituency ||
      !selectedDistrict
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/gpus/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/gpus/create`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gpu_no: Number(gpuNo),
          gpu_name: gpuName.trim(),
          tcId: selectedTc.value,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save GPU");

      setSuccessMsg(data.message || "GPU saved successfully!");
      setError(null);
      resetForm();
      setModalOpen(false);
      fetchGpus();
      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/gpus/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete GPU");
      setGpus((prev) => prev.filter((g) => g.id !== id));
      setDeleteId(null);
      setSuccessMsg("GPU deleted successfully");
      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  const handleEdit = async (gpu: GpuItem) => {
    setEditingId(gpu.id);
    setGpuNo(gpu.gpu_no);
    setGpuName(gpu.gpu_name);

    // Try to get data from different possible structures
    const districtId =
      gpu.district?.id ||
      gpu.constituency?.districts?.[0]?.id ||
      gpu.tc?.constituency?.districts?.[0]?.id;

    const constituencyId = gpu.constituency?.id || gpu.tc?.constituency?.id;

    const tcId = gpu.tc?.id;

    if (districtId) {
      const district = districts.find((d) => d.id === districtId);
      if (district) {
        const districtOption = {
          value: district.id,
          label: district.name,
          code: district.code,
        };
        setSelectedDistrict(districtOption);
        await fetchConstituencies(districtId);
      }
    }

    if (constituencyId) {
      const constituencyOption = {
        value: constituencyId,
        label: gpu.constituency
          ? `${gpu.constituency.constituencyNo} - ${gpu.constituency.name}`
          : gpu.tc?.constituency
          ? `${gpu.tc.constituency.constituencyNo} - ${gpu.tc.constituency.name}`
          : `Constituency ${constituencyId}`,
        code: gpu.constituency?.code || gpu.tc?.constituency?.code,
      };
      setSelectedConstituency(constituencyOption);
      await fetchTcs(constituencyId);
    }

    if (tcId) {
      setSelectedTc({
        value: tcId,
        label: gpu.tc ? `${gpu.tc.tc_no} - ${gpu.tc.tc_name}` : `TC ${tcId}`,
      });
    }

    setModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Format district option for select
  const districtOptions = districts.map((d) => ({
    value: d.id,
    label: d.name,
    code: d.code,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.15,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
    exit: { opacity: 0 },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50/30"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#061E47] animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm font-medium">Loading GPUs...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-6"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="p-2 bg-gradient-to-br from-[#061E47] to-[#0A2B6B] rounded-lg shadow"
              >
                <Building className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  GPU Management
                </h1>
                <p className="text-gray-600 text-xs mt-1">
                  State Election Commission, Sikkim
                </p>
              </div>
            </div>
            <p className="text-gray-600 ml-11 hidden md:block text-sm">
              Manage and organize Gram Panchayat Units for election operations
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto"
          >
            <button
              className="btn btn-sm md:btn-md bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 shadow-sm hover:shadow transition-all duration-200 font-medium px-4"
              onClick={openAddModal}
            >
              <FiPlus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
              New GPU
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Stats Bar */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="w-full md:w-auto md:flex-1">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search by ${searchType}...`}
                    className="input input-bordered pl-9 w-full focus:border-[#061E47] focus:ring-1 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="dropdown dropdown-bottom">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                      <span className="text-xs">
                        Search:{" "}
                        {searchType === "name"
                          ? "Name"
                          : searchType === "district"
                          ? "District"
                          : searchType === "constituency"
                          ? "Constituency"
                          : "TC"}
                      </span>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10"
                    >
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "name" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("name")}
                        >
                          Search by GPU Name
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "district" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("district")}
                        >
                          Search by District
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "constituency" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("constituency")}
                        >
                          Search by Constituency
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "tc" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("tc")}
                        >
                          Search by TC
                        </button>
                      </li>
                    </ul>
                  </div>
                  {searchQuery && (
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-outline border-[#061E47] text-[#061E47] text-xs px-2.5 py-1.5">
                Total:{" "}
                <span className="font-semibold ml-0.5">{gpus.length}</span>
              </div>
              <div className="badge badge-outline border-green-500 text-green-600 text-xs px-2.5 py-1.5">
                Showing:{" "}
                <span className="font-semibold ml-0.5">
                  {filteredGpus.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* GPU Table Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        {/* Table Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-900 text-base">
                Gram Panchayat Units of Sikkim
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredGpus.length} GPU{filteredGpus.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium hidden sm:block">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages || 1}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Table Content - Minimal Design */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#061E47] mr-1.5"></div>
                    ID
                  </div>
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  District Name
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Constituency Name & No
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  TC Name
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  GPU
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {currentItems.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-transparent"
                  >
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery ? (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Search className="w-8 h-8 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No matching GPUs found
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              No GPUs match "{searchQuery}"
                            </p>
                            <button
                              className="btn btn-xs btn-outline"
                              onClick={() => setSearchQuery("")}
                            >
                              Clear search
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Building className="w-8 h-8 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No GPUs yet
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Start by adding your first GPU
                            </p>
                            <button
                              className="btn btn-xs bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white"
                              onClick={openAddModal}
                            >
                              <FiPlus className="w-3 h-3 mr-1" />
                              Add First GPU
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </td>
                  </motion.tr>
                ) : (
                  currentItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      custom={index}
                      whileHover={{
                        backgroundColor: "rgba(6, 30, 71, 0.02)",
                      }}
                      className="border-b border-gray-100 last:border-b-0 group"
                    >
                      <td className="font-medium text-gray-600 py-3 px-4">
                        <div className="flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#061E47] to-[#0A2B6B] mr-2"
                          />
                          <span className="font-semibold text-sm">
                            {item.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {item.district ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-700">
                              {item.district.name}
                            </div>
                            <div className="flex gap-1">
                              <span className="badge badge-xs badge-outline border-gray-300 text-gray-600 font-mono">
                                {item.district.code || "No code"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-700">
                              {item.constituency?.districts?.[0]?.name ||
                                item.tc?.constituency?.districts?.[0]?.name ||
                                "—"}
                            </div>
                            <div className="flex gap-1">
                              <span className="badge badge-xs badge-outline border-gray-300 text-gray-600 font-mono">
                                {item.constituency?.districts?.[0]?.code ||
                                  item.tc?.constituency?.districts?.[0]?.code ||
                                  "No code"}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.constituency ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.constituency.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              Constituency No:{" "}
                              {item.constituency.constituencyNo}
                            </span>
                          </div>
                        ) : item.tc?.constituency ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.tc.constituency.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              Constituency No:{" "}
                              {item.tc.constituency.constituencyNo}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.tc ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.tc.tc_name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              TC No: {item.tc.tc_no}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 text-sm">
                            {item.gpu_name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            GPU No: {item.gpu_no}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-1.5">
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "rgba(59, 130, 246, 0.08)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-xs btn-outline border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 px-2"
                            onClick={() => handleEdit(item)}
                          >
                            <FiEdit className="w-3 h-3 mr-1" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                              backgroundColor: "rgba(239, 68, 68, 0.08)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-xs btn-outline border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 px-2"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <FiTrash className="w-3 h-3 mr-1" />
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-200 px-4 py-3 bg-gray-50/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLastItem, sortedGpus.length)}
                </span>{" "}
                of <span className="font-semibold">{sortedGpus.length}</span>{" "}
                GPUs
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  className={`btn btn-xs btn-outline rounded ${
                    currentPage === 1 ? "btn-disabled opacity-50" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1 text-xs">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        className={`btn btn-xs ${
                          currentPage === pageNumber
                            ? "bg-[#061E47] text-white border-[#061E47]"
                            : "btn-outline"
                        }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="px-1.5 text-gray-400 text-xs">...</span>
                  )}
                </div>

                <button
                  className={`btn btn-xs btn-outline rounded ${
                    currentPage === totalPages ? "btn-disabled opacity-50" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline mr-1 text-xs">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Success/Error Toasts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            key="success-toast"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed left-1/2 bottom-4 z-50 transform -translate-x-1/2 w-full max-w-xs px-4"
          >
            <div className="alert alert-success shadow-sm backdrop-blur-sm bg-white/95 py-2">
              <div className="flex items-center gap-2">
                <div className="p-0.5 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-green-600 flex-shrink-0 h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium">{successMsg}</span>
              </div>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error-toast"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed left-1/2 bottom-4 z-50 transform -translate-x-1/2 w-full max-w-xs px-4"
          >
            <div className="alert alert-error shadow-sm backdrop-blur-sm bg-white/95 py-2">
              <div className="flex items-center gap-2">
                <div className="p-0.5 bg-red-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-red-600 flex-shrink-0 h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium">{error}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit GPU Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="modal modal-open">
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="modal-backdrop bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="modal-box max-w-md p-0 overflow-hidden bg-white shadow-xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded">
                      {editingId ? (
                        <FiEdit className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <FiPlus className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {editingId ? "Edit GPU" : "New GPU"}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {editingId
                          ? "Update GPU information"
                          : "Create a new Gram Panchayat Unit"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-xs btn-circle btn-ghost text-white hover:bg-white/20"
                    onClick={() => setModalOpen(false)}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  {/* Select District */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        District Name{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <Select
                      options={districtOptions}
                      value={selectedDistrict}
                      onChange={(val) => {
                        setSelectedDistrict(val);
                        if (val) {
                          fetchConstituencies(val.value);
                          setSelectedConstituency(null);
                          setSelectedTc(null);
                        } else {
                          setConstituencies([]);
                          setSelectedConstituency(null);
                          setSelectedTc(null);
                        }
                      }}
                      styles={selectStyles}
                      placeholder="Select district..."
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      isClearable
                    />
                  </div>

                  {/* Select Constituency */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        Constituency Name{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <Select
                      options={constituencies.map((c) => ({
                        value: c.id,
                        label: `${c.constituencyNo} - ${c.name}`,
                      }))}
                      value={selectedConstituency}
                      onChange={(val) => {
                        setSelectedConstituency(val);
                        if (val) {
                          fetchTcs(val.value);
                          setSelectedTc(null);
                        } else {
                          setTcs([]);
                          setSelectedTc(null);
                        }
                      }}
                      styles={selectStyles}
                      placeholder={
                        selectedDistrict
                          ? "Select constituency..."
                          : "First select a district"
                      }
                      isDisabled={!selectedDistrict}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      isClearable
                    />
                    {selectedDistrict && constituencies.length === 0 && (
                      <span className="label-text-alt text-orange-600 text-xs">
                        No constituencies available for this district
                      </span>
                    )}
                  </div>

                  {/* Select TC */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        TC Name <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <Select
                      options={tcs.map((t) => ({
                        value: t.id,
                        label: `${t.tc_no} - ${t.tc_name}`,
                      }))}
                      value={selectedTc}
                      onChange={setSelectedTc}
                      styles={selectStyles}
                      placeholder={
                        selectedConstituency
                          ? "Select TC..."
                          : "First select a constituency"
                      }
                      isDisabled={!selectedConstituency}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      isClearable
                    />
                    {selectedConstituency && tcs.length === 0 && (
                      <span className="label-text-alt text-orange-600 text-xs">
                        No TCs available for this constituency
                      </span>
                    )}
                  </div>

                  {/* GPU Number */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        GPU Number{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter GPU number"
                      className="input input-bordered w-full focus:border-[#061E47] focus:ring-1 focus:ring-[#061E47]/20 rounded h-9 text-sm"
                      value={gpuNo}
                      onChange={(e) => setGpuNo(Number(e.target.value))}
                      required
                      min="1"
                    />
                  </div>

                  {/* GPU Name */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        GPU Name <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter GPU name"
                      className="input input-bordered w-full focus:border-[#061E47] focus:ring-1 focus:ring-[#061E47]/20 rounded h-9 text-sm"
                      value={gpuName}
                      onChange={(e) => setGpuName(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-error bg-red-50 border-red-200 text-red-700 py-2 rounded text-xs">
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="modal-action flex-col sm:flex-row gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline flex-1 order-2 sm:order-1 rounded font-medium text-xs"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={
                        !isLoading &&
                        gpuName.trim() &&
                        gpuNo &&
                        selectedTc &&
                        selectedConstituency &&
                        selectedDistrict
                          ? { scale: 1.01 }
                          : {}
                      }
                      whileTap={
                        !isLoading &&
                        gpuName.trim() &&
                        gpuNo &&
                        selectedTc &&
                        selectedConstituency &&
                        selectedDistrict
                          ? { scale: 0.99 }
                          : {}
                      }
                      className={`btn btn-sm flex-1 order-1 sm:order-2 rounded font-medium text-xs ${
                        !gpuName.trim() ||
                        !gpuNo ||
                        !selectedTc ||
                        !selectedConstituency ||
                        !selectedDistrict
                          ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 border-0 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white border-0 hover:from-[#0A2B6B] hover:to-[#061E47]"
                      }`}
                      disabled={
                        isLoading ||
                        !gpuName.trim() ||
                        !gpuNo ||
                        !selectedTc ||
                        !selectedConstituency ||
                        !selectedDistrict
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          {editingId ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 mr-1.5" />
                          {editingId ? "Update GPU" : "Save GPU"}
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
          <div className="modal-box max-w-xs p-0 overflow-hidden shadow-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <FiTrash className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-white">Delete GPU</h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3"
                  >
                    <FiTrash className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">
                    Confirm Delete
                  </h4>
                  <p className="text-gray-600 mb-4 text-xs leading-relaxed">
                    Are you sure you want to delete this GPU? This action cannot
                    be undone.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="btn btn-sm btn-outline flex-1 rounded font-medium text-xs"
                      onClick={() => setDeleteId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-error flex-1 rounded font-medium text-xs text-white"
                      onClick={() => handleDelete(deleteId)}
                    >
                      <FiTrash className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-4 border-t border-gray-200"
      >
        <p className="text-center text-xs text-gray-500">
          © 2026 State Election Commission, Sikkim • GPU Management System v1.0
        </p>
      </motion.div>
    </motion.div>
  );
}
