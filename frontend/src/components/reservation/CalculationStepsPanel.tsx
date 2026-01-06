import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { BodyReservationResult } from "../../types/reservationTypes";
import { CATEGORY_COLORS } from "../../types/reservationTypes";
import {
  generateCalculationSteps,
  validateReservation,
} from "../../utils/reservationCalc";
import { RESERVATION_CATEGORIES } from "../../data/reservationData";

interface CalculationStepsPanelProps {
  result: BodyReservationResult;
  bodyType: "ZPTC" | "GPU" | "WARDS";
}

const CalculationStepsPanel: React.FC<CalculationStepsPanelProps> = ({
  result,
  bodyType,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showValidation, setShowValidation] = useState(false);

  const validation = validateReservation(result);

  const toggleCategoryExpansion = (categoryCode: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryCode)) {
      newExpanded.delete(categoryCode);
    } else {
      newExpanded.add(categoryCode);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryInfo = (categoryCode: string) => {
    return RESERVATION_CATEGORIES.find((cat) => cat.code === categoryCode);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Calculation Steps - {bodyType}
            </h3>
          </div>

          <button
            onClick={() => setShowValidation(!showValidation)}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
              validation.isValid
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {validation.isValid ? (
              <CheckCircle2 className="w-4 h-4 mr-1" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-1" />
            )}
            {validation.isValid ? "Valid" : "Issues Found"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-slate-600">
            Step-by-step breakdown of seat allocation calculations
          </p>
          <p className="text-sm text-slate-500">
            Total Seats:{" "}
            <span className="font-medium text-slate-700">
              {result.totalSeats}
            </span>
          </p>
        </div>
      </div>

      {showValidation && (
        <div
          className={`p-4 border-b border-slate-100 ${
            validation.isValid ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <div className="space-y-2">
            {validation.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Errors:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-amber-800 mb-1">
                  Warnings:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-amber-700">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.isValid &&
              validation.errors.length === 0 &&
              validation.warnings.length === 0 && (
                <p className="text-sm text-green-700">
                  ✅ All calculations are valid and properly balanced.
                </p>
              )}
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {result.results.map((categoryResult) => {
          const categoryInfo = getCategoryInfo(categoryResult.category);
          if (!categoryInfo) return null;

          const isExpanded = expandedCategories.has(categoryResult.category);
          const steps = generateCalculationSteps(
            result.totalSeats,
            categoryInfo
          );
          const isAdjusted =
            result.adjustedCategory === categoryResult.category;

          return (
            <div key={categoryResult.category} className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategoryExpansion(categoryResult.category)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        CATEGORY_COLORS[categoryResult.category]
                      }`}
                    >
                      {categoryResult.category}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {categoryInfo.label}
                    </span>
                  </div>

                  {isAdjusted && (
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                      Adjusted
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      Raw: {formatNumber(categoryResult.rawValue)}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      Final: {categoryResult.roundedValue}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 ml-6 space-y-4">
                  {steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {step.stepNumber}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold text-slate-800">
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {step.description}
                        </p>

                        {step.formula && (
                          <div className="bg-slate-50 border border-slate-200 rounded-md p-2 mb-2">
                            <code className="text-sm text-slate-700 font-mono">
                              {step.formula}
                            </code>
                          </div>
                        )}

                        {step.example && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                            <code className="text-sm text-blue-800 font-mono">
                              {step.example}
                            </code>
                          </div>
                        )}

                        {step.data && (
                          <div className="mt-2 text-xs text-slate-500">
                            {step.data.residual && (
                              <span>Residual: {step.data.residual}</span>
                            )}
                            {step.data.finalSeats && (
                              <span>
                                Final allocation: {step.data.finalSeats} seats
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAdjusted && (
                    <div className="ml-10 p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                          Rounding Adjustment Applied
                        </span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        This category received a ±{Math.abs(result.difference)}{" "}
                        seat adjustment to ensure the total equals{" "}
                        {result.totalSeats}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Click on any category to view detailed calculation steps
          </div>
          <div className="text-sm">
            <span className="text-slate-500">Total Allocated: </span>
            <span className="font-semibold text-slate-800">
              {result.results.reduce((sum, cat) => sum + cat.roundedValue, 0)} /{" "}
              {result.totalSeats}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationStepsPanel;
