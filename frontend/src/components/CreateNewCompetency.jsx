import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateNewCompetency = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [open, setOpen] = useState(true);
  const [compName, setCompName] = useState("");

  const initializeGraph = useCallback(() => {
    setNodes([
      {
        id: uuidv4(),
        position: { x: 0, y: 0 },
        type: "input",
        data: {
          label: compName,
          type: "Competency",
        },
      },
    ]);
    setEdges([]);
    setOpen(false);
  }, [setEdges, setNodes, setOpen, compName]);

  return (
    <>
      <div className="flex flex-col space-y-2 w-full h-full">
        <div className="relative w-full h-full justify-center rounded-md border border-black overflow-clip">
          {open && (
            <div className="absolute z-10 inset-0 bg-black/50 flex flex-col items-center justify-center">
              <div className="rounded-md bg-white p-4 flex flex-col items-center">
                <h3 className="font-medium">Choose a Name for the Competency</h3>
                <div className="w-full flex flex-row space-x-4 items-center mt-4 justify-between">
                  <label className="text-sm font-medium">
                    Name
                    <input
                      className="ml-2 text-base font-normal p-1 rounded-md border border-black/50"
                      value={compName}
                      onChange={(e) => setCompName(e.target.value)}
                    />
                  </label>
                  <button
                    className="rounded-md text-white py-1 px-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800"
                    disabled={!compName}
                    onClick={() => initializeGraph()}
                  >
                    Confirm
                  </button>
                </div>
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
            <Panel position="top-left" className="p-2 flex flex-col items-center border border-black rounded-md bg-white">
                <button className="rounded-md bg-slate-600 text-white py-1 px-3 hover:bg-slate-500">Add Layer</button>
            </Panel>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </>
  );
};

export default CreateNewCompetency;
