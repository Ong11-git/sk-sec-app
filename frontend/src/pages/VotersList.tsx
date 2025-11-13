
import VotersTable from "../components/VotersTable";
const VotersList: React.FC = () => (
  <div className="p-4 lg:p-6">
    {/* <div className="mb-6 lg:mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-base-content mb-2">
        Voters List
      </h1>
      <p className="text-base-content/70 text-sm lg:text-base">
        Registered voters from Sikkim
      </p>
    </div> */}
    {/* <div className="lg:hidden space-y-4">
         <VotersTable/>
    </div> */}
    <VotersTable/>
  </div>
);

export default VotersList;
