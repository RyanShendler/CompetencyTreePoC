import { useState } from "react";
import CompetencyDirectory from "./components/CompetencyDirectory";
import CreateNewCompetency from "./components/CreateNewCompetency";
import CompetencyComposition from "./components/CompetencyComposition";
import CreateNewKnowledge from "./components/CreateNewKnowledge";

const navigation = [
  { name: "Create New Knowledge" },
  { name: "View/Edit Competencies" },
  { name: "Create New Competency" },
  { name: "Competency Composition" },
];

function App() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-row w-screen h-screen bg-gray-100 p-4">
      <div className="w-1/4 h-full flex flex-col items-center rounded-md border border-gray-500">
        {navigation.map((nav, i) => {
          return (
            <div
              className={`cursor-pointer py-1 w-full text-center border-b border-gray-500 hover:bg-gray-200 ${
                current === i ? "bg-gray-300" : ""
              }`}
              key={i}
              onClick={() => setCurrent(i)}
            >
              {nav.name}
            </div>
          );
        })}
      </div>
      <div className="w-3/4 h-full flex flex-col ml-4">
        {current === 0 && <CreateNewKnowledge />}
        {current === 1 && <CompetencyDirectory />}
        {current === 2 && <CreateNewCompetency />}
        {current === 3 && <CompetencyComposition />}
      </div>
    </div>
  );
}

export default App;
