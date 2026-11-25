import { Search, ChevronLeft, ChevronRight, Loader2, Home } from "lucide-react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";

type Gpu = {
  id: number;
  gpu_name: string;
  gpu_no: number;
  tc: {
    id: number;
    tc_name: string;
    tc_no: number;
    constituency: {
      id: number;
      name: string;
      constituencyNo: number;
      districts: Array<{
        id: number;
        name: string;
        code: string | null;
      }>;
    };
  };
};

type WardItem = {
  id: number;
  ward_no: number;
  ward_name: string;
  gpu?: Gpu;
};

export default function Ward() {
  // Animation variants
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

  // Animation variants for the wards list
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

  // react-select styles
  const selectStyles: StylesConfig<{ value: number; label: string }, false> = {
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

  const [gpus, setGpus] = useState<Gpu[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "gpu" | "number">(
    "name",
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedGpu, setSelectedGpu] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [wardNo, setWardNo] = useState<number | "">("");
  const [wardName, setWardName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Wards based on search
  const filteredWards = wards.filter((item) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    if (searchType === "name") {
      return item.ward_name.toLowerCase().includes(query);
    } else if (searchType === "gpu") {
      const gpuName = item.gpu?.gpu_name;
      const gpuNo = item.gpu?.gpu_no;
      return (
        gpuName?.toLowerCase().includes(query) ||
        gpuNo?.toString().includes(query)
      );
    } else if (searchType === "number") {
      return item.ward_no.toString().includes(query);
    }
    return true;
  });

  const sortedWards = [...filteredWards].sort((a, b) => a.ward_no - b.ward_no);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedWards.length / itemsPerPage);

  // Fetch GPUs
  useEffect(() => {
    const fetchGpus = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gpus`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch GPUs");

        const data = await res.json();
        setGpus(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGpus();
  }, []);

  // Fetch Wards
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wards`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch wards");

        const data = await res.json();
        setWards(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  const resetForm = () => {
    setSelectedGpu(null);
    setWardNo("");
    setWardName("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGpu || !wardNo || !wardName.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = sessionStorage.getItem("token");
      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/wards/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/wards/create`;

      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { ward_name: wardName, ward_no: Number(wardNo) }
        : {
            ward_name: wardName,
            ward_no: Number(wardNo),
            gpuId: selectedGpu.value,
          };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save ward");
      }

      const data = await res.json();

      if (editingId) {
        setWards((prev) =>
          prev.map((ward) =>
            ward.id === editingId
              ? {
                  ...ward,
                  ward_name: wardName,
                  ward_no: Number(wardNo),
                }
              : ward,
          ),
        );
        setSuccessMsg("Ward updated successfully!");
      } else {
        setWards((prev) => [...prev, data.ward || data]);
        setSuccessMsg("Ward created successfully!");
      }

      resetForm();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ward: WardItem) => {
    setWardNo(ward.ward_no);
    setWardName(ward.ward_name);

    if (ward.gpu) {
      setSelectedGpu({
        value: ward.gpu.id,
        label: `${ward.gpu.gpu_no} - ${ward.gpu.gpu_name}`,
      });
    }

    setEditingId(ward.id);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/wards/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete ward");
      }

      setWards((prev) => prev.filter((ward) => ward.id !== id));
      setSuccessMsg("Ward deleted successfully!");
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const gpuOptions = gpus.map((gpu) => ({
    value: gpu.id,
    label: `${gpu.gpu_no} - ${gpu.gpu_name}`,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-6">
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
                <Home className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Ward Management
                </h1>
                <p className="text-gray-600 text-xs mt-1">
                  State Election Commission, Sikkim
                </p>
              </div>
            </div>
            <p className="text-gray-600 ml-11 hidden md:block text-sm">
              Manage and organize Wards for rural election operations
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto"
          >
            <button
              className="btn btn-sm md:btn-md bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 shadow-sm hover:shadow transition-all duration-200 font-medium px-4"
              onClick={() => {
                resetForm();
                setModalOpen(true);
              }}
            >
              <FiPlus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
              New Ward
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filters */}
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
                          : searchType === "gpu"
                            ? "GPU"
                            : "Number"}
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
                          Search by Name
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "gpu" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("gpu")}
                        >
                          Search by GPU
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "number" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("number")}
                        >
                          Search by Number
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
                <span className="font-semibold ml-0.5">{wards.length}</span>
              </div>
              <div className="badge badge-outline border-green-500 text-green-600 text-xs px-2.5 py-1.5">
                Showing:{" "}
                <span className="font-semibold ml-0.5">
                  {filteredWards.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-error mb-6"
          >
            {error}
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-success mb-6"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wards Table */}
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
                Wards of Sikkim
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredWards.length} ward
                {filteredWards.length !== 1 ? "s" : ""} found
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

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#061E47] mr-1.5"></div>
                    Ward No
                  </div>
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Ward Name
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  GPU Details
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  TC Details
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Constituency Details
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
                              No matching wards found
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              No wards match "{searchQuery}"
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
                            <Home className="w-8 h-8 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No wards yet
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Start by adding your first ward
                            </p>
                            <button
                              className="btn btn-xs bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white"
                              onClick={() => {
                                resetForm();
                                setModalOpen(true);
                              }}
                            >
                              <FiPlus className="w-3 h-3 mr-1" />
                              Add First Ward
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
                            {item.ward_no}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800 text-sm">
                          {item.ward_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.gpu ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-700">
                              {item.gpu.gpu_name}
                            </div>
                            <div className="flex gap-1">
                              <span className="badge badge-xs badge-outline border-gray-300 text-gray-600 font-mono">
                                GPU No: {item.gpu.gpu_no}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.gpu?.tc ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.gpu.tc.tc_name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              TC No: {item.gpu.tc.tc_no}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.gpu?.tc?.constituency ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.gpu.tc.constituency.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              Constituency No:{" "}
                              {item.gpu.tc.constituency.constituencyNo}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
                            <FiEdit className="w-3 h-3" />
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
                            <FiTrash className="w-3 h-3" />
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
                  {Math.min(indexOfLastItem, sortedWards.length)}
                </span>{" "}
                of <span className="font-semibold">{sortedWards.length}</span>{" "}
                wards
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

      {/* Add/Edit Ward Modal */}
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
                        {editingId ? "Edit Ward" : "New Ward"}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {editingId
                          ? "Update ward information"
                          : "Create a new Ward"}
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
                    handleSubmit(e);
                  }}
                  className="space-y-4"
                >
                  {/* Select GPU */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        GPU Name <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <Select
                      options={gpuOptions}
                      value={selectedGpu}
                      onChange={(val) => {
                        setSelectedGpu(
                          val as { value: number; label: string } | null,
                        );
                      }}
                      styles={selectStyles}
                      placeholder="Select GPU..."
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      isClearable
                      isDisabled={!!editingId}
                    />
                  </div>

                  {/* Ward Number */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        Ward Number{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter ward number"
                      className="input input-bordered w-full focus:border-[#061E47] focus:ring-1 focus:ring-[#061E47]/20 rounded h-9 text-sm"
                      value={wardNo}
                      onChange={(e) =>
                        setWardNo(e.target.value ? Number(e.target.value) : "")
                      }
                      required
                      min="1"
                    />
                  </div>

                  {/* Ward Name */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        Ward Name <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ward name"
                      className="input input-bordered w-full focus:border-[#061E47] focus:ring-1 focus:ring-[#061E47]/20 rounded h-9 text-sm"
                      value={wardName}
                      onChange={(e) => setWardName(e.target.value)}
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
                        !isLoading && wardName.trim() && wardNo && selectedGpu
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={
                        !isLoading && wardName.trim() && wardNo && selectedGpu
                          ? { scale: 0.98 }
                          : {}
                      }
                      disabled={
                        isLoading || !wardName.trim() || !wardNo || !selectedGpu
                      }
                      className="btn btn-sm bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 flex-1 order-1 sm:order-2 rounded font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          {editingId ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          {editingId ? (
                            <>
                              <FiEdit className="w-3 h-3 mr-1" />
                              Update Ward
                            </>
                          ) : (
                            <>
                              <FiPlus className="w-3 h-3 mr-1" />
                              Create Ward
                            </>
                          )}
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
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiTrash className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Ward
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Are you sure you want to delete this ward? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    disabled={isLoading}
                    className="btn btn-error btn-sm gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
