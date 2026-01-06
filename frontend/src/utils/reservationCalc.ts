import type {
  ReservationCategory,
  ReservationResultPerCategory,
  BodyReservationResult,
  DistrictConfig,
  DistrictReservationResult,
  StateSummaryResult,
  CategoryCode,
  CalculationStep,
} from "../types/reservationTypes";
import { RESERVATION_CATEGORIES } from "../data/reservationData";

/**
 * Calculate seat reservation for a specific body (ZPTC/GPU/WARDS)
 */
export function calcReservationForBody(
  totalSeats: number,
  categories: ReservationCategory[],
  bodyType: "ZPTC" | "GPU" | "WARDS"
): BodyReservationResult {
  // Calculate raw values for each category
  const results: ReservationResultPerCategory[] = categories.map((category) => {
    const rawValue = totalSeats * (category.percentage / 100);
    const roundedValue = Math.round(rawValue);
    const residual = rawValue - roundedValue;

    return {
      category: category.code,
      percentage: category.percentage,
      rawValue,
      roundedValue,
      residual,
    };
  });

  // Calculate total rounded seats
  const totalRounded = results.reduce(
    (sum, result) => sum + result.roundedValue,
    0
  );
  const difference = totalSeats - totalRounded;

  // Apply adjustment if needed
  let adjustedCategory: CategoryCode | undefined;
  if (difference !== 0) {
    // Find the category with the largest residual for adjustment
    const categoryWithLargestResidual = results.reduce((max, current) =>
      Math.abs(current.residual) > Math.abs(max.residual) ? current : max
    );

    // Apply adjustment to that category
    categoryWithLargestResidual.roundedValue += difference;
    adjustedCategory = categoryWithLargestResidual.category;
  }

  return {
    type: bodyType,
    totalSeats,
    results,
    totalRounded: totalSeats, // After adjustment, this should always equal totalSeats
    difference: 0, // After adjustment, difference should be 0
    adjustedCategory,
  };
}

/**
 * Calculate reservation for a specific district
 */
export function calcDistrictReservation(
  district: DistrictConfig,
  categories: ReservationCategory[] = RESERVATION_CATEGORIES
): DistrictReservationResult {
  // Only calculate for main categories (not sub-categories)
  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  const zptcResult = calcReservationForBody(
    district.zptcSeats,
    mainCategories,
    "ZPTC"
  );
  const wardsResult = calcReservationForBody(
    district.wards,
    mainCategories,
    "WARDS"
  );

  return {
    district,
    zptc: zptcResult,
    wards: wardsResult,
  };
}

/**
 * Calculate ST sub-category breakdown for a given total ST seats
 */
export function calcSTSubCategories(totalSTSeats: number, totalSeats: number) {
  const stBlRaw = totalSeats * 0.08; // 8% for BL
  const stBlLtRaw = totalSeats * 0.32; // 32% for BL&LT

  const stBl = Math.round(stBlRaw);
  const stBlLt = Math.round(stBlLtRaw);

  // Ensure sub-categories don't exceed total ST allocation
  const subCategoryTotal = stBl + stBlLt;
  if (subCategoryTotal !== totalSTSeats) {
    // Adjust BL&LT to match total
    const adjustedStBlLt = totalSTSeats - stBl;
    return {
      BL: stBl,
      BL_LT: Math.max(0, adjustedStBlLt),
      total: totalSTSeats,
      rawBL: stBlRaw,
      rawBL_LT: stBlLtRaw,
    };
  }

  return {
    BL: stBl,
    BL_LT: stBlLt,
    total: totalSTSeats,
    rawBL: stBlRaw,
    rawBL_LT: stBlLtRaw,
  };
}

/**
 * Aggregate state-level results from all districts
 */
export function aggregateState(
  districtResults: DistrictReservationResult[]
): StateSummaryResult {
  const totals = districtResults.reduce(
    (acc, result) => ({
      zptcSeats: acc.zptcSeats + result.district.zptcSeats,
      gpuSeats: acc.gpuSeats + result.district.gpuSeats,
      wards: acc.wards + result.district.wards,
    }),
    { zptcSeats: 0, gpuSeats: 0, wards: 0 }
  );

  // Calculate state-level reservations using totals
  const mainCategories = RESERVATION_CATEGORIES.filter(
    (cat) => !cat.parentCategory
  );
  const zptcReservation = calcReservationForBody(
    totals.zptcSeats,
    mainCategories,
    "ZPTC"
  );
  const wardsReservation = calcReservationForBody(
    totals.wards,
    mainCategories,
    "WARDS"
  );

  return {
    totalZPTC: totals.zptcSeats,
    totalGPU: totals.gpuSeats,
    totalWards: totals.wards,
    zptcReservation,
    wardsReservation,
  };
}

/**
 * Generate calculation steps for UI display
 */
export function generateCalculationSteps(
  totalSeats: number,
  category: ReservationCategory
): CalculationStep[] {
  const rawValue = totalSeats * (category.percentage / 100);
  const roundedValue = Math.round(rawValue);
  const residual = rawValue - roundedValue;

  return [
    {
      stepNumber: 1,
      title: "Apply Formula",
      description: "Calculate raw reserved seats using percentage",
      formula: `Reserved seats = Total seats × (Reservation% / 100)`,
      example: `${totalSeats} × (${
        category.percentage
      }% / 100) = ${totalSeats} × ${
        category.percentage / 100
      } = ${rawValue.toFixed(2)}`,
    },
    {
      stepNumber: 2,
      title: "Round to Integer",
      description: "Round the decimal result to nearest whole number",
      example: `${rawValue.toFixed(2)} → ${roundedValue} seats`,
      data: { residual: residual.toFixed(2) },
    },
    {
      stepNumber: 3,
      title: "Final Allocation",
      description: "Final seat count after rounding adjustments",
      example: `${category.label}: ${roundedValue} seats`,
      data: { finalSeats: roundedValue },
    },
  ];
}

/**
 * Validate reservation calculations
 */
export function validateReservation(result: BodyReservationResult): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if total matches
  const calculatedTotal = result.results.reduce(
    (sum, cat) => sum + cat.roundedValue,
    0
  );
  if (calculatedTotal !== result.totalSeats) {
    errors.push(
      `Total allocated seats (${calculatedTotal}) doesn't match expected total (${result.totalSeats})`
    );
  }

  // Check for negative allocations
  const negativeAllocations = result.results.filter(
    (cat) => cat.roundedValue < 0
  );
  if (negativeAllocations.length > 0) {
    errors.push(
      `Negative seat allocations found for: ${negativeAllocations
        .map((cat) => cat.category)
        .join(", ")}`
    );
  }

  // Check for large residuals (potential rounding issues)
  const largeResiduals = result.results.filter(
    (cat) => Math.abs(cat.residual) > 0.5
  );
  if (largeResiduals.length > 0) {
    warnings.push(
      `Large rounding residuals found for: ${largeResiduals
        .map((cat) => cat.category)
        .join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Export results to CSV format
 */
export function exportToCSV(
  districtResults: DistrictReservationResult[],
  stateSummary: StateSummaryResult
): string {
  const headers = [
    "District",
    "Type",
    "Total Seats",
    "ST",
    "OBC (C)",
    "OBC (S)",
    "SC",
    "UR",
  ];

  const rows: string[][] = [headers];

  // Add district data
  districtResults.forEach((result) => {
    // ZPTC row
    const zptcRow = [
      result.district.name,
      "ZPTC",
      result.zptc.totalSeats.toString(),
      ...result.zptc.results.map((cat) => cat.roundedValue.toString()),
    ];
    rows.push(zptcRow);

    // Wards row
    const wardsRow = [
      result.district.name,
      "Wards",
      result.wards.totalSeats.toString(),
      ...result.wards.results.map((cat) => cat.roundedValue.toString()),
    ];
    rows.push(wardsRow);
  });

  // Add state totals
  rows.push([""]); // Empty row
  rows.push(["STATE TOTALS"]);

  const stateZptcRow = [
    "Sikkim",
    "ZPTC",
    stateSummary.zptcReservation.totalSeats.toString(),
    ...stateSummary.zptcReservation.results.map((cat) =>
      cat.roundedValue.toString()
    ),
  ];
  rows.push(stateZptcRow);

  const stateWardsRow = [
    "Sikkim",
    "Wards",
    stateSummary.wardsReservation.totalSeats.toString(),
    ...stateSummary.wardsReservation.results.map((cat) =>
      cat.roundedValue.toString()
    ),
  ];
  rows.push(stateWardsRow);

  // Convert to CSV string
  return rows.map((row) => row.join(",")).join("\n");
}
