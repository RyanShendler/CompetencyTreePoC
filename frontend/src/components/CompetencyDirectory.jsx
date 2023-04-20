import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { GetAllCompetencies, GetCompetencyTree } from "../graphql/competencies";
import { formatTreeData } from "../lib/lib";

const CompetencyDirectory = () => {
  const [open, setOpen] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedComp, setSelectedComp] = useState("");
  const { data: compData } = useQuery(GetAllCompetencies);
  const [getCompetencyTree, {data: treeData}] = useLazyQuery(GetCompetencyTree);

  const initializeGraph = () => {
    getCompetencyTree({variables: {
      rootId: selectedComp
    }})
    setOpen(false)
  }

  useEffect(() => {
    if(!treeData) return;
    const {nodes: formattedNodes, edges: formattedEdges} = formatTreeData(treeData.getCompetencyTree)
    setNodes(formattedNodes)
    setEdges(formattedEdges)
  }, [treeData, setNodes, setEdges])

  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      <div className="relative w-full h-full justify-center rounded-md border border-black overflow-clip">
        {open && (
          <div className="absolute z-10 inset-0 bg-black/50 flex flex-col items-center justify-center">
            <div className="rounded-md bg-white p-4 flex flex-col items-center">
              {!compData ? (
                <span>Loading...</span>
              ) : (
                <>
                  <h3 className="font-medium">Choose a Competency to Edit</h3>
                  <div className="w-full flex flex-row space-x-4 items-center mt-4 justify-between">
                    <label className="text-sm font-medium">
                      Competency
                      <select
                        className="ml-2 text-base font-normal p-1 rounded-md border border-black/50"
                        value={selectedComp}
                        onChange={(e) => setSelectedComp(e.target.value)}
                      >
                        <option />
                        {compData?.competencies?.map((comp, i) => {
                          return (
                            <option key={i} value={comp.id}>
                              {comp.name}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    <button
                      className="rounded-md text-white py-1 px-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
                      disabled={!selectedComp}
                      onClick={() => initializeGraph()}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CompetencyDirectory;
