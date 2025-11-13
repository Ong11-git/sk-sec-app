import type { StatCardProps } from "../types";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  colorClass,
}) => (
  <div
    className={`bg-base-100 rounded-md shadow-sm p-2 lg:p-3 border-l-2 ${colorClass}`} // smaller padding + border
  >
    <div className="flex flex-col lg:flex-row lg:items-center">
      <div className="h-4 w-4 lg:h-5 lg:w-5 mb-1 lg:mb-0">{icon}</div> {/* smaller icon */}
      <div className="lg:ml-2">
        <p className="text-[10px] lg:text-xs font-medium text-base-content/60">
          {title}
        </p>
        <p className="text-sm lg:text-base font-bold text-base-content">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default StatCard;
