// ============================================
// FILE: src/data/reservationData.ts
// ============================================

import type {
  DistrictConfig,
  ReservationCategory,
} from "../types/reservationTypes";

// District configurations based on the provided data
export const DISTRICTS: DistrictConfig[] = [
  {
    id: "gyalshing",
    name: "Gyalshing",
    zptcSeats: 18,
    gpuSeats: 33,
    wards: 194,
  },
  {
    id: "soreng",
    name: "Soreng",
    zptcSeats: 17,
    gpuSeats: 36,
    wards: 200,
  },
  {
    id: "namchi",
    name: "Namchi",
    zptcSeats: 30,
    gpuSeats: 54,
    wards: 331,
  },
  {
    id: "gangtok",
    name: "Gangtok",
    zptcSeats: 15,
    gpuSeats: 23,
    wards: 130,
  },
  {
    id: "pakyong",
    name: "Pakyong",
    zptcSeats: 19,
    gpuSeats: 28,
    wards: 164,
  },
  {
    id: "mangan",
    name: "Mangan",
    zptcSeats: 23,
    gpuSeats: 25, // Note: 2 DZUMSA ZPTC and 2 DZUMSA GPU mentioned in original sheet
    wards: 128,
  },
];

// Calculated state totals
export const STATE_TOTALS = {
  zptcSeats: 122, // Total ZPTC including DZUMSA 124
  gpuSeats: 197, // GPU including DZUMSA 199
  wards: 1147,
};

// Reservation categories and percentages
export const RESERVATION_CATEGORIES: ReservationCategory[] = [
  { code: "ST", label: "Scheduled Tribe", percentage: 40 },
  { code: "ST_BL", label: "ST - BL", percentage: 8, parentCategory: "ST" },
  {
    code: "ST_BL_LT",
    label: "ST - BL & LT",
    percentage: 32,
    parentCategory: "ST",
  },
  { code: "OBC_C", label: "OBC (C)", percentage: 26 },
  { code: "OBC_S", label: "OBC (S)", percentage: 25 },
  { code: "SC", label: "Scheduled Caste", percentage: 6 },
  { code: "UR", label: "Unreserved", percentage: 3 },
];

// Main categories only (for simplified display)
export const MAIN_CATEGORIES = RESERVATION_CATEGORIES.filter(
  (cat) => !cat.parentCategory
);

// Get district by ID
export const getDistrictById = (id: string): DistrictConfig | undefined => {
  return DISTRICTS.find((district) => district.id === id);
};

// Get all district names for dropdown
export const getDistrictOptions = () => {
  return DISTRICTS.map((district) => ({
    value: district.id,
    label: district.name,
  }));
};

// Validate total percentages
const totalPercentage = MAIN_CATEGORIES.reduce(
  (sum, cat) => sum + cat.percentage,
  0
);
if (totalPercentage !== 100) {
  console.warn(
    `Total reservation percentage is ${totalPercentage}%, should be 100%`
  );
}
