// ============================================
// FILE: src/types/reservationTypes.ts
// ============================================

export type CategoryCode =
  | "ST"
  | "ST_BL"
  | "ST_BL_LT"
  | "OBC_C"
  | "OBC_S"
  | "SC"
  | "UR";

export interface ReservationCategory {
  code: CategoryCode;
  label: string;
  percentage: number;
  parentCategory?: CategoryCode; // For sub-categories like ST_BL under ST
}

export interface DistrictConfig {
  id: string;
  name: string;
  zptcSeats: number;
  gpuSeats: number;
  wards: number;
}

export interface ReservationResultPerCategory {
  category: CategoryCode;
  percentage: number;
  rawValue: number; // decimal calculation
  roundedValue: number; // final allocated seats
  residual: number; // rawValue - roundedValue
}

export interface BodyReservationResult {
  type: "ZPTC" | "GPU" | "WARDS";
  totalSeats: number;
  results: ReservationResultPerCategory[];
  totalRounded: number;
  difference: number;
  adjustedCategory?: CategoryCode; // Which category got the adjustment
}

export interface DistrictReservationResult {
  district: DistrictConfig;
  zptc: BodyReservationResult;
  wards: BodyReservationResult;
}

export interface StateSummaryResult {
  totalZPTC: number;
  totalGPU: number;
  totalWards: number;
  zptcReservation: BodyReservationResult;
  wardsReservation: BodyReservationResult;
}

export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  formula?: string;
  example?: string;
  data?: any;
}

export type ScopeType = "district-wise" | "state-total";

// Badge colors for categories
export const CATEGORY_COLORS: Record<CategoryCode, string> = {
  ST: "bg-indigo-100 text-indigo-700",
  ST_BL: "bg-indigo-50 text-indigo-600",
  ST_BL_LT: "bg-indigo-50 text-indigo-600",
  OBC_C: "bg-emerald-100 text-emerald-700",
  OBC_S: "bg-teal-100 text-teal-700",
  SC: "bg-rose-100 text-rose-700",
  UR: "bg-slate-100 text-slate-700",
};
