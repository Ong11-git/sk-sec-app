import React, { useState } from "react";
import { ChevronDown, ChevronRight, Info, Edit2, Check, X } from "lucide-react";
import type { ReservationCategory } from "../../types/reservationTypes";
import { CATEGORY_COLORS } from "../../types/reservationTypes";
import { calcSTSubCategories } from "../../utils/reservationCalc";

interface ReservationPercentageTableProps {
  categories: ReservationCategory[];
  zptcSeats: number;
  wardsSeats: number;
  zptcResults: any[];
  wardsResults: any[];
  onCategoryUpdate?: (categories: ReservationCategory[]) => void;
  editable?: boolean;
  isCalculationComplete?: boolean;
}

const ReservationPercentageTable: React.FC<ReservationPercentageTableProps> = ({
  categories,
  zptcSeats,
  wardsSeats,
  zptcResults,
  wardsResults,
  onCategoryUpdate,
  editable = false,
  isCalculationComplete = false,
}) => {
  const [expandedST, setExpandedST] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCategories, setEditedCategories] = useState(categories);

  const handleEditToggle = () => {
    if (editMode) {
      if (onCategoryUpdate) {
        onCategoryUpdate(editedCategories);
      }
    } else {
      setEditedCategories([...categories]);
    }
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    setEditedCategories([...categories]);
    setEditMode(false);
  };

  const handlePercentageChange = (
    categoryCode: string,
    newPercentage: number
  ) => {
    setEditedCategories((prev) =>
      prev.map((cat) =>
        cat.code === categoryCode ? { ...cat, percentage: newPercentage } : cat
      )
    );
  };

  const getSTSubCategories = (totalSTSeats: number, totalSeats: number) => {
    return calcSTSubCategories(totalSTSeats, totalSeats);
  };

  const getCategoryResult = (results: any[], categoryCode: string) => {
    return results.find((result) => result.category === categoryCode);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage}%`;
  };

  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  const stZptcResult = getCategoryResult(zptcResults, "ST");
  const stWardsResult = getCategoryResult(wardsResults, "ST");

  const stZptcSub = stZptcResult
    ? getSTSubCategories(stZptcResult.roundedValue, zptcSeats)
    : null;
  const stWardsSub = stWardsResult
    ? getSTSubCategories(stWardsResult.roundedValue, wardsSeats)
    : null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Reservation Percentages
            </h3>
            {isCalculationComplete && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                ✅ Calculated
              </span>
            )}
            {!isCalculationComplete &&
              zptcResults.length === 0 &&
              wardsResults.length === 0 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                  ⏳ Pending Calculation
                </span>
              )}
          </div>

          {editable && (
            <div className="flex items-center space-x-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-3 py-1 text-sm bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-slate-600 mt-1">
          {isCalculationComplete
            ? "Live calculated seat allocation based on reservation percentages"
            : "Category-wise seat allocation preview (run calculation to see actual results)"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-slate-700">
                Category
              </th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">
                Reservation %
              </th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">
                ZPTC Seats
              </th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">
                Ward Seats
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mainCategories.map((category, index) => (
              <React.Fragment key={category.code}>
                <tr
                  className={`hover:bg-slate-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {category.code === "ST" && (
                        <button
                          onClick={() => setExpandedST(!expandedST)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {expandedST ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                            CATEGORY_COLORS[category.code]
                          }`}
                        >
                          {category.code}
                        </span>
                        <span className="text-slate-800 font-medium">
                          {category.label}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {editMode ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={
                          editedCategories.find(
                            (cat) => cat.code === category.code
                          )?.percentage || 0
                        }
                        onChange={(e) =>
                          handlePercentageChange(
                            category.code,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 text-right px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <span className="text-slate-700 font-medium">
                        {formatPercentage(category.percentage)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                      {getCategoryResult(zptcResults, category.code)
                        ?.roundedValue || 0}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-sm font-medium">
                      {getCategoryResult(wardsResults, category.code)
                        ?.roundedValue || 0}
                    </span>
                  </td>
                </tr>

                {category.code === "ST" && expandedST && (
                  <>
                    <tr className="bg-indigo-25 border-l-4 border-indigo-200">
                      <td className="py-2 px-6 pl-12">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${CATEGORY_COLORS.ST_BL}`}
                          >
                            BL
                          </span>
                          <span className="text-slate-700 text-sm">
                            ST - BL (Bhutia-Lepcha)
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="text-slate-600 text-sm">8%</span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                          {stZptcSub?.BL || 0}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-sm">
                          {stWardsSub?.BL || 0}
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-indigo-25 border-l-4 border-indigo-200">
                      <td className="py-2 px-6 pl-12">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${CATEGORY_COLORS.ST_BL_LT}`}
                          >
                            BL&LT
                          </span>
                          <span className="text-slate-700 text-sm">
                            ST - BL & Limboo-Tamang
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="text-slate-600 text-sm">32%</span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                          {stZptcSub?.BL_LT || 0}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-sm">
                          {stWardsSub?.BL_LT || 0}
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>

          <tfoot className="bg-slate-100 border-t-2 border-slate-300">
            <tr>
              <td className="py-4 px-6 font-semibold text-slate-800">Total</td>
              <td className="py-4 px-4 text-right font-semibold text-slate-800">
                100%
              </td>
              <td className="py-4 px-4 text-right">
                <span className="inline-block px-3 py-1 bg-slate-700 text-white rounded-md font-semibold">
                  {zptcSeats}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="inline-block px-3 py-1 bg-slate-700 text-white rounded-md font-semibold">
                  {wardsSeats}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReservationPercentageTable;
