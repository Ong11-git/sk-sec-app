import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Terminal, Copy, Download } from "lucide-react";
import type {
  DistrictConfig,
  ReservationCategory,
  BodyReservationResult,
} from "../../types/reservationTypes";
import { calcReservationForBody } from "../../utils/reservationCalc";

interface CalculationStep {
  id: string;
  timestamp: string;
  type: "info" | "calculation" | "result" | "warning" | "success" | "error";
  message: string;
  data?: any;
}

interface TerminalCalculationProps {
  districtData: DistrictConfig;
  categories: ReservationCategory[];
  onCalculationComplete?: (results: {
    zptc: BodyReservationResult;
    wards: BodyReservationResult;
  }) => void;
}

const TerminalCalculation: React.FC<TerminalCalculationProps> = ({
  districtData,
  categories,
  onCalculationComplete,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<CalculationStep[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addStep = (
    type: CalculationStep["type"],
    message: string,
    data?: any
  ) => {
    const newStep: CalculationStep = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data,
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [steps]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startCalculation = async () => {
    setIsRunning(true);
    setSteps([]);

    try {
      addStep("info", "=".repeat(60));
      addStep("info", "🏛️  SIKKIM SEAT RESERVATION CALCULATOR");
      addStep("info", "=".repeat(60));
      await sleep(500);

      addStep("info", `📍 Processing District: ${districtData.name}`);
      await sleep(300);

      addStep("info", `📊 District Data:`);
      addStep("info", `   • ZPTC Seats: ${districtData.zptcSeats}`);
      addStep("info", `   • GPU Seats: ${districtData.gpuSeats}`);
      addStep("info", `   • Ward Seats: ${districtData.wards}`);
      await sleep(800);

      const mainCategories = categories.filter((cat) => !cat.parentCategory);
      addStep("info", `🏷️  Reservation Categories (${mainCategories.length}):`);
      await sleep(400);

      for (const cat of mainCategories) {
        addStep("info", `   • ${cat.label}: ${cat.percentage}%`);
        await sleep(200);
      }

      addStep("calculation", "");
      addStep("calculation", "🔢 Starting ZPTC Calculation...");
      addStep("calculation", "-".repeat(40));
      await sleep(600);

      for (const category of mainCategories) {
        const rawValue = districtData.zptcSeats * (category.percentage / 100);
        const roundedValue = Math.round(rawValue);

        addStep("calculation", `${category.label} (${category.percentage}%):`);
        addStep(
          "calculation",
          `   Formula: ${districtData.zptcSeats} × (${category.percentage}/100)`
        );
        addStep("calculation", `   Raw: ${rawValue.toFixed(4)}`);
        addStep("calculation", `   Rounded: ${roundedValue}`);
        addStep(
          "calculation",
          `   Residual: ${(rawValue - roundedValue).toFixed(4)}`
        );
        addStep("calculation", "");
        await sleep(800);
      }

      const zptcResult = calcReservationForBody(
        districtData.zptcSeats,
        mainCategories,
        "ZPTC"
      );

      addStep("result", `✅ ZPTC Allocation Complete:`);
      zptcResult.results.forEach((result) => {
        addStep(
          "result",
          `   ${result.category}: ${result.roundedValue} seats`
        );
      });

      if (zptcResult.adjustedCategory) {
        addStep(
          "warning",
          `⚠️  Rounding adjustment applied to ${zptcResult.adjustedCategory}`
        );
      }
      await sleep(1000);

      addStep("calculation", "");
      addStep("calculation", "🏘️  Starting Wards Calculation...");
      addStep("calculation", "-".repeat(40));
      await sleep(600);

      for (const category of mainCategories) {
        const rawValue = districtData.wards * (category.percentage / 100);
        const roundedValue = Math.round(rawValue);

        addStep("calculation", `${category.label} (${category.percentage}%):`);
        addStep(
          "calculation",
          `   Formula: ${districtData.wards} × (${category.percentage}/100)`
        );
        addStep("calculation", `   Raw: ${rawValue.toFixed(4)}`);
        addStep("calculation", `   Rounded: ${roundedValue}`);
        addStep(
          "calculation",
          `   Residual: ${(rawValue - roundedValue).toFixed(4)}`
        );
        addStep("calculation", "");
        await sleep(800);
      }

      const wardsResult = calcReservationForBody(
        districtData.wards,
        mainCategories,
        "WARDS"
      );

      addStep("result", `✅ Wards Allocation Complete:`);
      wardsResult.results.forEach((result) => {
        addStep(
          "result",
          `   ${result.category}: ${result.roundedValue} seats`
        );
      });

      if (wardsResult.adjustedCategory) {
        addStep(
          "warning",
          `⚠️  Rounding adjustment applied to ${wardsResult.adjustedCategory}`
        );
      }
      await sleep(1000);

      addStep("success", "");
      addStep("success", "🎉 CALCULATION COMPLETED SUCCESSFULLY!");
      addStep("success", "=".repeat(60));
      addStep("success", "📋 FINAL SUMMARY:");
      addStep("success", "");
      addStep(
        "success",
        `🏛️  ${districtData.name} District - ZPTC (${zptcResult.totalSeats} total):`
      );
      zptcResult.results.forEach((result) => {
        const percentage = (
          (result.roundedValue / zptcResult.totalSeats) *
          100
        ).toFixed(1);
        addStep(
          "success",
          `   ${result.category}: ${result.roundedValue} seats (${percentage}%)`
        );
      });

      addStep("success", "");
      addStep(
        "success",
        `🏘️  ${districtData.name} District - Wards (${wardsResult.totalSeats} total):`
      );
      wardsResult.results.forEach((result) => {
        const percentage = (
          (result.roundedValue / wardsResult.totalSeats) *
          100
        ).toFixed(1);
        addStep(
          "success",
          `   ${result.category}: ${result.roundedValue} seats (${percentage}%)`
        );
      });

      addStep("success", "");
      addStep(
        "success",
        `💾 Calculation completed at ${new Date().toLocaleString()}`
      );
      addStep("success", "=".repeat(60));

      if (onCalculationComplete) {
        onCalculationComplete({ zptc: zptcResult, wards: wardsResult });
      }
    } catch (error) {
      addStep(
        "error",
        `❌ Error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearTerminal = () => {
    setSteps([]);
  };

  const copyOutput = () => {
    const output = steps
      .map((step) => `[${step.timestamp}] ${step.message}`)
      .join("\n");
    navigator.clipboard.writeText(output);
  };

  const downloadLog = () => {
    const output = steps
      .map(
        (step) =>
          `[${step.timestamp}] [${step.type.toUpperCase()}] ${step.message}`
      )
      .join("\n");
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seat_calculation_${districtData.name}_${
      new Date().toISOString().split("T")[0]
    }.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStepColor = (type: CalculationStep["type"]) => {
    switch (type) {
      case "info":
        return "text-blue-400";
      case "calculation":
        return "text-yellow-400";
      case "result":
        return "text-purple-400";
      case "warning":
        return "text-orange-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStepIcon = (type: CalculationStep["type"]) => {
    switch (type) {
      case "info":
        return "ℹ️";
      case "calculation":
        return "🔢";
      case "result":
        return "📊";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "•";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Live Calculation Terminal
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={startCalculation}
              disabled={isRunning}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                isRunning
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-1" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Calculate
                </>
              )}
            </button>

            {steps.length > 0 && (
              <>
                <button
                  onClick={copyOutput}
                  className="hidden inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>

                <button
                  onClick={downloadLog}
                  className="hidden inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>

                <button
                  onClick={clearTerminal}
                  className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-slate-600 text-sm mt-2">
          Click "Calculate" to see live step-by-step seat allocation calculation
          for {districtData.name}
        </p>
      </div>

      <div
        ref={terminalRef}
        className="bg-gray-900 text-green-400 font-mono text-sm p-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {steps.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              Terminal ready. Click "Calculate" to begin seat reservation
              calculation...
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start space-x-2">
                <span className="text-gray-500 text-xs mt-1">
                  {step.timestamp}
                </span>
                <span className={`${getStepColor(step.type)} min-w-0 flex-1`}>
                  {step.type !== "calculation" || step.message ? (
                    <span className="inline-block mr-2 text-xs">
                      {getStepIcon(step.type)}
                    </span>
                  ) : null}
                  <span className="break-words">{step.message}</span>
                </span>
              </div>
            ))}

            {isRunning && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <span className="text-gray-500 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="animate-pulse">🔄 Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Steps: {steps.length} | Status: {isRunning ? "Running" : "Ready"}
          </span>
          {steps.length > 0 && (
            <span>Last updated: {steps[steps.length - 1]?.timestamp}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalCalculation;
