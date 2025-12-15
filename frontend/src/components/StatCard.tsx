import type { StatCardProps } from "../types";
import { motion } from "framer-motion";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  colorClass,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${colorClass}`}
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
        <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default StatCard;
