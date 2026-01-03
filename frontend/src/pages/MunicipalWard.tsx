import {
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
} from "lucide-react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";

type Municipality = {
  id: number;
  name: string;
  municipalityNo: number;
};
type MunicipalWardItem = {
  id: number;
  ward_no: number;
  name: string;
  municipality?: Municipality;
};

export default function MunicipalWard() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [municipalWards, setMunicipalWards] = useState<MunicipalWardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "name" | "municipality" | "number"
  >("name");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMunicipality, setSelectedMunicipality] = useState<{
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

  // Filter Municipal Wards based on search
  const filteredMunicipalWards = municipalWards.filter((item) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    if (searchType === "name") {
      return item.name.toLowerCase().includes(query);
    } else if (searchType === "municipality") {
      const municipalityName = item.municipality?.name;
      const municipalityNo = item.municipality?.municipalityNo;
      return (
        municipalityName?.toLowerCase().includes(query) ||
        municipalityNo?.toString().includes(query)
      );
    } else if (searchType === "number") {
      return item.ward_no.toString().includes(query);
    }
    return true;
  });

  const sortedMunicipalWards = [...filteredMunicipalWards].sort(
    (a, b) => a.ward_no - b.ward_no
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMunicipalWards.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedMunicipalWards.length / itemsPerPage);

  // Fetch Municipalities
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/municipalities/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch municipalities");

        const data = await res.json();
        setMunicipalities(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMunicipalities();
  }, []);

  // Fetch Municipal Wards
  useEffect(() => {
    const fetchMunicipalWards = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/municipal-wards/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch municipal wards");

        const data = await res.json();
        setMunicipalWards(data.wards);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalWards();
  }, []);

  const resetForm = () => {
    setSelectedMunicipality(null);
    setWardNo("");
    setWardName("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMunicipality || !wardNo || !wardName.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = sessionStorage.getItem("token");
      const url = editingId
        ? `${
            import.meta.env.VITE_API_BASE_URL
          }/municipal-wards/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/municipal-wards/create`;

      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { name: wardName, wardNo: Number(wardNo) }
        : {
            name: wardName,
            wardNo: Number(wardNo),
            municipalityId: selectedMunicipality.value,
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
        throw new Error(errorData.error || "Failed to save municipal ward");
      }

      const data = await res.json();

      if (editingId) {
        setMunicipalWards((prev) =>
          prev.map((ward) =>
            ward.id === editingId
              ? {
                  ...ward,
                  name: wardName,
                  ward_no: Number(wardNo),
                }
              : ward
          )
        );
        setSuccessMsg("Municipal ward updated successfully!");
      } else {
        setMunicipalWards((prev) => [
          ...prev,
          {
            id: data.ward.id,
            ward_no: data.ward.ward_no,
            name: data.ward.name,
            municipality: municipalities.find(
              (m) => m.id === selectedMunicipality.value
            ),
          },
        ]);
        setSuccessMsg("Municipal ward created successfully!");
      }

      setTimeout(() => setSuccessMsg(undefined), 3000);
      setModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ward: MunicipalWardItem) => {
    setEditingId(ward.id);
    setWardNo(ward.ward_no);
    setWardName(ward.name);

    if (ward.municipality) {
      setSelectedMunicipality({
        value: ward.municipality.id,
        label: `${ward.municipality.municipalityNo} - ${ward.municipality.name}`,
      });
    }

    setModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/municipal-wards/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete municipal ward");
      }

      setMunicipalWards((prev) => prev.filter((ward) => ward.id !== id));
      setSuccessMsg("Municipal ward deleted successfully!");
      setTimeout(() => setSuccessMsg(undefined), 3000);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const municipalityOptions = municipalities.map((municipality) => ({
    value: municipality.id,
    label: `${municipality.municipalityNo} - ${municipality.name}`,
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

  const selectStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3B82F6" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3B82F6" : "#EBF4FF",
      },
    }),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
                <Building2 className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Municipal Ward Management
                </h1>
                <p className="text-gray-600 text-xs mt-1">
                  State Election Commission, Sikkim
                </p>
              </div>
            </div>
            <p className="text-gray-600 ml-11 hidden md:block text-sm">
              Manage and organize Municipal Wards for election operations
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
              New Municipal Ward
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="alert alert-success mb-4"
          >
            {successMsg}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="alert alert-error mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

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
                          : searchType === "municipality"
                          ? "Municipality"
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
                            searchType === "municipality" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("municipality")}
                        >
                          Search by Municipality
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
                <span className="font-semibold ml-0.5">
                  {municipalWards.length}
                </span>
              </div>
              <div className="badge badge-outline border-green-500 text-green-600 text-xs px-2.5 py-1.5">
                Showing:{" "}
                <span className="font-semibold ml-0.5">
                  {filteredMunicipalWards.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Municipal Ward Table Card */}
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
                Municipal Wards of Sikkim
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredMunicipalWards.length} municipal ward
                {filteredMunicipalWards.length !== 1 ? "s" : ""} found
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
                    Ward No
                  </div>
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Ward Name
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Municipality
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
                    <td colSpan={4} className="text-center py-8 text-gray-500">
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
                              No matching municipal wards found
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              No municipal wards match "{searchQuery}"
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
                            <Building2 className="w-8 h-8 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No municipal wards yet
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Start by adding your first municipal ward
                            </p>
                            <button
                              className="btn btn-xs bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white"
                              onClick={openAddModal}
                            >
                              <FiPlus className="w-3 h-3 mr-1" />
                              Add First Municipal Ward
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
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 text-sm">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {item.municipality ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.municipality.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              Municipality No:{" "}
                              {item.municipality.municipalityNo}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-3 bg-gray-50 border-t border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Showing</span>
                <span className="font-medium text-gray-900">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredMunicipalWards.length
                  )}
                </span>
                <span>of</span>
                <span className="font-medium text-gray-900">
                  {filteredMunicipalWards.length}
                </span>
                <span>municipal wards</span>
              </div>

              <div className="flex items-center gap-1">
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

      {/* Create/Edit Modal */}
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
                        {editingId
                          ? "Edit Municipal Ward"
                          : "New Municipal Ward"}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {editingId
                          ? "Update municipal ward information"
                          : "Create a new Municipal Ward"}
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
                  {/* Select Municipality */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-gray-700 text-sm">
                        Municipality Name{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </span>
                    </label>
                    <Select
                      options={municipalityOptions}
                      value={selectedMunicipality}
                      onChange={(val) => {
                        setSelectedMunicipality(
                          val as { value: number; label: string } | null
                        );
                      }}
                      styles={selectStyles}
                      placeholder="Select municipality..."
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
                        !isLoading &&
                        wardName.trim() &&
                        wardNo &&
                        selectedMunicipality
                          ? { scale: 1.01 }
                          : {}
                      }
                      whileTap={
                        !isLoading &&
                        wardName.trim() &&
                        wardNo &&
                        selectedMunicipality
                          ? { scale: 0.99 }
                          : {}
                      }
                      className={`btn btn-sm flex-1 order-1 sm:order-2 rounded font-medium text-xs ${
                        !wardName.trim() || !wardNo || !selectedMunicipality
                          ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 border-0 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white border-0 hover:from-[#0A2B6B] hover:to-[#061E47]"
                      }`}
                      disabled={
                        isLoading ||
                        !wardName.trim() ||
                        !wardNo ||
                        !selectedMunicipality
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
                          {editingId
                            ? "Update Municipal Ward"
                            : "Save Municipal Ward"}
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
                  <h3 className="font-bold text-base text-white">
                    Delete Municipal Ward
                  </h3>
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
                    Are you sure you want to delete this municipal ward? This
                    action cannot be undone.
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
          © 2026 State Election Commission, Sikkim • Municipal Ward Management
          System v1.0
        </p>
      </motion.div>
    </div>
  );
}
