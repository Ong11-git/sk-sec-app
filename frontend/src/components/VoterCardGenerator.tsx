import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Printer, X, CreditCard, RotateCw } from "lucide-react";
import Barcode from "react-barcode";
import "./Votercard.css";

interface VoterCardGeneratorProps {
  voter: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoterCardGenerator({
  voter,
  isOpen,
  onClose,
}: VoterCardGeneratorProps) {
  const [showBack, setShowBack] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !voter) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatGender = (gender: string | null | undefined) => {
    if (!gender) return "";
    if (gender.toLowerCase() === "male") return "पुरुष / Male";
    if (gender.toLowerCase() === "female") return "महिला / Female";
    if (gender.toLowerCase() === "other") return "अन्य / Other";
    return gender;
  };

  const renderAddressFields = () => {
    const fields = [];

    // Always show District
    if (voter.district?.name) {
      fields.push({
        label: "जिला / District:",
        value: voter.district.name,
      });
    }

    // Always show Constituency No and Name separately
    if (voter.constituency?.no) {
      fields.push({
        label: "Constituency No:",
        value: voter.constituency.no.toString(),
      });
    }

    if (voter.constituency?.name) {
      fields.push({
        label: "Constituency Name:",
        value: voter.constituency.name,
      });
    }

    // Always show T.C No and Name separately
    if (voter.tc?.no) {
      fields.push({
        label: "T.C No:",
        value: voter.tc.no,
      });
    }

    if (voter.tc?.name) {
      fields.push({
        label: "T.C Name:",
        value: voter.tc.name,
      });
    }

    // Always show GPU No and Name separately
    if (voter.gpu?.no) {
      fields.push({
        label: "GPU No:",
        value: voter.gpu.no,
      });
    }

    if (voter.gpu?.name) {
      fields.push({
        label: "GPU Name:",
        value: voter.gpu.name,
      });
    }

    // Always show Ward No and Name separately
    if (voter.ward?.no) {
      fields.push({
        label: "Ward No:",
        value: voter.ward.no,
      });
    }

    if (voter.ward?.name) {
      fields.push({
        label: "Ward Name:",
        value: voter.ward.name,
      });
    }

    // Always show Municipality if available
    if (voter.municipality?.name) {
      fields.push({
        label: "Municipality:",
        value: voter.municipality.name,
      });
    }

    // Always show Municipal Ward No and Name separately
    if (voter.municipal_ward?.no) {
      fields.push({
        label: "Municipal Ward No:",
        value: voter.municipal_ward.no,
      });
    }

    if (voter.municipal_ward?.name) {
      fields.push({
        label: "Municipal Ward Name:",
        value: voter.municipal_ward.name,
      });
    }

    return fields;
  };

  return (
    <div className="modal modal-open">
      <div
        className="modal-backdrop bg-black/60 print:hidden"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-box max-w-4xl p-0 overflow-hidden bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-6 py-2 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Voter Card Generator
                </h3>
                <p className="text-white/80 text-sm">
                  Generate & Download Voter ID Card
                </p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Preview Area */}
        <div className="p-0 bg-gradient-to-b from-gray-100  to-gray-200 ">
          {/* Toggle Button */}
          <div className="flex justify-center mb-3 print:hidden">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBack(!showBack)}
              className="btn btn-sm mt-2 bg-white shadow-md hover:shadow-lg 
               border-0 gap-2"
            >
              <RotateCw className="w-4 h-4 " />
              {showBack ? "Show Front Side" : "Show Back Side"}
            </motion.button>
          </div>

          {/* Cards Container */}
          <div
            className="perspective-container mx-auto"
            id="voter-card-print-area"
          >
            <div className={`card-flip-container ${showBack ? "flipped" : ""}`}>
              <div ref={frontCardRef} className="card-face card-front">
                <div
                  className="print-bg-fix relative overflow-hidden rounded-xl shadow-2xl print:shadow-lg"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url(/card/frontcard.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#d4c5f0",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(147, 51, 234, 0.03) 2px, rgba(147, 51, 234, 0.03) 4px)
          `,
                    }}
                  />

                  <div className="relative h-full p-5 md:p-6">
                    {/* Header - Fixed: Commission Info is now truly centered */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      {/* Left: Emblem Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src="/card/Seal_of_Sikkim_greyscale.png"
                          alt="Emblem of India"
                          className="h-14 w-14 object-contain grayscale md:h-16 md:w-16 print:grayscale-0"
                        />
                      </div>

                      {/* Center: Commission Info - Now properly centered */}
                      <div className="flex-1 text-center">
                        <h2 className="text-sm leading-tight font-bold text-gray-900 md:text-base print:text-black">
                          राज्य निर्वाचन आयोग, सिक्किम
                          <br />
                          <span className="font-semibold">
                            STATE ELECTION COMMISSION, SIKKIM
                          </span>
                        </h2>
                        <p className="mt-1 text-xs leading-tight font-medium text-gray-800 md:text-sm print:text-black">
                          मतदाता फोटो पहचान पत्र
                          <br />
                          <span className="font-normal">
                            ELECTOR PHOTO IDENTITY CARD
                          </span>
                        </p>
                      </div>

                      {/* Right: Logo space */}
                      <div className="flex-shrink-0">
                        <div className="flex h-full items-center justify-center">
                          <img
                            src="/card/seclogo.png"
                            alt="Emblem of India"
                            className="h-14 w-14 object-contain grayscale md:h-16 md:w-16 print:grayscale-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex gap-3 md:gap-4">
                      {/* Left Column - Photo & EPIC Numbers */}
                      <div className="flex-shrink-0">
                        {/* Static State EPIC Number - ABOVE PHOTO */}
                        <div className="mb-2">
                          <p className="text-xs font-bold text-gray-900 md:text-sm print:text-black">
                            State EPIC No.
                          </p>
                          <div className="rounded bg-gray-800 px-3 py-1.5 shadow-sm print:bg-black">
                            <p className="text-center text-sm font-bold text-white md:text-base">
                              SKGY0201010101
                            </p>
                          </div>
                        </div>

                        {/* User Photo */}
                        <div className="h-32 w-24 overflow-hidden rounded border-2 border-gray-700 bg-gray-300 shadow-md md:h-40 md:w-32 print:border-gray-800">
                          {voter.photo ? (
                            <img
                              src={voter.photo}
                              alt={voter.name}
                              className="h-full w-full object-cover print:object-contain"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-300 print:bg-gray-200">
                              <svg
                                className="h-16 w-16 text-gray-500 md:h-20 md:w-20 print:text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                              <span className="mt-1 text-xs text-gray-600 print:text-gray-700">
                                No Photo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Voter Details */}
                      <div className="flex-1 space-y-2 text-sm md:space-y-2.5 md:text-base">
                        <div>
                          <p className="text-xs text-gray-700 md:text-sm print:text-gray-800">
                            नाम / Name:
                          </p>
                          <p className="text-base font-bold text-gray-900 md:text-lg print:text-black">
                            {voter.name || "N/A"}
                          </p>
                        </div>

                        {voter.relationName && (
                          <div>
                            <p className="text-xs text-gray-700 md:text-sm print:text-gray-800">
                              {voter.relationType ||
                                "पिता का नाम / Father's Name"}
                              :
                            </p>
                            <p className="text-sm font-semibold text-gray-900 md:text-base print:text-black">
                              {voter.relationName}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4">
                          {voter.gender && (
                            <div>
                              <p className="text-xs text-gray-700 md:text-sm print:text-gray-800">
                                लिंग / Gender:
                              </p>
                              <p className="text-sm font-semibold text-gray-900 md:text-base print:text-black">
                                {formatGender(voter.gender)}
                              </p>
                            </div>
                          )}

                          {voter.age && (
                            <div>
                              <p className="text-xs text-gray-700 md:text-sm print:text-gray-800">
                                आयु / Age:
                              </p>
                              <p className="text-sm font-semibold text-gray-900 md:text-base print:text-black">
                                {voter.age}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-700 md:text-sm print:text-gray-800">
                            Epic No:
                          </p>
                          <p className="text-sm font-semibold text-gray-900 md:text-base print:text-black">
                            {voter.epicNo || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Right: Official Seal */}
                    <div className="absolute right-3 bottom-16 flex flex-col items-end gap-1 md:right-4 md:bottom-20">
                      <div className="print:backdrop-blur-0 rounded-lg bg-white/90 p-1.5 shadow-md backdrop-blur-sm print:bg-white print:shadow-sm">
                        <img
                          src="/card/sky-blue-color-sikkim-map-political-administrative-map-sikkim-with-districts_622214-763.avif"
                          alt="Official Logo"
                          className="h-10 w-auto object-contain md:h-12"
                        />
                      </div>

                      <div className="rounded bg-black/70 px-2 py-0.5 print:bg-black print:opacity-100">
                        <p className="text-[9px] font-semibold text-white md:text-[10px]">
                          OFFICIAL SEAL
                        </p>
                      </div>
                    </div>

                    {/* Bottom Right: Barcode */}
                    <div className="absolute right-3 bottom-3 rounded bg-white p-1 shadow-md md:right-4 md:bottom-4 print:bg-white print:shadow-sm">
                      <Barcode
                        value={voter.epicNo || "000000"}
                        height={28}
                        width={1.2}
                        fontSize={9}
                        displayValue={false}
                      />
                    </div>

                    {/* Side EPIC Number */}
                    <div className="absolute top-1/2 right-1 -translate-y-1/2 rotate-90 transform">
                      <p className="text-xs font-bold tracking-wider whitespace-nowrap text-gray-800 md:text-sm print:text-black">
                        {voter.epicNo || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div ref={backCardRef} className="card-face card-back">
                <div
                  className="print-bg-fix relative overflow-hidden rounded-xl shadow-2xl print:shadow-lg"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url(/card/backcard.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#f5d7a8",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `
            radial-gradient(circle at 70% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)
          `,
                    }}
                  />

                  <div className="relative h-full p-4 md:p-5">
                    {/* Header with logo and commission name */}
                    <div className="mb-3 flex items-center justify-center gap-2 md:gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src="/card/Seal_of_Sikkim_greyscale.png"
                          alt="Sikkim Seal"
                          className="h-10 w-10 object-contain grayscale md:h-12 md:w-12 print:grayscale-0"
                        />
                      </div>
                      <div className="text-center">
                        <h2 className="text-xs leading-tight font-bold text-gray-900 md:text-sm print:text-black">
                          सिक्किम राज्य निर्वाचन आयोग
                          <br />
                          <span className="font-semibold">
                            STATE ELECTION COMMISSION, SIKKIM
                          </span>
                        </h2>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex h-[calc(100%-10rem)] gap-3 md:gap-4">
                      {/* Left: Barcode Section */}
                      <div className="w-32 flex-shrink-0 md:w-36">
                        <div className="rounded border-2 border-gray-700 bg-white p-3 shadow-md print:border-gray-800 print:bg-white">
                          <div className="flex h-28 w-full items-center justify-center md:h-32">
                            <Barcode
                              value={voter.epicNo || "000000"}
                              format="CODE128"
                              height={80}
                              width={1.3}
                              fontSize={9}
                              margin={4}
                            />
                          </div>
                        </div>
                        <div className="mt-3 mb-6 text-center">
                          <p className="text-xs font-bold text-gray-800 md:text-sm print:text-black">
                            EPIC No.
                          </p>
                          <p className="text-lg font-bold text-gray-900 md:text-xl print:text-black">
                            {voter.epicNo || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Right: Address Details */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-sm font-bold text-gray-800 md:text-base print:text-black">
                            Address Details / पता विवरण
                          </h3>
                        </div>

                        {/* 3-Column Address Grid - ALWAYS show all 3 columns */}
                        <div className="grid grid-cols-3 gap-x-2 gap-y-1 md:gap-x-3">
                          {(() => {
                            const addressFields = renderAddressFields();
                            const distributeFields = () => {
                              const columns: Array<
                                Array<{ label: string; value: string }>
                              > = [[], [], []];
                              addressFields.forEach((field, index) => {
                                const columnIndex = index % 3;
                                columns[columnIndex].push(field);
                              });
                              return columns;
                            };
                            const [column1, column2, column3] =
                              distributeFields();
                            return (
                              <>
                                {/* Column 1 */}
                                <div>
                                  {column1.map((field, index) => (
                                    <div key={index} className="mb-2">
                                      <p className="text-[9px] leading-tight font-semibold text-gray-700 md:text-[10px] print:text-gray-800">
                                        {field.label}
                                      </p>
                                      <p className="text-[11px] leading-tight font-bold text-gray-900 md:text-xs print:text-black">
                                        {field.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {/* Column 2 */}
                                <div>
                                  {column2.map((field, index) => (
                                    <div key={index} className="mb-2">
                                      <p className="text-[9px] leading-tight font-semibold text-gray-700 md:text-[10px] print:text-gray-800">
                                        {field.label}
                                      </p>
                                      <p className="text-[11px] leading-tight font-bold text-gray-900 md:text-xs print:text-black">
                                        {field.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {/* Column 3 */}
                                <div>
                                  {column3.map((field, index) => (
                                    <div key={index} className="mb-2">
                                      <p className="text-[9px] leading-tight font-semibold text-gray-700 md:text-[10px] print:text-gray-800">
                                        {field.label}
                                      </p>
                                      <p className="text-[11px] leading-tight font-bold text-gray-900 md:text-xs print:text-black">
                                        {field.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="absolute right-4 bottom-8 left-4 border-t-2 border-gray-700/30 pt-1 md:bottom-12">
                      <div className="mb-1">
                        <p className="text-xs text-gray-700 italic md:text-sm print:text-gray-800">
                          Signature / हस्ताक्षर
                        </p>
                        <div className="mt-1 h-4">
                          <svg viewBox="0 0 200 30" className="h-full w-auto">
                            <path
                              d="M10 15 Q 30 10, 50 15 T 90 15 Q 110 18, 130 15 T 170 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-gray-600 print:text-gray-800"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute right-3 bottom-3 left-3 flex flex-col items-center justify-between gap-1 text-xs font-medium text-gray-900 sm:flex-row md:bottom-4 md:text-sm print:text-gray-800">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="font-semibold">
                          Helpline: 1800-1234-5678
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>www.sec.sikkim.gov.in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-5 print:hidden">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className=" mb-2 btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0  gap-2"
            >
              <Printer className="w-4 h-4 " />
              Print Card
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50   border-t border-gray-200 print:hidden">
          <p className="text-xs text-gray-500 text-center ">
            © 2026 State Election Commission, Sikkim • Official Voter ID Card
            Generator
          </p>
        </div>
      </motion.div>
    </div>
  );
}
