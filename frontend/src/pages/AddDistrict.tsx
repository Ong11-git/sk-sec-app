import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";

type District = { id: number; name: string };

export default function AddDistrict() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // form states
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const sortedDistricts = [...districts].sort((a, b) => a.id - b.id);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDistricts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDistricts.length / itemsPerPage);

  // fetch all
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/districts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch districts");
      const data = await res.json();
      setDistricts(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
    (
      document.getElementById("add_district_modal") as HTMLDialogElement
    )?.close();
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!name) {
        setError("District name is required");
        return;
      }

      const url = editingId
        ? `${import.meta.env.VITE_API_BASE_URL}/districts/edit/${editingId}`
        : `${import.meta.env.VITE_API_BASE_URL}/districts/create`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save district");

      setSuccessMsg(data.message || "District saved successfully");
      setError(null);

      resetForm();
      fetchDistricts();

      setTimeout(() => setSuccessMsg(undefined), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/districts/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete district");

      setDistricts((prev) => prev.filter((d) => d.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    }
  };

  const handleEdit = (d: District) => {
    setEditingId(d.id);
    setName(d.name);
    (
      document.getElementById("add_district_modal") as HTMLDialogElement
    )?.showModal();
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <div className="p-4 lg:p-6">
      {/* Districts Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of Districts of Sikkim</h2>
        <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs"
          onClick={() => {
            setEditingId(null);
            setName("");
            (
              document.getElementById(
                "add_district_modal"
              ) as HTMLDialogElement
            )?.showModal();
          }}
        >
          <FiPlus size={14} /> New District
        </button>
      </div>
        <table className="table">
          <thead>
            <tr>
              <th>District Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {currentItems.map((d) => (
              <tr key={d.id} className="hover:bg-base-200/50">
                <td>{d.name}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-xs btn-outline btn-warning"
                    onClick={() => handleEdit(d)}
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                  <button
                    className="btn btn-xs btn-outline btn-error"
                    onClick={() => setDeleteId(d.id)}
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

      {/* New District Button
      <div className="flex justify-end mt-4">
        <button
          className="btn btn-outline btn-success mr-10 btn-xs"
          onClick={() => {
            setEditingId(null);
            setName("");
            (
              document.getElementById(
                "add_district_modal"
              ) as HTMLDialogElement
            )?.showModal();
          }}
        >
          <FiPlus size={14} /> New District
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
      <dialog id="add_district_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (
                document.getElementById(
                  "add_district_modal"
                ) as HTMLDialogElement
              )?.close()
            }
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            {editingId ? "Edit District" : "Add New District"}
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
                <span className="label-text">District Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter district name"
                className="input input-bordered input-success input-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              Are you sure you want to delete this district?
            </p>
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
