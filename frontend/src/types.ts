export interface Voter {
  id: number;
  epicNo: string;
  stateEpicNo?: string | null;
  name: string;
  relationType?: string | null;
  relationName?: string | null;
  age?: number | null;
  gender?: string | null;
  country?: string | null;
  gpuName?: string | null;
  gpuNo?: string | null;
  state?: string | null;
  tcName?: string | null;
  tcNo?: string | null;
  wardName?: string | null;
  wardNo?: string | null;
  district: {
    name?: string | null;
    code?: string | null;
  };
  constituency: {
    name?: string | null;
    constituencyNo?: number | null;
  };
  tc?: {
    id?: number | null;
    tc_no?: number | null;
    tc_name?: string | null;
  };
  gpu?: {
    id?: number | null;
    gpu_no?: number | null;
    gpu_name?: string | null;
  };
  ward?: {
    id?: number | null;
    ward_no?: number | null;
    ward_name?: string | null;
  };
  municipality?: {
    id?: number | null;
    name?: string | null;
    municipalityNo?: number | null;
  };
  municipalWard?: {
    id?: number | null;
    ward_no?: number | null;
    name?: string | null;
  };
}

export interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  colorClass: string;
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab:
    | "dashboard"
    | "voters"
    | "addVoters"
    | "votersFilters"
    | "constituency"
    | "territorialConstituency"
    | "district"
    | "gpu"
    | "ward"
    | "municipality"
    | "municipalWard";
  onTabChange: (
    tab:
      | "dashboard"
      | "voters"
      | "addVoters"
      | "votersFilters"
      | "constituency"
      | "territorialConstituency"
      | "district"
      | "gpu"
      | "ward"
      | "municipality"
      | "municipalWard"
  ) => void;
}
