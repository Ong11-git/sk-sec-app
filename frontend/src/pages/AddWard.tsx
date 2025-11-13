import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";

type District = { id: number; name: string };
type Constituency = { id: number; name: string; constituencyNo: number };
type TcItem = { id: number; tc_no: number; tc_name: string; constituencyId: number };
type GpuItem = { id: number; gpu_no: number; gpu_name: string; tcId: number };
type WardItem = {
  id: number;
  ward_no: number;
  ward_name: string;
  gpu?: GpuItem;
  tc?: TcItem;
  constituency?: Constituency;
  district?: District;
};



export default function AddWard() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [tcs, setTcs] = useState<TcItem[]>([]);
  const [gpus, setGpus] = useState<GpuItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedTc, setSelectedTc] = useState("");
  const [selectedGpu, setSelectedGpu] = useState("");
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
  const sortedWards = [...wards].sort((a, b) => a.id - b.id);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedWards.length / itemsPerPage);

  useEffect(() => {
    fetchDistricts();
    fetchWards();
  }, []);

  const fetchDistricts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/districts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const data = await res.json();
      setConstituencies(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

    const fetchTcs = async (constituencyId: string) => {
    try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tcs/by-constituency/${constituencyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Fetch TCs response:", res);

        if (!res.ok) {
        const text = await res.text(); // log raw response
        console.error("Failed response:", text);
        throw new Error("Failed to fetch TCs");
        }

        const data = await res.json();
        setTcs(data);
        return data;
    } catch (err: any) {
        setError(err.message);
        return [];
    }
    };


  const fetchGpus = async (tcId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/gpus/by-tc/${tcId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setGpus(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchWards = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setWards(data);
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
    setSelectedGpu("");
    setWardNo("");
    setWardName("");
    setEditingId(null);
    setConstituencies([]);
    setTcs([]);
    setGpus([]);
    (document.getElementById("add_ward_modal") as HTMLDialogElement)?.close();
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!selectedDistrict || !selectedConstituency || !selectedTc || !selectedGpu || !wardNo || !wardName) {
        setError("Please fill all fields");
        return;
      }

      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/wards/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/wards/create`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ward_no: Number(wardNo),
          ward_name: wardName,
          gpuId: Number(selectedGpu),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save Ward");

      setSuccessMsg(data.message || "Ward saved successfully!");
      resetForm();
      fetchWards();
      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wards/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete Ward");
      setWards((prev) => prev.filter((w) => w.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = async (ward: WardItem) => {
    setEditingId(ward.id);
    setWardNo(ward.ward_no);
    setWardName(ward.ward_name);

    if (ward.district && ward.constituency && ward.tc && ward.gpu) {
      setSelectedDistrict(String(ward.district.id));
      await fetchConstituencies(String(ward.district.id));
      setSelectedConstituency(String(ward.constituency.id));
      await fetchTcs(String(ward.constituency.id));
      setSelectedTc(String(ward.tc.id));
      await fetchGpus(String(ward.tc.id));
      setSelectedGpu(String(ward.gpu.id));
    }

    (document.getElementById("add_ward_modal") as HTMLDialogElement)?.showModal();
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <div className="p-4 lg:p-6">
      {/* Ward Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of Wards</h2>
        <div className="flex justify-end mt-4">
          <button
            className="btn btn-outline btn-success mr-10 btn-xs"
            onClick={() => {
              resetForm();
              (document.getElementById("add_ward_modal") as HTMLDialogElement)?.showModal();
            }}
          >
            <FiPlus size={14} /> New Ward
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>District</th>
              <th>Constituency</th>
              <th>TC</th>
              <th>GPU</th>
              <th>Ward</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentItems.length > 0 ? (
                currentItems.map((w) => (
                <tr key={w.id} className="hover:bg-base-200/50">
                    {/* District (first item of array) */}
                    <td>
                    {w.gpu?.tc?.constituency?.districts?.[0]?.name || "—"}
                    </td>

                    {/* Constituency */}
                    <td>
                    {w.gpu?.tc?.constituency
                        ? `${w.gpu.tc.constituency.constituencyNo} - ${w.gpu.tc.constituency.name}`
                        : "—"}
                    </td>

                    {/* TC */}
                    <td>
                    {w.gpu?.tc
                        ? `${w.gpu.tc.tc_no} - ${w.gpu.tc.tc_name}`
                        : "—"}
                    </td>

                    {/* GPU */}
                    <td>
                    {w.gpu
                        ? `${w.gpu.gpu_no} - ${w.gpu.gpu_name}`
                        : "—"}
                    </td>
                    {/* Ward */}
                    <td>
                    {w.ward_no && w.ward_name
                        ? `${w.ward_no} - ${w.ward_name}`
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="flex gap-2">
                    <button
                        className="btn btn-xs btn-outline btn-warning"
                        onClick={() => handleEdit(w)}
                    >
                        <FiEdit size={14} /> Edit
                    </button>
                    <button
                        className="btn btn-xs btn-outline btn-error"
                        onClick={() => setDeleteId(w.id)}
                    >
                        <FiTrash size={14} /> Delete
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td
                    colSpan={7}
                    className="text-center text-gray-500 italic py-4"
                >
                    No Wards available
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

      {/* Add/Edit Ward Modal */}
      <dialog id="add_ward_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => (document.getElementById("add_ward_modal") as HTMLDialogElement)?.close()}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">{editingId ? "Edit Ward" : "Add New Ward"}</h3>

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
                  setSelectedGpu("");
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
                  setSelectedGpu("");
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
                onChange={async (e) => {
                  const tcId = e.target.value;
                  setSelectedTc(tcId);
                  setSelectedGpu("");
                  if (tcId) await fetchGpus(tcId);
                }}
              >
                <option value="">-- Select TC --</option>
                {tcs.map((t) => (
                  <option key={t.id} value={t.id}>{t.tc_no} - {t.tc_name}</option>
                ))}
              </select>
            </div>

            {/* GPU */}
            <div>
              <label className="label"><span className="label-text">GPU</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedGpu}
                onChange={(e) => setSelectedGpu(e.target.value)}
              >
                <option value="">-- Select GPU --</option>
                {gpus.map((g) => (
                  <option key={g.id} value={g.id}>{g.gpu_no} - {g.gpu_name}</option>
                ))}
              </select>
            </div>

            {/* Ward No */}
            <div>
              <label className="label"><span className="label-text">Ward No</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={wardNo}
                onChange={(e) => setWardNo(Number(e.target.value))}
              />
            </div>

            {/* Ward Name */}
            <div>
              <label className="label"><span className="label-text">Ward Name</span></label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-full mt-2">
              <Save size={16} className="mr-2" />
              {editingId ? "Update Ward" : "Save Ward"}
            </button>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p>Are you sure you want to delete this Ward?</p>
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
