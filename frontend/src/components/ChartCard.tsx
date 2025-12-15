import type { ChartCardProps } from "../types";
import { motion } from "framer-motion";

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-5"
  >
    <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </motion.div>
);

export default ChartCard;
