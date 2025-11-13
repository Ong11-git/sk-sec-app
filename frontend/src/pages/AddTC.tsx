import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";

type District = { id: number; name: string };
type Constituency = { id: number; name: string; constituencyNo: number };
type TCItem = {
  id: number;
  no: number;
  name: string;
  constituency?: Constituency;
  districts?: District[];
};

export default function TC() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [tc, setTc] = useState<TCItem[]>([]);

  // Form states
  const [tcNo, setTcNo] = useState<number | "">("");
  const [name, setName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedTcs = [...tc].sort((a, b) => a.id - b.id);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTcs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTcs.length / itemsPerPage);

  // Fetch data
  useEffect(() => {
    fetchDistricts();
    fetchTcs();
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

  const fetchTcs = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tcs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch TCs");
      setTc(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      setConstituencies(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setTcNo("");
    setName("");
    setSelectedDistrict("");
    setSelectedConstituency("");
    setEditingId(null);
    setConstituencies([]);
    (document.getElementById("add_tc_modal") as HTMLDialogElement)?.close();
  };

  // Save (create / update)
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!tcNo || !name || !selectedConstituency) {
        setError("Please fill all fields");
        return;
      }

      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/tcs/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/tcs/create`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tc_no: tcNo,
          tc_name: name,
          constituencyId: Number(selectedConstituency),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save TC");

      setSuccessMsg(data.message || "TC saved successfully!");
      setError(null);
      resetForm();
      fetchTcs();
      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tcs/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete TC");
      setTc((prev) => prev.filter((t) => t.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  // Edit
  const handleEdit = (item: TCItem) => {
    setEditingId(item.id);
    setTcNo(item.no);
    setName(item.name);
    if (item.districts && item.districts.length > 0) {
      setSelectedDistrict(String(item.districts[0].id));
      fetchConstituencies(String(item.districts[0].id));
    }
    if (item.constituency) {
      setSelectedConstituency(String(item.constituency.id));
    }
    (document.getElementById("add_tc_modal") as HTMLDialogElement)?.showModal();
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <div className="p-4 lg:p-6">
      {/* TC Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of Territorial Constituencies of Sikkim</h2>
         <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs"
          onClick={() => {
            setEditingId(null);
            setName("");
            setTcNo("");
            setSelectedDistrict("");
            setSelectedConstituency("");
            (document.getElementById("add_tc_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <FiPlus size={14} /> New Territorial Constituency
        </button>
      </div>
        <table className="table">
          <thead>
            <tr>
              <th>District Name</th>
              <th>Constituency Name</th>
              <th>TC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentItems.length > 0 ? (
              currentItems.map((tcItem) => (
                <tr key={tcItem.id} className="hover:bg-base-200/50">
                  <td>
                    {tcItem.districts && tcItem.districts.length > 0
                      ? tcItem.districts.map((d) => d.name).join(", ")
                      : "—"}
                  </td>
                  <td>{tcItem.constituency?.name || "—"}</td>
                  <td>
                    {tcItem.no} - {tcItem.name}
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs btn-outline btn-warning"
                      onClick={() => handleEdit(tcItem)}
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => setDeleteId(tcItem.id)}
                    >
                      <FiTrash size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 italic py-4">
                  No data available
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
              className={`text-green join-item btn btn-sm ${
                currentPage === i + 1 ? "btn-active" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* New TC Button */}
      {/* <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs"
          onClick={() => {
            setEditingId(null);
            setName("");
            setTcNo("");
            setSelectedDistrict("");
            setSelectedConstituency("");
            (document.getElementById("add_tc_modal") as HTMLDialogElement)?.showModal();
          }}
        >
          <FiPlus size={14} /> New Territorial Constituency
        </button>
      </div> */}

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

      {/* Add/Edit TC Modal */}
      <dialog id="add_tc_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (document.getElementById("add_tc_modal") as HTMLDialogElement)?.close()
            }
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            {editingId ? "Edit TC" : "Add New TC"}
          </h3>

          <form
            className="w-full max-w-md space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Select District */}
            <div>
              <label className="label">
                <span className="label-text">District</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedDistrict}
                onChange={async (e) => {
                  const districtId = e.target.value;
                  setSelectedDistrict(districtId);
                  if (districtId) await fetchConstituencies(districtId);
                }}
              >
                <option value="">-- Select District --</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Constituency */}
            <div>
              <label className="label">
                <span className="label-text">Constituency</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
              >
                <option value="">-- Select Constituency --</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.constituencyNo} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TC No */}
            <div>
              <label className="label">
                <span className="label-text">TC No</span>
              </label>
              <input
                type="number"
                placeholder="Enter TC No"
                className="input input-bordered input-success input-sm w-full"
                value={tcNo}
                onChange={(e) => setTcNo(Number(e.target.value))}
              />
            </div>

            {/* TC Name */}
            <div>
              <label className="label">
                <span className="label-text">TC Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter TC name"
                className="input input-bordered input-success input-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-success text-white btn-sm">
                <Save size={14} /> {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-2">Are you sure you want to delete this TC?</p>
            <div className="modal-action">
              <button
                className="btn btn-error btn-outline btn-sm"
                onClick={() => handleDelete(deleteId)}
              >
                Yes, Delete
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
