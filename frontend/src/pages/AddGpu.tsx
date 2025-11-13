import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";

type District = { id: number; name: string };
type Constituency = { id: number; name: string; constituencyNo: number };
type TcItem = { id: number; tc_no: number; tc_name: string; constituencyId: number };
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

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedTc, setSelectedTc] = useState("");
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
  const sortedGpus = [...gpus].sort((a, b) => a.id - b.id);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedGpus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedGpus.length / itemsPerPage);

  useEffect(() => {
    fetchDistricts();
    fetchGpus();
  }, []);

  const fetchDistricts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/districts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch districts");
      setDistricts(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchConstituencies = async (districtId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/constituencies/by-district/${districtId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch constituencies");
      const data = await res.json();
      setConstituencies(data);
      return data; // return fetched data for chaining
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const fetchTcs = async (constituencyId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tcs/by-constituency/${constituencyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch TCs");
      const data = await res.json();
      setTcs(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
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

  const resetForm = () => {
    setSelectedDistrict("");
    setSelectedConstituency("");
    setSelectedTc("");
    setGpuNo("");
    setGpuName("");
    setEditingId(null);
    setConstituencies([]);
    setTcs([]);
    (document.getElementById("add_gpu_modal") as HTMLDialogElement)?.close();
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!selectedDistrict || !selectedConstituency || !selectedTc || !gpuNo || !gpuName) {
        setError("Please fill all fields");
        return;
      }

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
          gpu_name: gpuName,
          tcId: Number(selectedTc),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save GPU");

      setSuccessMsg(data.message || "GPU saved successfully!");
      setError(null);
      resetForm();
      fetchGpus();
      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gpus/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete GPU");
      setGpus((prev) => prev.filter((g) => g.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  // ✅ FIXED handleEdit with proper async chaining
  const handleEdit = async (gpu: GpuItem) => {
    setEditingId(gpu.id);
    setGpuNo(gpu.gpu_no);
    setGpuName(gpu.gpu_name);

    if (gpu.tc && gpu.tc.constituencyId) {
      const constituencyId = String(gpu.tc.constituencyId);

      // 1️⃣ Set district if available
      const districtId = gpu.district ? String(gpu.district.id) : "";
      setSelectedDistrict(districtId);

      // 2️⃣ Fetch constituencies for the district
      if (districtId) {
        await fetchConstituencies(districtId);
        setSelectedConstituency(constituencyId);

        // 3️⃣ Fetch TCs for the constituency
        await fetchTcs(constituencyId);
        setSelectedTc(String(gpu.tc.id));
      }
    }

    (document.getElementById("add_gpu_modal") as HTMLDialogElement)?.showModal();
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <div className="p-4 lg:p-6">
      {/* GPU Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of GPUs</h2>
        <div className="flex justify-end mt-4">
          <button
            className="btn btn-outline btn-success mr-10 btn-xs"
            onClick={() => {
              resetForm();
              (document.getElementById("add_gpu_modal") as HTMLDialogElement)?.showModal();
            }}
          >
            <FiPlus size={14} /> New GPU
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>District</th>
              <th>Constituency</th>
              <th>TC</th>
              <th>GPU No</th>
              <th>GPU Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentItems.length > 0 ? (
              currentItems.map((gpu) => (
                <tr key={gpu.id} className="hover:bg-base-200/50">
                  <td>{gpu.district?.name || "—"}</td>
                  <td>{gpu.constituency?.name || gpu.tc?.constituency?.name || "—"}</td>
                  <td>{gpu.tc ? `${gpu.tc.tc_no} - ${gpu.tc.tc_name}` : "—"}</td>
                  <td>{gpu.gpu_no}</td>
                  <td>{gpu.gpu_name}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs btn-outline btn-warning"
                      onClick={() => handleEdit(gpu)}
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => setDeleteId(gpu.id)}
                    >
                      <FiTrash size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 italic py-4">
                  No GPUs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="join">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`text-green join-item btn btn-sm ${currentPage === i + 1 ? "btn-active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Toasts */}
      {successMsg && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success text-white">
            <span>{successMsg}</span>
          </div>
        </div>
      )}
      {error && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error text-white">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Add/Edit GPU Modal */}
      <dialog id="add_gpu_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => (document.getElementById("add_gpu_modal") as HTMLDialogElement)?.close()}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">{editingId ? "Edit GPU" : "Add New GPU"}</h3>

          <form
            className="w-full max-w-md space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* District */}
            <div>
              <label className="label"><span className="label-text">District</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedDistrict}
                onChange={async (e) => {
                  const districtId = e.target.value;
                  setSelectedDistrict(districtId);
                  setSelectedConstituency("");
                  setSelectedTc("");
                  if (districtId) await fetchConstituencies(districtId);
                }}
              >
                <option value="">-- Select District --</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Constituency */}
            <div>
              <label className="label"><span className="label-text">Constituency</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedConstituency}
                onChange={async (e) => {
                  const constituencyId = e.target.value;
                  setSelectedConstituency(constituencyId);
                  setSelectedTc("");
                  if (constituencyId) await fetchTcs(constituencyId);
                }}
              >
                <option value="">-- Select Constituency --</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>{c.constituencyNo} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* TC */}
            <div>
              <label className="label"><span className="label-text">TC</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedTc}
                onChange={(e) => setSelectedTc(e.target.value)}
              >
                <option value="">-- Select TC --</option>
                {tcs.map((t) => (
                  <option key={t.id} value={t.id}>{t.tc_no} - {t.tc_name}</option>
                ))}
              </select>
            </div>

            {/* GPU No */}
            <div>
              <label className="label"><span className="label-text">GPU No</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={gpuNo}
                onChange={(e) => setGpuNo(Number(e.target.value))}
              />
            </div>

            {/* GPU Name */}
            <div>
              <label className="label"><span className="label-text">GPU Name</span></label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                value={gpuName}
                onChange={(e) => setGpuName(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-full mt-2">
              <Save size={16} className="mr-2" />
              {editingId ? "Update GPU" : "Save GPU"}
            </button>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p>Are you sure you want to delete this GPU?</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
                (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => (document.getElementById("delete_modal") as HTMLDialogElement)?.close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
