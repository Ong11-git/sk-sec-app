export interface Voter {
  id: number;
  epicNo: string;
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
  district:{
    name?:string|null
  }
  constituency:{
    name?: string |null
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
  activeTab: "dashboard" | "voters" | "addVoters" | "votersFilters" | "constituency" | "territorialConstituency" | "district"|"gpu" |"ward";
  onTabChange: (tab: "dashboard" | "voters" | "addVoters" |"votersFilters"|"constituency"|"territorialConstituency" | "district"|"gpu"|"ward") => void;
}
  