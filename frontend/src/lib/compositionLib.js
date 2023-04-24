const nodeHeight = 50;
const nodeWidth = 200;

const cleanNodeArray = (nodeArray) => {
  return nodeArray.map((node) => {
    let copy = { ...node };
    delete copy.__typename;
    return copy;
  });
};

const getGroupNodes = (rootNode, nodeArray, retArray, xStart, yStart) => {
  const childNode = nodeArray.find((n) => n.parent === rootNode.id)
  const formattedNode = {
    id: rootNode.id,
    data: {
      ...rootNode,
      label: rootNode.name
    },
    style: { width: nodeWidth, height: nodeHeight },
    position: {x: xStart, y: yStart},
  }
  //if node has no children, just add to array and return
  if(!childNode) {
    return [...retArray, formattedNode]
  }

  //if node has children, add to array and then check child node for children
  return getGroupNodes(childNode, nodeArray, [...retArray, formattedNode], xStart, yStart+nodeHeight+25)
}

const getNodes = (nodeArray) => {
  let ret = [];
  let nodes = [...nodeArray];
  let xStart = 0;

  nodes.filter((n) => !n.parent).forEach((n) => {
    ret = ret.concat(getGroupNodes(n, nodes, [], xStart, 0))
    xStart = xStart + nodeWidth + 25;
  })
  
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
