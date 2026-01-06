import React from "react";
import { Settings, MapPin } from "lucide-react";
import type { ScopeType, DistrictConfig } from "../../types/reservationTypes";
import { getDistrictOptions } from "../../data/reservationData";

interface SeatReservationFormProps {
  scope: ScopeType;
  selectedDistrict: string;
  onScopeChange: (scope: ScopeType) => void;
  onDistrictChange: (districtId: string) => void;
  districtData?: DistrictConfig | null;
}

const SeatReservationForm: React.FC<SeatReservationFormProps> = ({
  scope,
  selectedDistrict,
  onScopeChange,
  onDistrictChange,
  districtData,
}) => {
  const districtOptions = getDistrictOptions();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            Calculation Scope
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="district-wise"
              checked={scope === "district-wise"}
              onChange={(e) => onScopeChange(e.target.value as ScopeType)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-slate-700">District-wise Analysis</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="state-total"
              checked={scope === "state-total"}
              onChange={(e) => onScopeChange(e.target.value as ScopeType)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-slate-700">State Total Summary</span>
          </label>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-md">
          <p className="text-sm text-slate-600">
            {scope === "district-wise"
              ? "Analyze seat allocation for individual districts in Sikkim"
              : "View aggregated seat allocation across all districts in Sikkim"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            {scope === "district-wise"
              ? "Select District"
              : "District Information"}
          </h3>
        </div>

        {scope === "district-wise" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="district-select"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                District
              </label>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select a district...</option>
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {districtData && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-md border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">
                  {districtData.name} Overview
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-emerald-600 font-medium">ZPTC:</span>
                    <span className="ml-1 text-emerald-800">
                      {districtData.zptcSeats}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">GPU:</span>
                    <span className="ml-1 text-emerald-800">
                      {districtData.gpuSeats}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-medium">Wards:</span>
                    <span className="ml-1 text-emerald-800">
                      {districtData.wards}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-md border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                State of Sikkim Totals
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">122</div>
                  <div className="text-blue-800">Total ZPTC</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">197</div>
                  <div className="text-blue-800">Total GPU</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,147</div>
                  <div className="text-blue-800">Total Wards</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-600 space-y-1">
              <p>
                • Aggregated data from 6 districts: Gyalshing, Soreng, Namchi,
                Gangtok, Pakyong, and Mangan
              </p>
              <p>• Includes DZUMSA allocations where applicable</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatReservationForm;
