import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  AddKnowledgeToTree,
  MergeCompetency,
  GetCompetencyTree,
} from "../graphql/competencies";
import { createNewLayer, formatTreeData } from "../lib/lib";
import LayerNode from "./nodes/LayerNode";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { toggleAddKnowledge } from "../redux/addKnowledgeSlice";
import { GetAllKnowledge } from "../graphql/knowledge";

const CreateNewCompetency = () => {
  const nodeTypes = useMemo(() => ({ layer: LayerNode }), []);
  const { open: addKnowledgeOpen, layerNum: addKnowledgeLayer } = useSelector(
    (state) => state.addKnowledge
  );
  const dispatch = useDispatch();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [knowledgeInput, setKnowledgeInput] = useState("");
  const [prereqs, setPrereqs] = useState([]);
  const [prereqInput, setPrereqInput] = useState("");
  const [open, setOpen] = useState(true);
  const [compName, setCompName] = useState("");
  const [compId, setCompId] = useState("");
  const [levels, setLevels] = useState([]);

  const { data: knowledgeData } = useQuery(GetAllKnowledge, {
    variables: {
      sort: [
        {
          name: "ASC",
        },
      ],
    },
  });
  const [getCompTree, { called, data }] = useLazyQuery(GetCompetencyTree);
  const [mergeCompetency] = useMutation(MergeCompetency, {
    refetchQueries: ["GetAllCompetencies"],
  });
  const [addKnowledgetoTree] = useMutation(AddKnowledgeToTree, {
    refetchQueries: ["GetCompetencyTree"],
  });

  const initializeGraph = useCallback(() => {
    const id = uuidv4();
    const { nodes: formattedNodes, edges: formattedEdges } = formatTreeData([
      {
        name: compName,
        id: id,
        type: "Competency",
        level: 0,
        parent: null,
        description: "",
      },
    ]);
    setNodes(formattedNodes);
    setEdges(formattedEdges);
    setOpen(false);
    setCompId(id);
    setPrereqInput(id);
  }, [setEdges, setNodes, setOpen, compName]);

  const addLayer = () => {
    const newLayer = createNewLayer(nodes);
    setNodes([...nodes, newLayer]);
  };

  const addKnowledgeNode = async () => {
    const newLevels = [...levels];
    newLevels[addKnowledgeLayer - 1] = !newLevels[addKnowledgeLayer - 1]
      ? 1
      : newLevels[addKnowledgeLayer - 1] + 1;
    //if tree hasn't been saved to DB, create competency node
    await mergeCompetency({
      variables: {
        mergeCompetencyId: compId,
        name: compName,
        levels: newLevels,
      },
    }).then(() => {
      return addKnowledgetoTree({
        variables: {
          parentId: prereqInput,
          knowledgeId: knowledgeInput,
          level: addKnowledgeLayer,
        },
      });
    });
    //transition tree to being sourced from the DB
    if (!called) {
      getCompTree({
        variables: {
          rootId: compId,
        },
      });
    }

    setKnowledgeInput("");
    setPrereqInput(compId);
    setLevels(newLevels);
    dispatch(toggleAddKnowledge({ open: false, layerNum: 0 }));
  };

  useEffect(() => {
    if (!knowledgeData) return;
    //only show knowledge not currently in tree
    setKnowledge(
      knowledgeData.knowledges.filter((k) => {
        return !!!nodes.find((n) => n.id === k.id);
      })
    );
  }, [knowledgeData, setKnowledge, nodes]);

  useEffect(() => {
    if (!addKnowledgeLayer) return;
    //get all knowledge nodes in selected layer or one layer above
    setPrereqs(
      nodes.filter((node) => {
        return (
          node.data.type === "Knowledge" &&
          (node.data.level === addKnowledgeLayer ||
            node.data.level === addKnowledgeLayer - 1)
        );
      })
    );
  }, [addKnowledgeLayer, setPrereqs, nodes]);

  useEffect(() => {
    if (!called || !data) return;
    const { nodes: formattedNodes, edges: formattedEdges } = formatTreeData(
      data.getCompetencyTree
    );
    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [data, called, setNodes, setEdges]);

  return (
    <>
      <div className="flex flex-col space-y-2 w-full h-full">
        <div className="relative w-full h-full justify-center rounded-md border border-black overflow-clip">
          {open && (
            <div className="absolute z-10 inset-0 bg-black/50 flex flex-col items-center justify-center">
              <div className="rounded-md bg-white p-4 flex flex-col items-center">
                <h3 className="font-medium">
                  Choose a Name for the Competency
                </h3>
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
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Panel
              position="top-left"
              className="p-2 flex flex-col items-center border border-black rounded-md bg-white"
            >
              <button
                onClick={() => addLayer()}
                className="rounded-md bg-slate-600 text-white py-1 px-3 hover:bg-slate-500"
              >
                Add Layer
              </button>
            </Panel>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
      <Modal
        open={addKnowledgeOpen}
        onSecondaryButtonClick={() => {
          setKnowledgeInput("");
          setPrereqInput(compId);
          dispatch(toggleAddKnowledge({ open: false, layerNum: 0 }));
        }}
        content={
          <div className="flex flex-col">
            <h3 className="text-base font-medium">{`Select Knowledge to Add to Layer ${addKnowledgeLayer}`}</h3>
            <label className="flex flex-col w-1/2 text-sm font-medium mt-4">
              Knowledge
              <select
                value={knowledgeInput}
                onChange={(e) => setKnowledgeInput(e.target.value)}
                className="mt-1 p-1 rounded-md font-normal"
              >
                <option />
                {knowledge.map((k, i) => {
                  return (
                    <option key={i} value={k.id}>
                      {k.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="flex flex-col w-1/2 text-sm font-medium mt-2">
              Prerequisite
              <select
                value={prereqInput}
                onChange={(e) => setPrereqInput(e.target.value)}
                className="mt-1 p-1 rounded-md font-normal"
              >
                <option value={compId}>No Knowledge Prereq</option>
                {prereqs.map((p, i) => {
                  return (
                    <option key={i} value={p.data.id}>
                      {p.data.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <button
              onClick={() => addKnowledgeNode()}
              className="mt-4 w-1/3 rounded-md p-1 text-white bg-slate-800 hover:bg-slate-700"
            >
              Add Knowledge
            </button>
          </div>
        }
      />
    </>
  );
};

export default CreateNewCompetency;
