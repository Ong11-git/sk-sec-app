import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Printer,
  X,
  User,
  MapPin,
  Calendar,
  CreditCard,
  RotateCw,
} from "lucide-react";
import html2canvas from "html2canvas";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !voter) return null;

  const handleDownload = async (side: "front" | "back" | "both") => {
    setIsGenerating(true);
    try {
      if (side === "front" || side === "both") {
        if (frontCardRef.current) {
          const canvas = await html2canvas(frontCardRef.current, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
          });
          const link = document.createElement("a");
          link.download = `voter-card-front-${voter.epicNo}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }
      if (side === "back" || side === "both") {
        if (backCardRef.current) {
          const canvas = await html2canvas(backCardRef.current, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,
          });
          const link = document.createElement("a");
          link.download = `voter-card-back-${voter.epicNo}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      }
    } catch (error) {
      console.error("Error generating card:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("voter-card-print-area");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Voter Card - ${voter.epicNo}</title>
              <style>
                @page { size: 85.6mm 53.98mm; margin: 0; }
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .card-container { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
                .card { width: 340px; height: 214px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-backdrop bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="modal-box max-w-4xl p-0 overflow-hidden bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#061E47] to-[#0A2B6B] px-6 py-4">
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
        <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200">
          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBack(!showBack)}
              className="btn btn-sm bg-white shadow-md hover:shadow-lg border-0 gap-2"
            >
              <RotateCw className="w-4 h-4" />
              {showBack ? "Show Front Side" : "Show Back Side"}
            </motion.button>
          </div>

          {/* Cards Container */}
          <div
            id="voter-card-print-area"
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            {/* Front Card */}
            <motion.div
              initial={false}
              animate={{
                rotateY: showBack ? 180 : 0,
                opacity: showBack ? 0 : 1,
              }}
              transition={{ duration: 0.6 }}
              className={showBack ? "hidden" : "block"}
            >
              <div
                ref={frontCardRef}
                className="w-[340px] h-[214px] rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #1a365d 100%)",
                }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2" />

                <div className="p-4 text-white">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                          alt="Emblem"
                          className="w-8 h-8 object-contain"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <p className="text-[8px] font-medium opacity-80">
                          STATE ELECTION COMMISSION
                        </p>
                        <p className="text-xs font-bold">SIKKIM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-medium opacity-80">
                        VOTER ID CARD
                      </p>
                      <p className="text-xs font-bold tracking-wider">
                        EPIC: {voter.epicNo}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex gap-3">
                    {/* Photo */}
                    <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border-2 border-white/30">
                      {voter.photo ? (
                        <img
                          src={voter.photo}
                          alt={voter.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-[10px] space-y-1">
                      <div>
                        <p className="opacity-70">Name</p>
                        <p className="font-bold text-sm truncate">
                          {voter.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div>
                          <p className="opacity-70">
                            {voter.relationType || "Father"}'s Name
                          </p>
                          <p className="font-semibold truncate">
                            {voter.relationName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="opacity-70">Gender</p>
                          <p className="font-semibold">
                            {voter.gender || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div>
                          <p className="opacity-70">Age</p>
                          <p className="font-semibold">
                            {voter.age ? `${voter.age} Years` : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="opacity-70">Category</p>
                          <p className="font-semibold">
                            {voter.casteCategory || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[8px]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[180px]">
                        {voter.district?.name || "Sikkim"},{" "}
                        {voter.constituency?.name || ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[8px]">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(voter.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back Card */}
            <motion.div
              initial={false}
              animate={{
                rotateY: showBack ? 0 : -180,
                opacity: showBack ? 1 : 0,
              }}
              transition={{ duration: 0.6 }}
              className={showBack ? "block" : "hidden"}
            >
              <div
                ref={backCardRef}
                className="w-[340px] h-[214px] rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #1a365d 100%)",
                }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-2" />

                <div className="p-4 text-white h-[calc(100%-8px)] flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-3">
                    <p className="text-xs font-bold">VOTER DETAILS (BACK)</p>
                    <p className="text-[8px] opacity-80">
                      EPIC: {voter.epicNo}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                    <div>
                      <p className="opacity-70">State EPIC No.</p>
                      <p className="font-semibold">
                        {voter.stateEpicNo || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-70">Status</p>
                      <p className="font-semibold capitalize">
                        {voter.status || "Active"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-70">Country</p>
                      <p className="font-semibold">
                        {voter.country || "India"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-70">State</p>
                      <p className="font-semibold">{voter.state || "Sikkim"}</p>
                    </div>
                    <div>
                      <p className="opacity-70">District</p>
                      <p className="font-semibold">
                        {voter.district?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-70">Constituency</p>
                      <p className="font-semibold truncate">
                        {voter.constituency?.name || "N/A"}
                      </p>
                    </div>
                    {voter.tc && (
                      <div>
                        <p className="opacity-70">TC</p>
                        <p className="font-semibold truncate">
                          {voter.tc.tc_name}
                        </p>
                      </div>
                    )}
                    {voter.gpu && (
                      <div>
                        <p className="opacity-70">GPU</p>
                        <p className="font-semibold truncate">
                          {voter.gpu.gpu_name}
                        </p>
                      </div>
                    )}
                    {voter.ward && (
                      <div>
                        <p className="opacity-70">Ward</p>
                        <p className="font-semibold">{voter.ward.ward_name}</p>
                      </div>
                    )}
                    {voter.municipality && (
                      <div>
                        <p className="opacity-70">Municipality</p>
                        <p className="font-semibold truncate">
                          {voter.municipality.name}
                        </p>
                      </div>
                    )}
                    {voter.municipalWard && (
                      <div>
                        <p className="opacity-70">Municipal Ward</p>
                        <p className="font-semibold">
                          {voter.municipalWard.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* QR Code Area & Footer */}
                  <div className="mt-auto pt-2 border-t border-white/20 flex items-center justify-between">
                    <div className="w-14 h-14 bg-white rounded p-1 flex items-center justify-center">
                      {/* Placeholder QR Code */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect
                          x="10"
                          y="10"
                          width="20"
                          height="20"
                          fill="#1a365d"
                        />
                        <rect
                          x="40"
                          y="10"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="60"
                          y="10"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="70"
                          y="10"
                          width="20"
                          height="20"
                          fill="#1a365d"
                        />
                        <rect
                          x="10"
                          y="40"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="30"
                          y="40"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="50"
                          y="40"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="80"
                          y="40"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="10"
                          y="70"
                          width="20"
                          height="20"
                          fill="#1a365d"
                        />
                        <rect
                          x="40"
                          y="60"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="60"
                          y="70"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="80"
                          y="70"
                          width="10"
                          height="10"
                          fill="#1a365d"
                        />
                        <rect
                          x="40"
                          y="80"
                          width="20"
                          height="10"
                          fill="#1a365d"
                        />
                      </svg>
                    </div>
                    <div className="text-right text-[8px]">
                      <p className="opacity-70">Issued by</p>
                      <p className="font-bold">
                        State Election Commission, Sikkim
                      </p>
                      <p className="opacity-70 mt-1">
                        Updated: {formatDate(voter.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload("front")}
              disabled={isGenerating}
              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Front
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload("back")}
              disabled={isGenerating}
              className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-0 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload("both")}
              disabled={isGenerating}
              className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-0 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Both
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0 gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2024 State Election Commission, Sikkim • Official Voter ID Card
            Generator
          </p>
        </div>
      </motion.div>
    </div>
  );
}
