// ============================================
// FILE: src/pages/SeatReservationPage.tsx
// ============================================

import React, { useState, useEffect, useMemo } from "react";
import { Calculator, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import SeatReservationForm from "../components/reservation/SeatReservationForm";
import ReservationPercentageTable from "../components/reservation/ReservationPercentageTable";
import CalculationStepsPanel from "../components/reservation/CalculationStepsPanel";
import StateSummaryTabs from "../components/reservation/StateSummaryTabs";
import TerminalCalculation from "../components/reservation/TerminalCalculation";
import type {
  ScopeType,
  DistrictReservationResult,
  StateSummaryResult,
  ReservationCategory,
  BodyReservationResult,
} from "../types/reservationTypes";
import {
  DISTRICTS,
  RESERVATION_CATEGORIES,
  getDistrictById,
  STATE_TOTALS,
} from "../data/reservationData";
import {
  calcDistrictReservation,
  aggregateState,
  calcReservationForBody,
} from "../utils/reservationCalc";

const SeatReservationPage: React.FC = () => {
  const [scope, setScope] = useState<ScopeType>("district-wise");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [categories, setCategories] = useState<ReservationCategory[]>(
    RESERVATION_CATEGORIES
  );
  const [isCalculationComplete, setIsCalculationComplete] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    zptc: BodyReservationResult;
    wards: BodyReservationResult;
  } | null>(null);

  // Set default district on mount
  useEffect(() => {
    if (
      scope === "district-wise" &&
      !selectedDistrictId &&
      DISTRICTS.length > 0
    ) {
      setSelectedDistrictId(DISTRICTS[0].id);
    }
  }, [scope, selectedDistrictId]);

  // Calculate district results
  const districtResults = useMemo<DistrictReservationResult[]>(() => {
    const mainCategories = categories.filter((cat) => !cat.parentCategory);
    return DISTRICTS.map((district) =>
      calcDistrictReservation(district, mainCategories)
    );
  }, [categories]);

  // Calculate state summary
  const stateSummary = useMemo<StateSummaryResult>(() => {
    return aggregateState(districtResults);
  }, [districtResults]);

  // Get current district data
  const selectedDistrict = useMemo(() => {
    return selectedDistrictId ? getDistrictById(selectedDistrictId) : null;
  }, [selectedDistrictId]);

  // Get current district results
  const currentDistrictResult = useMemo(() => {
    return districtResults.find(
      (result) => result.district.id === selectedDistrictId
    );
  }, [districtResults, selectedDistrictId]);

  // Calculate state-level results for display
  const stateZptcResult = useMemo(() => {
    const mainCategories = categories.filter((cat) => !cat.parentCategory);
    return calcReservationForBody(
      STATE_TOTALS.zptcSeats,
      mainCategories,
      "ZPTC"
    );
  }, [categories]);

  const stateWardsResult = useMemo(() => {
    const mainCategories = categories.filter((cat) => !cat.parentCategory);
    return calcReservationForBody(STATE_TOTALS.wards, mainCategories, "WARDS");
  }, [categories]);

  // Display data based on scope and calculation state
  const displayData = useMemo(() => {
    // If calculation is complete, use calculated results
    if (isCalculationComplete && calculatedResults) {
      if (scope === "district-wise" && selectedDistrict) {
        return {
          zptcSeats: selectedDistrict.zptcSeats,
          wardsSeats: selectedDistrict.wards,
          zptcResults: calculatedResults.zptc.results,
          wardsResults: calculatedResults.wards.results,
        };
      }
    }

    // Otherwise show empty/placeholder data
    if (scope === "state-total") {
      return {
        zptcSeats: STATE_TOTALS.zptcSeats,
        wardsSeats: STATE_TOTALS.wards,
        zptcResults: isCalculationComplete ? stateZptcResult.results : [],
        wardsResults: isCalculationComplete ? stateWardsResult.results : [],
      };
    } else if (selectedDistrict) {
      return {
        zptcSeats: selectedDistrict.zptcSeats,
        wardsSeats: selectedDistrict.wards,
        zptcResults: [],
        wardsResults: [],
      };
    }

    return {
      zptcSeats: 0,
      wardsSeats: 0,
      zptcResults: [],
      wardsResults: [],
    };
  }, [
    scope,
    selectedDistrict,
    isCalculationComplete,
    calculatedResults,
    stateZptcResult,
    stateWardsResult,
  ]);

  const handleScopeChange = (newScope: ScopeType) => {
    setScope(newScope);
    if (newScope === "state-total") {
      setSelectedDistrictId("");
    } else if (!selectedDistrictId && DISTRICTS.length > 0) {
      setSelectedDistrictId(DISTRICTS[0].id);
    }
  };

  const handleCategoryUpdate = (updatedCategories: ReservationCategory[]) => {
    setCategories(updatedCategories);
    // Reset calculation when categories change
    setIsCalculationComplete(false);
    setCalculatedResults(null);
  };

  const handleCalculationComplete = (results: { zptc: any; wards: any }) => {
    setCalculatedResults(results);
    setIsCalculationComplete(true);
  };

  // Reset calculation when scope or district changes
  useEffect(() => {
    setIsCalculationComplete(false);
    setCalculatedResults(null);
  }, [scope, selectedDistrictId]);

  const hasValidData = scope === "state-total" || currentDistrictResult;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                <Calculator className="w-7 h-7 text-indigo-600" />
                <span>Seat Reservation Calculator</span>
              </h1>
              <p className="text-slate-600 mt-1">
                Panchayat / Municipal Election Roster – Sikkim
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-500">Current Scope</div>
                <div className="font-semibold text-slate-800 capitalize">
                  {scope.replace("-", " ")}
                </div>
              </div>

              {scope === "district-wise" && selectedDistrict && (
                <div className="text-right">
                  <div className="text-sm text-slate-500">
                    Selected District
                  </div>
                  <div className="font-semibold text-slate-800">
                    {selectedDistrict.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Scope and District Selection */}
        <SeatReservationForm
          scope={scope}
          selectedDistrict={selectedDistrictId}
          onScopeChange={handleScopeChange}
          onDistrictChange={setSelectedDistrictId}
          districtData={selectedDistrict}
        />

        {/* Validation Messages */}
        {!hasValidData && scope === "district-wise" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Please select a district to view seat reservation calculations
              </span>
            </div>
          </div>
        )}

        {hasValidData &&
          scope === "district-wise" &&
          !isCalculationComplete && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Click "Calculate" in the terminal below to start the seat
                  allocation calculation for {selectedDistrict?.name}
                </span>
              </div>
            </div>
          )}

        {/* Main Content - Only show when we have valid data */}
        {hasValidData && (
          <>
            {/* Terminal Calculation - Always show for district-wise */}
            {scope === "district-wise" && selectedDistrict && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Live Terminal Calculation
                  </h2>
                  <span className="text-slate-500">
                    - Step-by-step calculation process
                  </span>
                </div>

                <TerminalCalculation
                  districtData={selectedDistrict}
                  categories={categories.filter((cat) => !cat.parentCategory)}
                  onCalculationComplete={handleCalculationComplete}
                />
              </div>
            )}

            {/* Reservation Percentage Table - Only show after calculation for district-wise */}
            {((scope === "district-wise" && isCalculationComplete) ||
              scope === "state-total") && (
              <ReservationPercentageTable
                categories={categories.filter((cat) => !cat.parentCategory)}
                zptcSeats={displayData.zptcSeats}
                wardsSeats={displayData.wardsSeats}
                zptcResults={displayData.zptcResults}
                wardsResults={displayData.wardsResults}
                onCategoryUpdate={handleCategoryUpdate}
                editable={true}
                isCalculationComplete={
                  isCalculationComplete || scope === "state-total"
                }
              />
            )}

            {/* Calculation Steps - Hidden for now */}
            {false && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {scope === "state-total" ? (
                  <>
                    <CalculationStepsPanel
                      result={stateZptcResult}
                      bodyType="ZPTC"
                    />
                    <CalculationStepsPanel
                      result={stateWardsResult}
                      bodyType="WARDS"
                    />
                  </>
                ) : currentDistrictResult ? (
                  <>
                    <CalculationStepsPanel
                      result={currentDistrictResult!.zptc}
                      bodyType="ZPTC"
                    />
                    <CalculationStepsPanel
                      result={currentDistrictResult!.wards}
                      bodyType="WARDS"
                    />
                  </>
                ) : null}
              </div>
            )}

            {/* State Summary - Show after calculation is complete or for state-total scope */}
            {((scope === "district-wise" && isCalculationComplete) ||
              scope === "state-total") && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Complete Summary
                  </h2>
                  <span className="text-slate-500">
                    - All districts and state totals
                  </span>
                </div>

                <StateSummaryTabs
                  districtResults={districtResults}
                  stateSummary={stateSummary}
                />
              </div>
            )}

            {/* Quick Stats Cards - Show only after calculation */}
            {((scope === "district-wise" && isCalculationComplete) ||
              scope === "state-total") && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      ST Allocation
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">40%</div>
                    <div className="text-xs text-slate-500">
                      Including BL (8%) + BL&LT (32%)
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      OBC Total
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">51%</div>
                    <div className="text-xs text-slate-500">
                      OBC (C) 26% + OBC (S) 25%
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      SC Allocation
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">6%</div>
                    <div className="text-xs text-slate-500">
                      Scheduled Caste
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-600">
                      UR Allocation
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">3%</div>
                    <div className="text-xs text-slate-500">Unreserved</div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Information */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  Calculation Notes
                </span>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  • Calculations follow the official Sikkim reservation
                  guidelines for Panchayat and Municipal elections
                </p>
                <p>
                  • ST category includes sub-allocations for BL (Bhutia-Lepcha)
                  and BL&LT (Bhutia-Lepcha & Limboo-Tamang)
                </p>
                <p>
                  • Rounding adjustments are applied to ensure total allocated
                  seats match available seats
                </p>
                <p>
                  • Export functionality provides CSV format for official
                  documentation
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeatReservationPage;
