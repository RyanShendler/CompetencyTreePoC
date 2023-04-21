const nodeHeight = 50;
const nodeWidth = 200;

const cleanNodeArray = (nodeArray) => {
  return nodeArray.map((node) => {
    let copy = { ...node };
    delete copy.__typename;
    return copy;
  });
};

const getNodes = (nodeArray) => {
  let ret = [];
  let start = 0

  nodeArray.forEach((node) => {
    ret.push({
      id: node.id,
      data: {
        ...node,
        label: node.name,
      },
      style: { width: nodeWidth, height: nodeHeight },
      position: {x: start, y: 0},
    });
    start = start + nodeWidth + 10;
  });

  return ret;
};

const getEdges = (nodeArray) => {
  let ret = [];
  nodeArray.forEach((node) => {
    if (node.parent) {
      ret.push({
        id: `${node.parent}_${node.id}`,
        source: node.parent,
        target: node.id,
        style: { stroke: "black" },
        markerEnd: { type: "arrow", color: "black", width: 20, height: 20 },
      });
    }
  });
  return ret;
};

export const formatCompositionData = (nodeArray) => {
  const cleanedNodeArray = cleanNodeArray(nodeArray);
  const formattedNodes = getNodes(cleanedNodeArray);
  const formattedEdges = getEdges(cleanedNodeArray);
  return {nodes: formattedNodes, edges: formattedEdges};
};
