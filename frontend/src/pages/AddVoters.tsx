import { Save } from "lucide-react";
import { FiPlus, FiUpload } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function AddVoters() {
  const [voters, setVoters] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState<string>("");
  const [selectedTc, setSelectedTc] = useState<string>("");
  const [selectedGpu, setSelectedGpu] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [constituencies, setConstituencies] = useState<any[]>([]);
  const [tcs, setTcs] = useState<any[]>([]);
  const [gpus, setGpus] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaType, setAreaType] = useState<"Rural" | "Urban">("Rural");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchVoters();
    fetchDistricts();
  }, []);

  const fetchVoters = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voters`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch voters: ${res.statusText}`);
      const data = await res.json();
      console.log(data);
      
      setVoters(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      return data;
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

  const fetchGpus = async (tcId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gpus/by-tc/${tcId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch GPUs");
      const data = await res.json();
      setGpus(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const fetchWards = async (gpuId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wards/by-gpu/${gpuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch Wards");
      const data = await res.json();
      setWards(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("districtId", selectedDistrict);
      formData.append("constituencyId", selectedConstituency);
      formData.append("tcId", selectedTc);
      formData.append("gpuId", selectedGpu);
      formData.append("wardId", selectedWard);
      formData.append("areaType", areaType);
      formData.append("electoral-roll", uploadedFile);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pdf/upload-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload PDF");

      await res.json();
      alert("PDF uploaded successfully!");

      // Refresh voters list
      fetchVoters();

      // Reset form
      setUploadedFile(null);
      setSelectedDistrict("");
      setSelectedConstituency("");
      setSelectedTc("");
      setSelectedGpu("");
      setSelectedWard("");
      setAreaType("Rural");

      // Close modal automatically
      const modal = document.getElementById("add_voter_modal") as HTMLDialogElement;
      modal?.close();
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    }
  };

  // Pagination
  const totalPages = Math.ceil(voters.length / itemsPerPage);
  const paginatedVoters = voters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Table */}
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <h2 className="text-lg font-bold m-4">List of Voters</h2>

        <div className="flex justify-end mt-4">
          <button
            className="btn btn-outline btn-success mr-10 btn-xs hover:text-white transition-colors"
            onClick={() =>
              (document.getElementById("add_voter_modal") as HTMLDialogElement)?.showModal()
            }
          >
            <FiPlus size={14} /> New Voter
          </button>
        </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table-auto w-full text-sm border min-w-max">
          <thead className="bg-base-200 text-xs">
            <tr>
              <th className="px-3 py-2">Epic No</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Relation Type</th>
              <th className="px-3 py-2">Relation Name</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">Gender</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Constituency</th>
              <th className="px-3 py-2">TC</th>
              <th className="px-3 py-2">GPU</th>
              <th className="px-3 py-2">GPU Ward</th>
              <th className="px-3 py-2">Municipality</th>
              <th className="px-3 py-2">Municipality Ward</th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-200 text-xs">
            {paginatedVoters.length > 0 ? (
              paginatedVoters.map((w) => (
                <tr key={w.id} className="hover:bg-base-200/50">
                  <td className="px-3 py-2">{w.epicNo || "—"}</td>
                  <td className="px-3 py-2">{w.name || "—"}</td>
                  <td className="px-3 py-2">{w.relationType || "—"}</td>
                  <td className="px-3 py-2">{w.relationName || "—"}</td>
                  <td className="px-3 py-2">{w.age || "—"}</td>
                  <td className="px-3 py-2">{w.gender || "—"}</td>
                  <td className="px-3 py-2">{w.country || "—"}</td>
                  <td className="px-3 py-2">{w.state || "—"}</td>
                  <td className="px-3 py-2">{w.gpu?.tc?.constituency?.districts?.[0]?.name || "—"}</td>
                  <td className="px-3 py-2">
                    {w.gpu?.tc?.constituency
                      ? `${w.gpu.tc.constituency.constituencyNo} - ${w.gpu.tc.constituency.name}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {w.gpu?.tc
                      ? `${w.gpu.tc.tc_no} - ${w.gpu.tc.tc_name}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {w.gpu
                      ? `${w.gpu.gpu_no} - ${w.gpu.gpu_name}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {w.ward
                      ? `${w.ward.ward_no} - ${w.ward.ward_name}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {w.municipality
                      ? `${w.municipality.municipality_no} - ${w.municipality.municipality_name}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {w.municipalityWard
                      ? `${w.municipalityWard.ward_no} - ${w.municipalityWard.ward_name}`
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15} className="text-center text-gray-500 italic py-4">
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      </div>


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="btn btn-xs"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`btn btn-xs ${currentPage === i + 1 ? "btn-active" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-xs"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Voter Modal */}
      <dialog id="add_voter_modal" className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (document.getElementById("add_voter_modal") as HTMLDialogElement)?.close()
            }
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add New Voter</h3>

          <form className="w-full max-w-md space-y-3" onSubmit={handleSave}>
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
                  setSelectedWard("");
                  setTcs([]);
                  setGpus([]);
                  setWards([]);
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
                  setSelectedWard("");
                  setTcs([]);
                  setGpus([]);
                  setWards([]);
                  if (constituencyId) await fetchTcs(constituencyId);
                }}
              >
                <option value="">-- Select Constituency --</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.id}>{c.constituencyNo} - {c.name}</option>
                ))}
              </select>
            </div>

            {/* Area Type */}
            <div className="flex items-center gap-4 mb-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="areaType"
                  value="Rural"
                  checked={areaType === "Rural"}
                  onChange={() => setAreaType("Rural")}
                  className="radio checked:bg-blue-500 radio-sm"
                /> Rural
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="areaType"
                  value="Urban"
                  checked={areaType === "Urban"}
                  onChange={() => setAreaType("Urban")}
                  className="radio checked:bg-blue-500 radio-sm"
                /> Urban
              </label>
            </div>

            {/* TC / GPU / Ward for Rural */}
            {areaType === "Rural" && (
              <>
                <div>
                  <label className="label"><span className="label-text">TC</span></label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={selectedTc}
                    onChange={async (e) => {
                      const tcId = e.target.value;
                      setSelectedTc(tcId);
                      setSelectedGpu("");
                      setSelectedWard("");
                      setGpus([]);
                      setWards([]);
                      if (tcId) await fetchGpus(tcId);
                    }}
                  >
                    <option value="">-- Select TC --</option>
                    {tcs.map((t) => (
                      <option key={t.id} value={t.id}>{t.tc_no} - {t.tc_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label"><span className="label-text">GPU</span></label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={selectedGpu}
                    onChange={async (e) => {
                      const gpuId = e.target.value;
                      setSelectedGpu(gpuId);
                      setSelectedWard("");
                      setWards([]);
                      if (gpuId) await fetchWards(gpuId);
                    }}
                  >
                    <option value="">-- Select GPU --</option>
                    {gpus.map((g) => (
                      <option key={g.id} value={g.id}>{g.gpu_no} - {g.gpu_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label"><span className="label-text">Ward</span></label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  >
                    <option value="">-- Select Ward --</option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.id}>{w.ward_no} - {w.ward_name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* File Upload */}
            <div>
              <label className="label"><span className="label-text">Upload Voter PDF</span></label>
              <label className="flex items-center gap-2 cursor-pointer border border-base-content/20 rounded-md px-3 py-1 w-70">
                <FiUpload size={16} color="#3b82f6" />
                <span className="text-sm">{uploadedFile ? uploadedFile.name : "Choose File"}</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" />
              </label>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-success text-white btn-sm">
                <Save size={14} /> Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
