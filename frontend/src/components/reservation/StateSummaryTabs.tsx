import React, { useState } from "react";
import { BarChart3, Map, Download } from "lucide-react";
import type {
  DistrictReservationResult,
  StateSummaryResult,
} from "../../types/reservationTypes";
import { CATEGORY_COLORS } from "../../types/reservationTypes";
import { exportToCSV } from "../../utils/reservationCalc";

interface StateSummaryTabsProps {
  districtResults: DistrictReservationResult[];
  stateSummary: StateSummaryResult;
}

const StateSummaryTabs: React.FC<StateSummaryTabsProps> = ({
  districtResults,
  stateSummary,
}) => {
  const [activeTab, setActiveTab] = useState<"ZPTC" | "WARDS">("ZPTC");

  const handleExportCSV = () => {
    const csvContent = exportToCSV(districtResults, stateSummary);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sikkim_seat_reservation_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { key: "ZPTC", label: "ZPTC Summary", icon: BarChart3 },
    { key: "WARDS", label: "Wards Summary", icon: Map },
  ];

  const getResultByType = (
    result: DistrictReservationResult,
    type: "ZPTC" | "WARDS"
  ) => {
    return type === "ZPTC" ? result.zptc : result.wards;
  };

  const getStateResultByType = (type: "ZPTC" | "WARDS") => {
    return type === "ZPTC"
      ? stateSummary.zptcReservation
      : stateSummary.wardsReservation;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "ZPTC" | "WARDS")}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleExportCSV}
            className="hidden inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">
            District-wise {activeTab} Allocation
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    District
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    ST
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    OBC (C)
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    OBC (S)
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    SC
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    UR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districtResults.map((districtResult, index) => {
                  const bodyResult = getResultByType(districtResult, activeTab);

                  return (
                    <tr
                      key={districtResult.district.id}
                      className={`hover:bg-slate-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Map className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800">
                            {districtResult.district.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="inline-block px-2 py-1 bg-slate-700 text-white rounded-md text-sm font-medium">
                          {bodyResult.totalSeats}
                        </span>
                      </td>

                      {bodyResult.results.map((categoryResult) => (
                        <td
                          key={categoryResult.category}
                          className="py-3 px-4 text-right"
                        >
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                              CATEGORY_COLORS[categoryResult.category]
                            }`}
                          >
                            {categoryResult.roundedValue}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">
                State of Sikkim - {activeTab} Totals
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">
                    Total {activeTab} Seats:
                  </span>
                  <span className="text-2xl font-bold text-blue-800">
                    {getStateResultByType(activeTab).totalSeats}
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="text-sm text-blue-600 mb-2">
                    Reserved Seats Breakdown:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {getStateResultByType(activeTab).results.map(
                      (categoryResult) => (
                        <div
                          key={categoryResult.category}
                          className="flex justify-between"
                        >
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-xs ${
                              CATEGORY_COLORS[categoryResult.category]
                            }`}
                          >
                            {categoryResult.category}
                          </span>
                          <span className="font-medium text-blue-800">
                            {categoryResult.roundedValue}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">
                Calculation Summary
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Districts:</span>
                  <span className="font-medium text-slate-800">
                    {districtResults.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Reservation Categories:
                  </span>
                  <span className="font-medium text-slate-800">5</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Total Reserved %:</span>
                  <span className="font-medium text-slate-800">100%</span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-sm text-slate-600 mb-2">
                    Per-category percentages:
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        ST (Scheduled Tribe):
                      </span>
                      <span className="text-slate-800">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">OBC (C):</span>
                      <span className="text-slate-800">26%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">OBC (S):</span>
                      <span className="text-slate-800">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">
                        SC (Scheduled Caste):
                      </span>
                      <span className="text-slate-800">6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">UR (Unreserved):</span>
                      <span className="text-slate-800">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateSummaryTabs;
