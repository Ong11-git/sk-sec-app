import type { ChartCardProps } from "../types";

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-base-100 rounded-lg shadow-md p-4 lg:p-6">
    <h3 className="text-base lg:text-lg font-semibold text-base-content mb-4">
      {title}
    </h3>
    {children}
  </div>
);

export default ChartCard;
