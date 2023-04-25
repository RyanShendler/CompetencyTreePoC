import { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GetAllCompetencies, GetCompetencyTree } from "../graphql/competencies";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { formatTalentTreeData } from "../lib/talentTreeLib";
import TalentTreeLayerNode from "./nodes/TalentTreeLayerNode";
import TalentTreeKnowledgeNode from "./nodes/TalentTreeKnowledgeNode";
import TalentTreeCompNode from "./nodes/TalentTreeCompNode";

const TalentTree = () => {
  const nodesTypes = useMemo(() => ({ layer: TalentTreeLayerNode, knowledge: TalentTreeKnowledgeNode, comp: TalentTreeCompNode }), []);
  const [open, setOpen] = useState(true);
  const [selectedComp, setSelectedComp] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { data: compData } = useQuery(GetAllCompetencies);
  const [getCompetencyTree, { data: treeData, called }] =
    useLazyQuery(GetCompetencyTree);

  const initializeGraph = () => {
    getCompetencyTree({
      variables: {
        rootId: selectedComp,
      },
    });
    setOpen(false);
  };

  useEffect(() => {
    if (!called || !treeData) return;
    const { nodes: formattedNodes, edges: formattedEdges } =
      formatTalentTreeData(treeData.getCompetencyTree);
    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [treeData, called, setNodes, setEdges]);

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
                  <h3 className="font-medium">Choose a Talent Tree to View</h3>
                  <div className="w-full flex flex-row space-x-4 items-center mt-4 justify-between">
                    <label className="text-sm font-medium">
                      Talent Tree
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
          nodeTypes={nodesTypes}
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

export default TalentTree;
