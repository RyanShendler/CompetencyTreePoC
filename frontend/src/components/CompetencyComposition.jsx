import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { GetCompetencyComposition } from "../graphql/competencies";
import { formatCompositionData } from "../lib/compositionLib";

const CompetencyComposition = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { data } = useQuery(GetCompetencyComposition);

  useEffect(() => {
    if (!data) return;
    const {nodes: formattedNodes, edges: formattedEdges} = formatCompositionData(data.getCompetencyComposition) 
    setNodes(formattedNodes);
    setEdges(formattedEdges)
  }, [data, setNodes, setEdges]);

  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      <div className="w-full h-full justify-center rounded-md border border-black overflow-clip">
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

export default CompetencyComposition;
