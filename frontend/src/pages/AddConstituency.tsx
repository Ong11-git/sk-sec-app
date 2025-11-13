import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import Select from "react-select";
import type { StylesConfig } from "react-select";

type District = { id: number; name: string };
type Constituency = {
  id: number;
  name: string;
  constituencyNo: number;
  districts: District[];
};

export default function AddConstituency() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  // Form states
  const [selectedDistricts, setSelectedDistricts] = useState<
    { value: number; label: string }[]
  >([]);
  const [name, setName] = useState("");
  const [constituencyNo, setConstituencyNo] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedConstituencies = [...constituencies].sort(
    (a, b) => a.constituencyNo - b.constituencyNo
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedConstituencies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedConstituencies.length / itemsPerPage);

  // react-select styles
  const selectStyles: StylesConfig<
    { value: number; label: string },
    true
  > = {
    control: (base) => ({
      ...base,
      minHeight: "34px",
      borderColor: "#22c55e",
      boxShadow: "none",
      "&:hover": { borderColor: "#16a34a" },
      fontSize: "0.85rem",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#22c55e",
      color: "white",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": { backgroundColor: "#16a34a", color: "white" },
    }),
  };

  // Fetch districts
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/districts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch districts");
      const data = await res.json();
      setDistricts(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch constituencies
  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/constituencies/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch constituencies");
      const data = await res.json();
      setConstituencies(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const resetForm = () => {
    setName("");
    setConstituencyNo("");
    setSelectedDistricts([]);
    setEditingId(null);
    (
      document.getElementById("add_constituency_modal") as HTMLDialogElement
    )?.close();
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!name || !constituencyNo) {
        setError("Name and Constituency No are required");
        return;
      }

      const districtIds = selectedDistricts.map((d) => d.value);

      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/constituencies/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/constituencies/create-constituency`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, constituencyNo, districtIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save constituency");

      setSuccessMsg(data.message);
      setError(null);

      resetForm();
      fetchConstituencies();

      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/constituencies/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete constituency");

      setConstituencies((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  const handleEdit = (c: Constituency) => {
    setEditingId(c.id);
    setName(c.name);
    setConstituencyNo(c.constituencyNo);
    setSelectedDistricts(
      c.districts.map((d) => ({ value: d.id, label: d.name }))
    );
    (
      document.getElementById("add_constituency_modal") as HTMLDialogElement
    )?.showModal();
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <div className="p-4 lg:p-6">
      {/* Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of Constituency of Sikkim</h2>
            <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs hover:text-white transition-colors"
          onClick={() => {
            setEditingId(null);
            setName("");
            setConstituencyNo("");
            setSelectedDistricts([]);
            (
              document.getElementById(
                "add_constituency_modal"
              ) as HTMLDialogElement
            )?.showModal();
          }}
        >
          <FiPlus size={14} /> New Constituency
        </button>
      </div>
        <table className="table">
          <thead>
            <tr>
              <th>Constituency No</th>
              <th>Constituency Name</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentItems.map((c) => (
              <tr key={c.id} className="hover:bg-base-200/50">
                <td>
                  <span className="badge badge-outline badge-success">
                    {c.constituencyNo}
                  </span>
                </td>
                <td>{c.name}</td>
                <td>
                  {c.districts?.map((d) => d.name).join(" & ") || "-"}
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-xs btn-outline btn-warning"
                    onClick={() => handleEdit(c)}
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                  <button
                    className="btn btn-xs btn-outline btn-error"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <FiTrash size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
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

      {/* New Constituency Button */}
      {/* <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs"
          onClick={() => {
            setEditingId(null);
            setName("");
            setConstituencyNo("");
            setSelectedDistricts([]);
            (
              document.getElementById(
                "add_constituency_modal"
              ) as HTMLDialogElement
            )?.showModal();
          }}
        >
          <FiPlus size={14} /> New Constituency
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

      {/* Add/Edit Modal */}
      <dialog id="add_constituency_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (
                document.getElementById(
                  "add_constituency_modal"
                ) as HTMLDialogElement
              )?.close()
            }
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            {editingId ? "Edit Constituency" : "Add New Constituency"}
          </h3>

          <form
            className="w-full max-w-md space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div>
              <label className="label">
                <span className="label-text">Constituency No</span>
              </label>
              <input
                type="number"
                placeholder="Enter constituency number"
                className="input input-bordered input-success input-sm w-full"
                value={constituencyNo}
                onChange={(e) => setConstituencyNo(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter constituency name"
                className="input input-bordered input-success input-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Districts</span>
              </label>
              <Select
                isMulti
                options={districts.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                value={selectedDistricts}
                onChange={(val) =>
                  setSelectedDistricts(
                    val as { value: number; label: string }[]
                  )
                }
                styles={selectStyles}
                placeholder="Select districts..."
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-success text-white btn-sm"
              >
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
            <p className="py-2">
              Are you sure you want to delete this constituency?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error btn-sm btn-outline"
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
