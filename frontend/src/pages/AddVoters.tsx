import {
  Save,
  Search,
  Home,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  UserPlus,
  Eye,
  Upload,
  X,
  User,
  Camera,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import VoterCardGenerator from "../components/VoterCardGenerator";

export default function AddVoters() {
  const [voters, setVoters] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [constituencies, setConstituencies] = useState<any[]>([]);
  const [tcs, setTcs] = useState<any[]>([]);
  const [gpus, setGpus] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [municipalWards, setMunicipalWards] = useState<any[]>([]);

  // Form states
  const [selectedDistrict, setSelectedDistrict] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedTc, setSelectedTc] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedWard, setSelectedWard] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedMunicipalWard, setSelectedMunicipalWard] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [areaType, setAreaType] = useState<"Rural" | "Urban">("Rural");

  // Voter form fields
  const [epicNo, setEpicNo] = useState("");
  const [stateEpicNo, setStateEpicNo] = useState("");
  const [name, setName] = useState("");
  const [relationType, setRelationType] = useState("");
  const [relationName, setRelationName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [casteCategory, setCasteCategory] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  // Image states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "epicNo" | "name" | "district" | "constituency"
  >("name");

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardGeneratorOpen, setCardGeneratorOpen] = useState(false);
  const [pdfImportModalOpen, setPdfImportModalOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<any>(null);

  // PDF Import states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfImportDistrict, setPdfImportDistrict] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportConstituency, setPdfImportConstituency] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportTc, setPdfImportTc] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportGpu, setPdfImportGpu] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportWard, setPdfImportWard] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportMunicipality, setPdfImportMunicipality] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportMunicipalWard, setPdfImportMunicipalWard] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [pdfImportAreaType, setPdfImportAreaType] = useState<"Rural" | "Urban">(
    "Rural"
  );
  const [pdfImportResult, setPdfImportResult] = useState<any>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVoters();
    fetchDistricts();
    fetchMunicipalities();
  }, []);

  const fetchVoters = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
    }
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voters`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch voters: ${res.statusText}`);
      const data = await res.json();
      setVoters(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      if (!skipLoading) {
        setIsLoading(false);
      }
    }
  };

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

  const fetchMunicipalities = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/municipalities/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch municipalities");
      const data = await res.json();
      setMunicipalities(data);
    } catch (err: any) {
      setError(err.message);
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
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
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
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const fetchGpus = async (tcId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/gpus/by-tc/${tcId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch GPUs");
      const data = await res.json();
      setGpus(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const fetchWards = async (gpuId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/wards/by-gpu/${gpuId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch Wards");
      const data = await res.json();
      setWards(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const fetchMunicipalWards = async (municipalityId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/municipal-wards/by-municipality/${municipalityId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch Municipal Wards");
      const data = await res.json();
      setMunicipalWards(data.wards || data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  // Create voter with photo via backend API (handles Cloudinary upload)
  const createVoterWithPhoto = async (
    voterData: any,
    photoFile: File | null
  ) => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    // Append all voter data fields
    Object.entries(voterData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Append photo if exists
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/voters/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create voter");
    }

    return data.voter;
  };

  // Update voter with photo via backend API
  const updateVoterWithPhoto = async (
    id: number,
    voterData: any,
    photoFile: File | null
  ) => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    // Append all voter data fields
    Object.entries(voterData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Append photo if exists
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/voters/edit/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update voter");
    }

    return data;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setPhotoFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleViewVoter = async (id: number) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/voters/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch voter details");
      const data = await res.json();
      // API returns { voter: {...} } so we need to extract the voter object
      setSelectedVoter(data.voter || data);
      setViewModalOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to load voter details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVoter = async (voter: any) => {
    setSelectedVoter(voter);
    setEpicNo(voter.epicNo || "");
    setStateEpicNo(voter.stateEpicNo || "");
    setName(voter.name || "");
    setRelationType(voter.relationType || "");
    setRelationName(voter.relationName || "");
    setAge(voter.age || "");
    setGender(voter.gender || "");
    setCasteCategory(voter.casteCategory || "");
    setCountry(voter.country || "");
    setState(voter.state || "");

    // Reset all location selections
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setSelectedTc(null);
    setSelectedGpu(null);
    setSelectedWard(null);
    setSelectedMunicipality(null);
    setSelectedMunicipalWard(null);
    setAreaType("Rural");

    // Set district if exists
    if (voter.district) {
      const districtOption = {
        value: voter.district.id,
        label: voter.district.name,
      };
      setSelectedDistrict(districtOption);

      // Fetch constituencies for this district
      const consts = await fetchConstituencies(voter.district.id);

      // Set constituency if exists
      if (voter.constituency) {
        const foundConst = consts.find(
          (c: any) => c.id === voter.constituency.id
        );
        if (foundConst) {
          const constituencyOption = {
            value: foundConst.id,
            label: `${foundConst.constituencyNo} - ${foundConst.name}`,
          };
          setSelectedConstituency(constituencyOption);

          // Fetch TCs for this constituency
          const tcList = await fetchTcs(foundConst.id);

          // Set TC if exists
          if (voter.tc) {
            const foundTc = tcList.find((t: any) => t.id === voter.tc.id);
            if (foundTc) {
              const tcOption = {
                value: foundTc.id,
                label: `${foundTc.tc_no} - ${foundTc.tc_name}`,
              };
              setSelectedTc(tcOption);

              // Fetch GPUs for this TC
              const gpuList = await fetchGpus(foundTc.id);

              // Set GPU if exists
              if (voter.gpu) {
                const foundGpu = gpuList.find(
                  (g: any) => g.id === voter.gpu.id
                );
                if (foundGpu) {
                  const gpuOption = {
                    value: foundGpu.id,
                    label: `${foundGpu.gpu_no} - ${foundGpu.gpu_name}`,
                  };
                  setSelectedGpu(gpuOption);

                  // Fetch Wards for this GPU
                  const wardList = await fetchWards(foundGpu.id);

                  // Set Ward if exists
                  if (voter.ward) {
                    const foundWard = wardList.find(
                      (w: any) => w.id === voter.ward.id
                    );
                    if (foundWard) {
                      const wardOption = {
                        value: foundWard.id,
                        label: `${foundWard.ward_no} - ${foundWard.ward_name}`,
                      };
                      setSelectedWard(wardOption);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check for urban area
    if (voter.municipality || voter.municipalWard) {
      setAreaType("Urban");

      // Fetch all municipalities
      await fetchMunicipalities();

      // Set municipality if exists
      if (voter.municipality) {
        const municipalityOption = {
          value: voter.municipality.id,
          label: `${voter.municipality.municipalityNo} - ${voter.municipality.name}`,
        };
        setSelectedMunicipality(municipalityOption);

        // Fetch municipal wards
        const mWards = await fetchMunicipalWards(voter.municipality.id);

        // Set municipal ward if exists
        if (voter.municipalWard) {
          const foundMWard = mWards.find(
            (mw: any) => mw.id === voter.municipalWard.id
          );
          if (foundMWard) {
            const mWardOption = {
              value: foundMWard.id,
              label: `${foundMWard.ward_no} - ${
                foundMWard.name || foundMWard.ward_name
              }`,
            };
            setSelectedMunicipalWard(mWardOption);
          }
        }
      }
    }

    // Set photo preview for existing voter photo
    if (voter.photo) {
      setPhotoPreview(voter.photo);
    }

    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!name.trim() || !selectedDistrict) {
      setError("Name and District are required");
      return;
    }

    try {
      setIsLoading(true);
      setIsUploadingImage(!!photoFile);

      const voterData = {
        epicNo,
        stateEpicNo,
        name,
        relationType,
        relationName,
        age: age || null,
        gender,
        casteCategory,
        country,
        state,
        districtId: selectedDistrict?.value,
        constituencyId: selectedConstituency?.value,
        tcId: selectedTc?.value,
        gpuId: selectedGpu?.value,
        wardId: selectedWard?.value,
        municipalityId: selectedMunicipality?.value,
        municipalWardId: selectedMunicipalWard?.value,
      };

      const updatedVoter = await updateVoterWithPhoto(
        selectedVoter.id,
        voterData,
        photoFile
      );

      // Update the voter in local state to maintain current order
      setVoters((prevVoters) =>
        prevVoters.map((voter) =>
          voter.id === selectedVoter.id ? updatedVoter.voter : voter
        )
      );

      // Refetch voters to ensure consistency with server state
      await fetchVoters();

      setSuccessMsg("Voter updated successfully!");
      setTimeout(() => setSuccessMsg(undefined), 3000);
      setEditModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsUploadingImage(false);
    }
  };

  const handleDeleteVoter = async (id: number) => {
    console.log("Starting delete for ID:", id, typeof id);
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/voters/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      console.log("Delete API response:", res.status, data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete voter");
      }

      // Reset to first page to avoid empty page after delete
      setCurrentPage(1);

      // Remove the deleted voter from local state immediately
      setVoters((prevVoters) => {
        const filtered = prevVoters.filter(
          (voter) => Number(voter.id) !== Number(id)
        );
        console.log(
          "Before delete:",
          prevVoters.length,
          "After delete:",
          filtered.length,
          "Deleted ID:",
          id,
          "Type:",
          typeof id
        );
        return filtered;
      });

      // Revalidate by refetching in the background without loading indicator
      fetchVoters(true);

      setSuccessMsg("Voter deleted successfully!");
      setTimeout(() => setSuccessMsg(undefined), 3000);
      setDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVoter = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { field: epicNo, name: "EPIC Number" },
      { field: name.trim(), name: "Name" },
      { field: selectedDistrict, name: "District" },
      { field: relationType, name: "Relation Type" },
      { field: relationName, name: "Relation Name" },
      { field: age !== "", name: "Age" },
      { field: gender, name: "Gender" },
      { field: casteCategory, name: "Caste Category" },
      { field: country, name: "Country" },
      { field: state, name: "State" },
    ];

    const missingFields = requiredFields
      .filter((f) => !f.field)
      .map((f) => f.name);
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setIsLoading(true);
      setIsUploadingImage(!!photoFile);

      const voterData = {
        epicNo,
        stateEpicNo,
        name,
        relationType,
        relationName,
        age: age || null,
        gender,
        casteCategory,
        country,
        state,
        districtId: selectedDistrict?.value,
        constituencyId: selectedConstituency?.value,
        tcId: selectedTc?.value,
        gpuId: selectedGpu?.value,
        wardId: selectedWard?.value,
        municipalityId: selectedMunicipality?.value,
        municipalWardId: selectedMunicipalWard?.value,
      };

      const newVoter = await createVoterWithPhoto(voterData, photoFile);

      // Add the new voter to the beginning of the list to maintain current order
      setVoters((prevVoters) => [newVoter, ...prevVoters]);

      setSuccessMsg("Voter created successfully!");
      setTimeout(() => setSuccessMsg(undefined), 3000);
      (
        document.getElementById("create_voter_modal") as HTMLDialogElement
      )?.close();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to create voter. Please try again.");
    } finally {
      setIsLoading(false);
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setEpicNo("");
    setStateEpicNo("");
    setName("");
    setRelationType("");
    setRelationName("");
    setAge("");
    setGender("");
    setCasteCategory("");
    setCountry("");
    setState("");
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setSelectedTc(null);
    setSelectedGpu(null);
    setSelectedWard(null);
    setSelectedMunicipality(null);
    setSelectedMunicipalWard(null);
    setAreaType("Rural");
    setPhotoFile(null);
    setPhotoPreview(null);
    setError(null);
  };

  // PDF Import handlers
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("PDF size should be less than 10MB");
      return;
    }

    setPdfFile(file);
    setPdfImportResult(null);
    setError(null);
  };

  const resetPdfImport = () => {
    setPdfFile(null);
    setPdfImportDistrict(null);
    setPdfImportConstituency(null);
    setPdfImportTc(null);
    setPdfImportGpu(null);
    setPdfImportWard(null);
    setPdfImportMunicipality(null);
    setPdfImportMunicipalWard(null);
    setPdfImportAreaType("Rural");
    setPdfImportResult(null);
    if (pdfFileInputRef.current) {
      pdfFileInputRef.current.value = "";
    }
  };

  const handlePdfImport = async () => {
    if (!pdfFile) {
      setError("Please select a PDF file");
      return;
    }

    if (!pdfImportDistrict || !pdfImportConstituency) {
      setError("District and Constituency are required");
      return;
    }

    // Validate based on area type
    if (pdfImportAreaType === "Rural") {
      if (!pdfImportTc || !pdfImportGpu || !pdfImportWard) {
        setError("TC, GPU, and Ward are required for Rural areas");
        return;
      }
    } else {
      if (!pdfImportMunicipality || !pdfImportMunicipalWard) {
        setError(
          "Municipality and Municipal Ward are required for Urban areas"
        );
        return;
      }
    }

    try {
      setIsPdfUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("electoral-roll", pdfFile);
      formData.append("districtId", pdfImportDistrict.value.toString());
      formData.append("constituencyId", pdfImportConstituency.value.toString());

      if (pdfImportAreaType === "Rural") {
        formData.append("tcId", pdfImportTc!.value.toString());
        formData.append("gpuId", pdfImportGpu!.value.toString());
        formData.append("wardId", pdfImportWard!.value.toString());
      } else {
        formData.append(
          "municipalityId",
          pdfImportMunicipality!.value.toString()
        );
        formData.append(
          "municipalWardId",
          pdfImportMunicipalWard!.value.toString()
        );
      }

      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pdf/upload-pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import PDF");
      }

      setPdfImportResult(data);
      setSuccessMsg(`Successfully imported ${data.insertedCount} voters!`);
      setTimeout(() => setSuccessMsg(undefined), 5000);
      fetchVoters();
    } catch (err: any) {
      setError(err.message || "Failed to import PDF");
    } finally {
      setIsPdfUploading(false);
    }
  };

  // Filter voters based on search
  const filteredVoters = voters.filter((voter) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    if (searchType === "epicNo") {
      return voter.epicNo?.toLowerCase().includes(query);
    } else if (searchType === "name") {
      return voter.name?.toLowerCase().includes(query);
    } else if (searchType === "district") {
      const districtName = voter.district?.name || "";
      return districtName.toLowerCase().includes(query);
    } else if (searchType === "constituency") {
      const constituencyName = voter.constituency?.name || "";
      return constituencyName.toLowerCase().includes(query);
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVoters.length / itemsPerPage);
  const paginatedVoters = filteredVoters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Select styles
  const selectStyles: StylesConfig<any, false> = {
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
    }),
  };

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
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  // Gender options
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  // Caste category options
  const casteOptions = [
    { value: "OBC-State", label: "OBC-State" },
    { value: "OBC-Central", label: "OBC-Central" },
    { value: "BL", label: "BL" },
    { value: "ST", label: "ST" },
    { value: "SC", label: "SC" },
  ];

  // Relation type options
  const relationOptions = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Husband", label: "Husband" },
    { value: "Wife", label: "Wife" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Guardian", label: "Guardian" },
  ];

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
                <Home className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Voter Management System
                </h1>
                <p className="text-gray-600 text-xs mt-1">
                  State Election Commission, Sikkim
                </p>
              </div>
            </div>
            <p className="text-gray-600 ml-11 hidden md:block text-sm">
              Manage voter records with complete CRUD operations and photo
              upload
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none"
            >
              <button
                className="btn btn-sm md:btn-md bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 shadow-sm hover:shadow transition-all duration-200 font-medium px-4 w-full"
                onClick={() =>
                  (
                    document.getElementById(
                      "create_voter_modal"
                    ) as HTMLDialogElement
                  )?.showModal()
                }
              >
                <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                Add New Voter
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none"
            >
              <button
                className="btn btn-sm md:btn-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white border-0 shadow-sm hover:shadow transition-all duration-200 font-medium px-4 w-full"
                onClick={() => setPdfImportModalOpen(true)}
              >
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                Import from PDF
              </button>
            </motion.div>
          </div>
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
                        {searchType === "epicNo"
                          ? "EPIC No"
                          : searchType === "name"
                          ? "Name"
                          : searchType === "district"
                          ? "District"
                          : "Constituency"}
                      </span>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10"
                    >
                      <li>
                        <button
                          className={`text-xs ${
                            searchType === "epicNo" ? "active" : ""
                          }`}
                          onClick={() => setSearchType("epicNo")}
                        >
                          Search by EPIC No
                        </button>
                      </li>
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
                <span className="font-semibold ml-0.5">{voters.length}</span>
              </div>
              <div className="badge badge-outline border-green-500 text-green-600 text-xs px-2.5 py-1.5">
                Showing:{" "}
                <span className="font-semibold ml-0.5">
                  {filteredVoters.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voters Table Card */}
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
                Voter Records
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredVoters.length} voter
                {filteredVoters.length !== 1 ? "s" : ""} found
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
                    EPIC No
                  </div>
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Voter Photo
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Relation
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider hidden md:table-cell">
                  Age/Gender
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider hidden xl:table-cell">
                  Caste/Location
                </th>
                <th className="text-gray-700 font-semibold py-3 px-4 text-xs uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-transparent"
                  >
                    <td colSpan={7} className="text-center py-12">
                      <Loader2 className="w-8 h-8 text-[#061E47] animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Loading voters...</p>
                    </td>
                  </motion.tr>
                ) : paginatedVoters.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-transparent"
                  >
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      {searchQuery ? (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center gap-4"
                        >
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Search className="w-10 h-10 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No matching voters found
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              No voters match "{searchQuery}"
                            </p>
                            <button
                              className="btn btn-xs btn-outline px-3 py-1.5"
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
                          className="flex flex-col items-center gap-4"
                        >
                          <div className="p-3 bg-gray-100 rounded-full">
                            <User className="w-10 h-10 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              No voters yet
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              Start by adding your first voter
                            </p>
                            <button
                              className="btn btn-xs bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white px-3 py-1.5"
                              onClick={() =>
                                (
                                  document.getElementById(
                                    "create_voter_modal"
                                  ) as HTMLDialogElement
                                )?.showModal()
                              }
                            >
                              <UserPlus className="w-3 h-3 mr-1" />
                              Add First Voter
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </td>
                  </motion.tr>
                ) : (
                  paginatedVoters.map((voter, index) => (
                    <motion.tr
                      key={voter.id}
                      variants={itemVariants}
                      initial="visible"
                      animate="visible"
                      custom={index}
                      whileHover={{
                        backgroundColor: "rgba(6, 30, 71, 0.02)",
                      }}
                      className="border-b border-gray-100 last:border-b-0 group"
                    >
                      {/* EPIC No */}
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#061E47] to-[#0A2B6B] mr-2"
                          />
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">
                              {voter.epicNo || "—"}
                            </div>
                            {voter.stateEpicNo && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                State: {voter.stateEpicNo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Voter Photo */}
                      <td className="py-3 px-4">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100">
                            {voter.photo ? (
                              <img
                                src={voter.photo}
                                alt={voter.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    voter.name
                                  )}&background=061E47&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800 text-sm">
                          {voter.name || "—"}
                        </div>
                      </td>

                      {/* Relation */}
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {voter.relationType || voter.relationName ? (
                          <div>
                            <div className="text-sm text-gray-700">
                              {voter.relationType || "—"}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {voter.relationName || "—"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Age/Gender */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        {voter.age || voter.gender ? (
                          <div>
                            <div className="text-sm text-gray-700">
                              {voter.age ? `${voter.age} yrs` : "—"}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {voter.gender || "—"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Caste/Location */}
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <div>
                          <div className="text-sm text-gray-700">
                            {voter.casteCategory || "—"}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {voter.district?.name || "—"}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-1.5">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-xs btn-outline border-blue-500 text-blue-600 hover:bg-blue-50 px-2"
                            onClick={() => handleViewVoter(voter.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-xs btn-outline border-green-500 text-green-600 hover:bg-green-50 px-2"
                            onClick={() => handleEditVoter(voter)}
                          >
                            <Edit className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-xs btn-outline border-red-500 text-red-600 hover:bg-red-50 px-2"
                            onClick={() => {
                              setSelectedVoter(voter);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-xs btn-outline border-purple-500 text-purple-600 hover:bg-purple-50 px-2"
                            onClick={() => {
                              setSelectedVoter(voter);
                              setCardGeneratorOpen(true);
                            }}
                            title="Generate Voter Card"
                          >
                            <CreditCard className="w-3 h-3" />
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
                <span className="font-semibold">
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredVoters.length
                  )}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, filteredVoters.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredVoters.length}</span>{" "}
                voters
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  className={`btn btn-xs btn-outline rounded ${
                    currentPage === 1 ? "btn-disabled opacity-50" : ""
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
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
                        onClick={() => handlePageChange(pageNumber)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Create Voter Modal */}
      <dialog id="create_voter_modal" className="modal">
        <div className="modal-box max-w-6xl p-0 overflow-hidden bg-white shadow-xl">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded">
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Add New Voter
                  </h3>
                  <p className="text-white/80 text-xs">
                    Enter all required voter details with photo upload
                  </p>
                </div>
              </div>
              <button
                className="btn btn-xs btn-circle btn-ghost text-white hover:bg-white/20"
                onClick={() => {
                  (
                    document.getElementById(
                      "create_voter_modal"
                    ) as HTMLDialogElement
                  )?.close();
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleCreateVoter} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Column 1: Photo Upload & EPIC Numbers */}
                <div className="space-y-4">
                  {/* Professional Photo Upload Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Voter Photo
                      </h4>
                      <Camera className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      {/* Photo Preview Container */}
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-3 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                  <Camera className="w-8 h-8" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#061E47] rounded-full flex items-center justify-center">
                                  <Upload className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              <span className="text-xs mt-2 text-center">
                                Upload Photo
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        {photoPreview && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        )}

                        {/* Upload Progress Overlay */}
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                              <p className="text-xs text-white mt-2">
                                Uploading...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="text-center w-full">
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          id="photo-upload"
                          disabled={isUploadingImage}
                        />
                        <label
                          htmlFor="photo-upload"
                          className={`btn btn-sm w-full max-w-xs ${
                            isUploadingImage
                              ? "btn-disabled"
                              : "btn-outline border-[#061E47] text-[#061E47] hover:bg-[#061E47] hover:text-white"
                          } transition-all duration-200 cursor-pointer`}
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 mr-1.5" />
                              Choose Photo
                            </>
                          )}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG up to 5MB • Optional
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EPIC Numbers Card */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        EPIC Numbers
                      </h4>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            EPIC Number{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter EPIC number"
                          className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                          value={epicNo}
                          onChange={(e) => setEpicNo(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            State EPIC Number
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter state EPIC number"
                          className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                          value={stateEpicNo}
                          onChange={(e) => setStateEpicNo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Personal Information */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Personal Information
                      </h4>
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {/* Name */}
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            Full Name{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Relation */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Relation Type{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <Select
                            options={relationOptions}
                            value={relationOptions.find(
                              (r) => r.value === relationType
                            )}
                            onChange={(option) =>
                              setRelationType(option?.value || "")
                            }
                            styles={selectStyles}
                            placeholder="Select relation"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Relation Name{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Name of relation"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={relationName}
                            onChange={(e) => setRelationName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Age & Gender */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Age <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="number"
                            placeholder="Age in years"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={age}
                            onChange={(e) =>
                              setAge(
                                e.target.value ? parseInt(e.target.value) : ""
                              )
                            }
                            min="18"
                            max="120"
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Gender{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <Select
                            options={genderOptions}
                            value={genderOptions.find(
                              (g) => g.value === gender
                            )}
                            onChange={(option) =>
                              setGender(option?.value || "")
                            }
                            styles={selectStyles}
                            placeholder="Select gender"
                            required
                          />
                        </div>
                      </div>

                      {/* Caste Category */}
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            Caste Category{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </span>
                        </label>
                        <Select
                          options={casteOptions}
                          value={casteOptions.find(
                            (c) => c.value === casteCategory
                          )}
                          onChange={(option) =>
                            setCasteCategory(option?.value || "")
                          }
                          styles={selectStyles}
                          placeholder="Select caste category"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Location Information */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Location Information
                      </h4>
                      <Home className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      {/* Country & State */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Country{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., India"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              State{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Sikkim"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* District */}
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            District{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </span>
                        </label>
                        <Select
                          options={districts.map((d) => ({
                            value: d.id,
                            label: d.name,
                          }))}
                          value={selectedDistrict}
                          onChange={async (option) => {
                            setSelectedDistrict(option);
                            setSelectedConstituency(null);
                            setSelectedTc(null);
                            setSelectedGpu(null);
                            setSelectedWard(null);
                            setConstituencies([]);
                            setTcs([]);
                            setGpus([]);
                            setWards([]);
                            if (option) await fetchConstituencies(option.value);
                          }}
                          styles={selectStyles}
                          placeholder="Select district"
                          required
                        />
                      </div>

                      {/* Area Type Toggle */}
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            Area Type
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAreaType("Rural");
                              setSelectedMunicipality(null);
                              setSelectedMunicipalWard(null);
                            }}
                            className={`flex-1 btn btn-sm ${
                              areaType === "Rural"
                                ? "bg-[#061E47] text-white"
                                : "btn-outline"
                            } transition-all duration-200`}
                          >
                            Rural
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAreaType("Urban");
                              setSelectedTc(null);
                              setSelectedGpu(null);
                              setSelectedWard(null);
                            }}
                            className={`flex-1 btn btn-sm ${
                              areaType === "Urban"
                                ? "bg-[#061E47] text-white"
                                : "btn-outline"
                            } transition-all duration-200`}
                          >
                            Urban
                          </button>
                        </div>
                      </div>

                      {/* Constituency */}
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-medium text-gray-700 text-sm">
                            Constituency
                          </span>
                        </label>
                        <Select
                          options={constituencies.map((c) => ({
                            value: c.id,
                            label: `${c.constituencyNo} - ${c.name}`,
                          }))}
                          value={selectedConstituency}
                          onChange={async (option) => {
                            setSelectedConstituency(option);
                            setSelectedTc(null);
                            setSelectedGpu(null);
                            setSelectedWard(null);
                            setTcs([]);
                            setGpus([]);
                            setWards([]);
                            if (option) await fetchTcs(option.value);
                          }}
                          styles={selectStyles}
                          placeholder="Select constituency"
                        />
                      </div>

                      {/* Rural Hierarchy */}
                      {areaType === "Rural" && (
                        <div className="space-y-3">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                TC
                              </span>
                            </label>
                            <Select
                              options={tcs.map((t) => ({
                                value: t.id,
                                label: `${t.tc_no} - ${t.tc_name}`,
                              }))}
                              value={selectedTc}
                              onChange={async (option) => {
                                setSelectedTc(option);
                                setSelectedGpu(null);
                                setSelectedWard(null);
                                setGpus([]);
                                setWards([]);
                                if (option) await fetchGpus(option.value);
                              }}
                              styles={selectStyles}
                              placeholder="Select TC"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                GPU
                              </span>
                            </label>
                            <Select
                              options={gpus.map((g) => ({
                                value: g.id,
                                label: `${g.gpu_no} - ${g.gpu_name}`,
                              }))}
                              value={selectedGpu}
                              onChange={async (option) => {
                                setSelectedGpu(option);
                                setSelectedWard(null);
                                setWards([]);
                                if (option) await fetchWards(option.value);
                              }}
                              styles={selectStyles}
                              placeholder="Select GPU"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Ward
                              </span>
                            </label>
                            <Select
                              options={wards.map((w) => ({
                                value: w.id,
                                label: `${w.ward_no} - ${w.ward_name}`,
                              }))}
                              value={selectedWard}
                              onChange={setSelectedWard}
                              styles={selectStyles}
                              placeholder="Select Ward"
                            />
                          </div>
                        </div>
                      )}

                      {/* Urban Hierarchy */}
                      {areaType === "Urban" && (
                        <div className="space-y-3">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Municipality
                              </span>
                            </label>
                            <Select
                              options={municipalities.map((m) => ({
                                value: m.id,
                                label: `${m.municipalityNo} - ${m.name}`,
                              }))}
                              value={selectedMunicipality}
                              onChange={async (option) => {
                                setSelectedMunicipality(option);
                                setSelectedMunicipalWard(null);
                                setMunicipalWards([]);
                                if (option)
                                  await fetchMunicipalWards(option.value);
                              }}
                              styles={selectStyles}
                              placeholder="Select Municipality"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Municipal Ward
                              </span>
                            </label>
                            <Select
                              options={municipalWards.map((mw) => ({
                                value: mw.id,
                                label: `${mw.ward_no} - ${
                                  mw.ward_name || mw.name
                                }`,
                              }))}
                              value={selectedMunicipalWard}
                              onChange={setSelectedMunicipalWard}
                              styles={selectStyles}
                              placeholder="Select Municipal Ward"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-800 mb-1">
                      Important Note
                    </p>
                    <p className="text-xs text-blue-700">
                      Fields marked with{" "}
                      <span className="text-red-500 font-bold">*</span> are
                      required. Please ensure all required fields are filled
                      correctly to avoid submission errors.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-error bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 py-3 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="modal-action flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  className="btn btn-sm btn-outline flex-1 order-2 sm:order-1 rounded-xl font-medium text-xs hover:bg-gray-50 transition-all duration-200"
                  onClick={() => {
                    (
                      document.getElementById(
                        "create_voter_modal"
                      ) as HTMLDialogElement
                    )?.close();
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 shadow-md hover:shadow-lg flex-1 order-1 sm:order-2 rounded-xl font-medium text-xs transition-all duration-200"
                  disabled={isLoading || isUploadingImage}
                >
                  {isLoading || isUploadingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      {isUploadingImage
                        ? "Uploading Image..."
                        : "Creating Voter..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      Create Voter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit Voter Modal */}
      {editModalOpen && selectedVoter && (
        <div className="modal modal-open">
          <div
            className="modal-backdrop"
            onClick={() => {
              setEditModalOpen(false);
              resetForm();
            }}
          />
          <div className="modal-box max-w-6xl p-0 overflow-hidden bg-white shadow-xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Edit className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Edit Voter Details
                    </h3>
                    <p className="text-white/80 text-xs">
                      Update voter information - EPIC: {selectedVoter.epicNo}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-xs btn-circle btn-ghost text-white hover:bg-white/20"
                  onClick={() => {
                    setEditModalOpen(false);
                    resetForm();
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Column 1: Photo Upload & EPIC Numbers */}
                  <div className="space-y-4">
                    {/* Professional Photo Upload Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Voter Photo
                        </h4>
                        <Camera className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-col items-center space-y-4">
                        {/* Photo Preview Container */}
                        <div className="relative group">
                          <div className="w-40 h-40 rounded-full border-3 border-dashed border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                            {photoPreview ? (
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <Camera className="w-8 h-8" />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#061E47] rounded-full flex items-center justify-center">
                                    <Upload className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                <span className="text-xs mt-2 text-center">
                                  Upload Photo
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          {photoPreview && (
                            <motion.button
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          )}

                          {/* Upload Progress Overlay */}
                          {isUploadingImage && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <div className="text-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                                <p className="text-xs text-white mt-2">
                                  Uploading...
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="text-center w-full">
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            id="photo-upload-edit"
                            disabled={isUploadingImage}
                          />
                          <label
                            htmlFor="photo-upload-edit"
                            className={`btn btn-sm w-full max-w-xs ${
                              isUploadingImage
                                ? "btn-disabled"
                                : "btn-outline border-[#061E47] text-[#061E47] hover:bg-[#061E47] hover:text-white"
                            } transition-all duration-200 cursor-pointer`}
                          >
                            {isUploadingImage ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 mr-1.5" />
                                Change Photo
                              </>
                            )}
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG up to 5MB • Optional
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* EPIC Numbers Card */}
                    <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          EPIC Numbers
                        </h4>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              EPIC Number{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter EPIC number"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={epicNo}
                            onChange={(e) => setEpicNo(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              State EPIC Number
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter state EPIC number"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={stateEpicNo}
                            onChange={(e) => setStateEpicNo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Personal Information */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Personal Information
                        </h4>
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        {/* Name */}
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Full Name{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter full name"
                            className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Relation */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Relation Type{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <Select
                              options={relationOptions}
                              value={relationOptions.find(
                                (r) => r.value === relationType
                              )}
                              onChange={(option) =>
                                setRelationType(option?.value || "")
                              }
                              styles={selectStyles}
                              placeholder="Select relation"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Relation Name{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder="Name of relation"
                              className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                              value={relationName}
                              onChange={(e) => setRelationName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Age{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <input
                              type="number"
                              placeholder="Age in years"
                              className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                              value={age}
                              onChange={(e) =>
                                setAge(
                                  e.target.value ? parseInt(e.target.value) : ""
                                )
                              }
                              min="18"
                              max="120"
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Gender{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <Select
                              options={genderOptions}
                              value={genderOptions.find(
                                (g) => g.value === gender
                              )}
                              onChange={(option) =>
                                setGender(option?.value || "")
                              }
                              styles={selectStyles}
                              placeholder="Select gender"
                              required
                            />
                          </div>
                        </div>

                        {/* Caste Category */}
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Caste Category{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <Select
                            options={casteOptions}
                            value={casteOptions.find(
                              (c) => c.value === casteCategory
                            )}
                            onChange={(option) =>
                              setCasteCategory(option?.value || "")
                            }
                            styles={selectStyles}
                            placeholder="Select caste category"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Location Information */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Location Information
                        </h4>
                        <Home className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        {/* Country & State */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                Country{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., India"
                              className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text font-medium text-gray-700 text-sm">
                                State{" "}
                                <span className="text-red-500 ml-0.5">*</span>
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Sikkim"
                              className="input input-bordered w-full focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 rounded-lg h-10 text-sm"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* District */}
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              District{" "}
                              <span className="text-red-500 ml-0.5">*</span>
                            </span>
                          </label>
                          <Select
                            options={districts.map((d) => ({
                              value: d.id,
                              label: d.name,
                            }))}
                            value={selectedDistrict}
                            onChange={async (option) => {
                              setSelectedDistrict(option);
                              setSelectedConstituency(null);
                              setSelectedTc(null);
                              setSelectedGpu(null);
                              setSelectedWard(null);
                              setConstituencies([]);
                              setTcs([]);
                              setGpus([]);
                              setWards([]);
                              if (option)
                                await fetchConstituencies(option.value);
                            }}
                            styles={selectStyles}
                            placeholder="Select district"
                            required
                          />
                        </div>

                        {/* Area Type Toggle */}
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Area Type
                            </span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAreaType("Rural");
                                setSelectedMunicipality(null);
                                setSelectedMunicipalWard(null);
                              }}
                              className={`flex-1 btn btn-sm ${
                                areaType === "Rural"
                                  ? "bg-[#061E47] text-white"
                                  : "btn-outline"
                              } transition-all duration-200`}
                            >
                              Rural
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAreaType("Urban");
                                setSelectedTc(null);
                                setSelectedGpu(null);
                                setSelectedWard(null);
                              }}
                              className={`flex-1 btn btn-sm ${
                                areaType === "Urban"
                                  ? "bg-[#061E47] text-white"
                                  : "btn-outline"
                              } transition-all duration-200`}
                            >
                              Urban
                            </button>
                          </div>
                        </div>

                        {/* Constituency */}
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text font-medium text-gray-700 text-sm">
                              Constituency
                            </span>
                          </label>
                          <Select
                            options={constituencies.map((c) => ({
                              value: c.id,
                              label: `${c.constituencyNo} - ${c.name}`,
                            }))}
                            value={selectedConstituency}
                            onChange={async (option) => {
                              setSelectedConstituency(option);
                              setSelectedTc(null);
                              setSelectedGpu(null);
                              setSelectedWard(null);
                              setTcs([]);
                              setGpus([]);
                              setWards([]);
                              if (option) await fetchTcs(option.value);
                            }}
                            styles={selectStyles}
                            placeholder="Select constituency"
                          />
                        </div>

                        {/* Rural Hierarchy */}
                        {areaType === "Rural" && (
                          <div className="space-y-3">
                            <div className="form-control">
                              <label className="label py-1">
                                <span className="label-text font-medium text-gray-700 text-sm">
                                  TC
                                </span>
                              </label>
                              <Select
                                options={tcs.map((t) => ({
                                  value: t.id,
                                  label: `${t.tc_no} - ${t.tc_name}`,
                                }))}
                                value={selectedTc}
                                onChange={async (option) => {
                                  setSelectedTc(option);
                                  setSelectedGpu(null);
                                  setSelectedWard(null);
                                  setGpus([]);
                                  setWards([]);
                                  if (option) await fetchGpus(option.value);
                                }}
                                styles={selectStyles}
                                placeholder="Select TC"
                              />
                            </div>

                            <div className="form-control">
                              <label className="label py-1">
                                <span className="label-text font-medium text-gray-700 text-sm">
                                  GPU
                                </span>
                              </label>
                              <Select
                                options={gpus.map((g) => ({
                                  value: g.id,
                                  label: `${g.gpu_no} - ${g.gpu_name}`,
                                }))}
                                value={selectedGpu}
                                onChange={async (option) => {
                                  setSelectedGpu(option);
                                  setSelectedWard(null);
                                  setWards([]);
                                  if (option) await fetchWards(option.value);
                                }}
                                styles={selectStyles}
                                placeholder="Select GPU"
                              />
                            </div>

                            <div className="form-control">
                              <label className="label py-1">
                                <span className="label-text font-medium text-gray-700 text-sm">
                                  Ward
                                </span>
                              </label>
                              <Select
                                options={wards.map((w) => ({
                                  value: w.id,
                                  label: `${w.ward_no} - ${w.ward_name}`,
                                }))}
                                value={selectedWard}
                                onChange={setSelectedWard}
                                styles={selectStyles}
                                placeholder="Select Ward"
                              />
                            </div>
                          </div>
                        )}

                        {/* Urban Hierarchy */}
                        {areaType === "Urban" && (
                          <div className="space-y-3">
                            <div className="form-control">
                              <label className="label py-1">
                                <span className="label-text font-medium text-gray-700 text-sm">
                                  Municipality
                                </span>
                              </label>
                              <Select
                                options={municipalities.map((m) => ({
                                  value: m.id,
                                  label: `${m.municipalityNo} - ${m.name}`,
                                }))}
                                value={selectedMunicipality}
                                onChange={async (option) => {
                                  setSelectedMunicipality(option);
                                  setSelectedMunicipalWard(null);
                                  setMunicipalWards([]);
                                  if (option)
                                    await fetchMunicipalWards(option.value);
                                }}
                                styles={selectStyles}
                                placeholder="Select Municipality"
                              />
                            </div>

                            <div className="form-control">
                              <label className="label py-1">
                                <span className="label-text font-medium text-gray-700 text-sm">
                                  Municipal Ward
                                </span>
                              </label>
                              <Select
                                options={municipalWards.map((mw) => ({
                                  value: mw.id,
                                  label: `${mw.ward_no} - ${
                                    mw.ward_name || mw.name
                                  }`,
                                }))}
                                value={selectedMunicipalWard}
                                onChange={setSelectedMunicipalWard}
                                styles={selectStyles}
                                placeholder="Select Municipal Ward"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 py-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <div className="modal-action flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline flex-1 order-2 sm:order-1 rounded-xl font-medium text-xs hover:bg-gray-50 transition-all duration-200"
                    onClick={() => {
                      setEditModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm bg-gradient-to-r from-[#061E47] to-[#0A2B6B] hover:from-[#0A2B6B] hover:to-[#061E47] text-white border-0 shadow-md hover:shadow-lg flex-1 order-1 sm:order-2 rounded-xl font-medium text-xs transition-all duration-200"
                    onClick={handleSaveEdit}
                    disabled={isLoading || isUploadingImage}
                  >
                    {isLoading || isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        {isUploadingImage
                          ? "Uploading Image..."
                          : "Updating Voter..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        Update Voter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Voter Modal - Professional Design */}
      {viewModalOpen && selectedVoter && (
        <div className="modal modal-open">
          <div
            className="modal-backdrop"
            onClick={() => setViewModalOpen(false)}
          />
          <div className="modal-box max-w-6xl p-0 overflow-hidden bg-white shadow-xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Voter Details
                    </h3>
                    <p className="text-white/80 text-xs">
                      Complete voter information - EPIC:{" "}
                      {selectedVoter.epicNo || "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-xs btn-circle btn-ghost text-white hover:bg-white/20"
                  onClick={() => setViewModalOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Column 1: Photo & Basic Info */}
                  <div className="space-y-4">
                    {/* Photo Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Voter Photo
                        </h4>
                        <Camera className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full border-3 border-gray-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner mb-3">
                          {selectedVoter.photo ? (
                            <img
                              src={selectedVoter.photo}
                              alt={selectedVoter.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (
                                  e.target as HTMLImageElement
                                ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  selectedVoter.name
                                )}&background=061E47&color=fff&size=192`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <User className="w-20 h-20 mb-2" />
                              <span className="text-sm">
                                No photo available
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 text-lg">
                            {selectedVoter.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            EPIC: {selectedVoter.epicNo || "N/A"}
                          </p>
                          {selectedVoter.stateEpicNo && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              State EPIC: {selectedVoter.stateEpicNo}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Timestamps Card */}
                    <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-100 shadow-sm">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">
                        Status & Timestamps
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <span className="text-xs text-gray-600">Status:</span>
                          <span
                            className={`badge badge-sm ${
                              selectedVoter.status === "active"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {selectedVoter.status || "active"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <span className="text-xs text-gray-600">
                            Created:
                          </span>
                          <span className="text-sm font-medium text-gray-800 text-right">
                            {selectedVoter.createdAt
                              ? new Date(
                                  selectedVoter.createdAt
                                ).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <span className="text-xs text-gray-600">
                            Last Updated:
                          </span>
                          <span className="text-sm font-medium text-gray-800 text-right">
                            {selectedVoter.updatedAt
                              ? new Date(
                                  selectedVoter.updatedAt
                                ).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <span className="text-xs text-gray-600">
                            Voter ID:
                          </span>
                          <span className="font-mono text-xs text-gray-800">
                            {selectedVoter.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Personal Information */}
                  <div className="space-y-4">
                    {/* Personal Info Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm h-full">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Personal Information
                        </h4>
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">
                              Full Name
                            </p>
                            <p className="font-semibold text-gray-800">
                              {selectedVoter.name || "—"}
                            </p>
                          </div>
                          <div className="bg-gray-50/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Age</p>
                            <p className="font-semibold text-gray-800">
                              {selectedVoter.age
                                ? `${selectedVoter.age} years`
                                : "—"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Gender</p>
                            <p className="font-semibold text-gray-800">
                              {selectedVoter.gender ? (
                                <span
                                  className={`badge badge-sm ${
                                    selectedVoter.gender === "Male"
                                      ? "badge-info"
                                      : selectedVoter.gender === "Female"
                                      ? "badge-secondary"
                                      : "badge-accent"
                                  }`}
                                >
                                  {selectedVoter.gender}
                                </span>
                              ) : (
                                "—"
                              )}
                            </p>
                          </div>
                          <div className="bg-gray-50/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">
                              Caste Category
                            </p>
                            <p className="font-semibold text-gray-800">
                              {selectedVoter.casteCategory ? (
                                <span className="badge badge-sm badge-outline border-[#061E47] text-[#061E47]">
                                  {selectedVoter.casteCategory}
                                </span>
                              ) : (
                                "—"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Relation Details */}
                        <div className="bg-gradient-to-r from-blue-50/30 to-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs font-medium text-blue-800 mb-2">
                            Relation Details
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Relation Type
                              </p>
                              <p className="font-medium text-gray-800">
                                {selectedVoter.relationType || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Relation Name
                              </p>
                              <p className="font-medium text-gray-800">
                                {selectedVoter.relationName || "—"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Contact/Location */}
                        <div className="bg-gradient-to-r from-green-50/30 to-white rounded-lg p-3 border border-green-100">
                          <p className="text-xs font-medium text-green-800 mb-2">
                            Country & State
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Country
                              </p>
                              <p className="font-medium text-gray-800">
                                {selectedVoter.country || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                State
                              </p>
                              <p className="font-medium text-gray-800">
                                {selectedVoter.state || "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Location Information */}
                  <div className="space-y-4">
                    {/* Location Info Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 shadow-sm h-full">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-700 text-sm">
                          Location Information
                        </h4>
                        <Home className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        {/* District */}
                        <div className="bg-gray-50/50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">District</p>
                          <p className="font-semibold text-gray-800 flex items-center gap-2">
                            {selectedVoter.district?.name ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-[#061E47]"></span>
                                {selectedVoter.district.name}
                                {selectedVoter.district.code && (
                                  <span className="text-xs text-gray-500">
                                    ({selectedVoter.district.code})
                                  </span>
                                )}
                              </>
                            ) : (
                              "—"
                            )}
                          </p>
                        </div>

                        {/* Constituency */}
                        {selectedVoter.constituency && (
                          <div className="bg-gradient-to-r from-purple-50/30 to-white rounded-lg p-3 border border-purple-100">
                            <p className="text-xs font-medium text-purple-800 mb-2">
                              Constituency
                            </p>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-800">
                                {selectedVoter.constituency.constituencyNo} -{" "}
                                {selectedVoter.constituency.name}
                              </p>
                              {selectedVoter.constituency.districts?.[0]
                                ?.district && (
                                <p className="text-xs text-gray-600">
                                  District:{" "}
                                  {
                                    selectedVoter.constituency.districts[0]
                                      .district.name
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Rural Hierarchy */}
                        {(selectedVoter.tc ||
                          selectedVoter.gpu ||
                          selectedVoter.ward) && (
                          <div className="bg-gradient-to-r from-amber-50/30 to-white rounded-lg p-3 border border-amber-100">
                            <p className="text-xs font-medium text-amber-800 mb-2">
                              Rural Hierarchy
                            </p>
                            <div className="space-y-2">
                              {selectedVoter.tc && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    TC:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {selectedVoter.tc.tc_no} -{" "}
                                    {selectedVoter.tc.tc_name}
                                  </span>
                                </div>
                              )}
                              {selectedVoter.gpu && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    GPU:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {selectedVoter.gpu.gpu_no} -{" "}
                                    {selectedVoter.gpu.gpu_name}
                                  </span>
                                </div>
                              )}
                              {selectedVoter.ward && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    Ward:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {selectedVoter.ward.ward_no} -{" "}
                                    {selectedVoter.ward.ward_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Urban Hierarchy */}
                        {(selectedVoter.municipality ||
                          selectedVoter.municipalWard) && (
                          <div className="bg-gradient-to-r from-cyan-50/30 to-white rounded-lg p-3 border border-cyan-100">
                            <p className="text-xs font-medium text-cyan-800 mb-2">
                              Urban Hierarchy
                            </p>
                            <div className="space-y-2">
                              {selectedVoter.municipality && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    Municipality:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {selectedVoter.municipality.municipalityNo}{" "}
                                    - {selectedVoter.municipality.name}
                                  </span>
                                </div>
                              )}
                              {selectedVoter.municipalWard && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">
                                    Municipal Ward:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {selectedVoter.municipalWard.ward_no} -{" "}
                                    {selectedVoter.municipalWard.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Photo IDs */}
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-800 mb-2">
                            Photo & Cloudinary IDs
                          </p>
                          <div className="space-y-1">
                            {selectedVoter.photo && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Photo URL:
                                </span>
                                <a
                                  href={selectedVoter.photo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline truncate max-w-[60%]"
                                >
                                  View Photo
                                </a>
                              </div>
                            )}
                            {selectedVoter.photoPublicId && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  Cloudinary ID:
                                </span>
                                <span className="text-xs text-gray-700 font-mono truncate max-w-[60%]">
                                  {selectedVoter.photoPublicId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-sm btn-outline flex-1 order-2 sm:order-1 rounded-xl font-medium text-xs"
                    onClick={() => setViewModalOpen(false)}
                  >
                    Close Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-sm bg-gradient-to-r from-[#061E47] to-[#0A2B6B] text-white border-0 flex-1 order-1 sm:order-2 rounded-xl font-medium text-xs"
                    onClick={() => {
                      setViewModalOpen(false);
                      handleEditVoter(selectedVoter);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" />
                    Edit Voter
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedVoter && (
        <div className="modal modal-open">
          <div
            className="modal-backdrop"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="modal-box max-w-xs p-0 overflow-hidden shadow-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-white">
                    Delete Voter
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3"
                  >
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">
                    Confirm Delete
                  </h4>
                  <p className="text-gray-600 mb-4 text-xs leading-relaxed">
                    Are you sure you want to delete voter{" "}
                    <span className="font-semibold">{selectedVoter.name}</span>?
                    This action will soft delete the voter.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="btn btn-sm btn-outline flex-1 rounded font-medium text-xs"
                      onClick={() => setDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-error flex-1 rounded font-medium text-xs text-white"
                      onClick={() => handleDeleteVoter(selectedVoter.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Voter Card Generator Modal */}
      <VoterCardGenerator
        voter={selectedVoter}
        isOpen={cardGeneratorOpen}
        onClose={() => setCardGeneratorOpen(false)}
      />

      {/* PDF Import Modal */}
      {pdfImportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setPdfImportModalOpen(false);
              resetPdfImport();
            }}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      Import Voters from PDF
                    </h3>
                    <p className="text-emerald-100 text-sm">
                      Electoral roll PDF import
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPdfImportModalOpen(false);
                    resetPdfImport();
                  }}
                  className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* PDF File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Electoral Roll PDF *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    pdfFile
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                >
                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {pdfFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-emerald-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">
                          {pdfFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPdfFile(null);
                          setPdfImportResult(null);
                          if (pdfFileInputRef.current) {
                            pdfFileInputRef.current.value = "";
                          }
                        }}
                        className="btn btn-circle btn-xs btn-ghost text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF files only (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Area Type Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Area Type *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfImportAreaType("Rural");
                      setPdfImportMunicipality(null);
                      setPdfImportMunicipalWard(null);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      pdfImportAreaType === "Rural"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🌳 Rural (GPU/Ward)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfImportAreaType("Urban");
                      setPdfImportTc(null);
                      setPdfImportGpu(null);
                      setPdfImportWard(null);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      pdfImportAreaType === "Urban"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🏢 Urban (Municipality)
                  </button>
                </div>
              </div>

              {/* Location Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    District *
                  </label>
                  <Select
                    value={pdfImportDistrict}
                    onChange={(option) => {
                      setPdfImportDistrict(option);
                      setPdfImportConstituency(null);
                      setPdfImportTc(null);
                      setPdfImportGpu(null);
                      setPdfImportWard(null);
                    }}
                    options={districts.map((d) => ({
                      value: d.id,
                      label: d.name,
                    }))}
                    placeholder="Select district..."
                    styles={selectStyles}
                    isClearable
                  />
                </div>

                {/* Constituency */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Constituency *
                  </label>
                  <Select
                    value={pdfImportConstituency}
                    onChange={(option) => {
                      setPdfImportConstituency(option);
                      setPdfImportTc(null);
                      setPdfImportGpu(null);
                      setPdfImportWard(null);
                      if (option) {
                        fetchTcs(option.value);
                      }
                    }}
                    options={constituencies.map((c) => ({
                      value: c.id,
                      label: `${c.constituencyNo} - ${c.name}`,
                    }))}
                    placeholder="Select constituency..."
                    styles={selectStyles}
                    isClearable
                    isDisabled={!pdfImportDistrict}
                  />
                </div>

                {/* Rural fields */}
                {pdfImportAreaType === "Rural" && (
                  <>
                    {/* TC */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        TC *
                      </label>
                      <Select
                        value={pdfImportTc}
                        onChange={(option) => {
                          setPdfImportTc(option);
                          setPdfImportGpu(null);
                          setPdfImportWard(null);
                          if (option) {
                            fetchGpus(option.value);
                          }
                        }}
                        options={tcs.map((tc) => ({
                          value: tc.id,
                          label: `${tc.tc_no} - ${tc.tc_name}`,
                        }))}
                        placeholder="Select TC..."
                        styles={selectStyles}
                        isClearable
                        isDisabled={!pdfImportConstituency}
                      />
                    </div>

                    {/* GPU */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        GPU *
                      </label>
                      <Select
                        value={pdfImportGpu}
                        onChange={(option) => {
                          setPdfImportGpu(option);
                          setPdfImportWard(null);
                          if (option) {
                            fetchWards(option.value);
                          }
                        }}
                        options={gpus.map((g) => ({
                          value: g.id,
                          label: `${g.gpu_no} - ${g.gpu_name}`,
                        }))}
                        placeholder="Select GPU..."
                        styles={selectStyles}
                        isClearable
                        isDisabled={!pdfImportTc}
                      />
                    </div>

                    {/* Ward */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Ward *
                      </label>
                      <Select
                        value={pdfImportWard}
                        onChange={(option) => setPdfImportWard(option)}
                        options={wards.map((w) => ({
                          value: w.id,
                          label: `${w.ward_no} - ${w.ward_name}`,
                        }))}
                        placeholder="Select Ward..."
                        styles={selectStyles}
                        isClearable
                        isDisabled={!pdfImportGpu}
                      />
                    </div>
                  </>
                )}

                {/* Urban fields */}
                {pdfImportAreaType === "Urban" && (
                  <>
                    {/* Municipality */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Municipality *
                      </label>
                      <Select
                        value={pdfImportMunicipality}
                        onChange={async (option) => {
                          setPdfImportMunicipality(option);
                          setPdfImportMunicipalWard(null);
                          if (option) {
                            await fetchMunicipalWards(option.value);
                          }
                        }}
                        options={municipalities.map((m) => ({
                          value: m.id,
                          label: m.name,
                        }))}
                        placeholder="Select municipality..."
                        styles={selectStyles}
                        isClearable
                      />
                    </div>

                    {/* Municipal Ward */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Municipal Ward *
                      </label>
                      <Select
                        value={pdfImportMunicipalWard}
                        onChange={(option) => setPdfImportMunicipalWard(option)}
                        options={municipalWards.map((mw) => ({
                          value: mw.id,
                          label: `${mw.ward_no} - ${mw.name || mw.ward_name}`,
                        }))}
                        placeholder="Select ward..."
                        styles={selectStyles}
                        isClearable
                        isDisabled={!pdfImportMunicipality}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Import Result */}
              {pdfImportResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800">
                        Import Successful!
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-emerald-700">
                        <p>
                          <span className="font-medium">Inserted:</span>{" "}
                          {pdfImportResult.insertedCount} voters
                        </p>
                        <p>
                          <span className="font-medium">
                            Duplicates skipped:
                          </span>{" "}
                          {pdfImportResult.duplicateCount}
                        </p>
                        <p>
                          <span className="font-medium">Total extracted:</span>{" "}
                          {pdfImportResult.extracted?.length || 0} records
                        </p>
                      </div>
                      {pdfImportResult.duplicateCount > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-emerald-600 cursor-pointer hover:text-emerald-800">
                            View duplicate EPIC numbers
                          </summary>
                          <div className="mt-2 max-h-32 overflow-y-auto text-xs bg-white rounded p-2 border">
                            {pdfImportResult.duplicates?.map(
                              (d: any, i: number) => (
                                <span
                                  key={i}
                                  className="inline-block bg-gray-100 rounded px-2 py-0.5 m-0.5"
                                >
                                  {d.epicNo}
                                </span>
                              )
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800">Error</h4>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  setPdfImportModalOpen(false);
                  resetPdfImport();
                }}
                className="btn btn-ghost"
                disabled={isPdfUploading}
              >
                {pdfImportResult ? "Close" : "Cancel"}
              </button>
              {!pdfImportResult && (
                <button
                  type="button"
                  onClick={handlePdfImport}
                  disabled={isPdfUploading || !pdfFile}
                  className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                >
                  {isPdfUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Voters
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
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
          © 2024 State Election Commission, Sikkim • Voter Management System
          v2.0
        </p>
      </motion.div>
    </motion.div>
  );
}
