/*
Nodes are in this format
{
    name:
    id:
    level:
    description:
    parent:
    type:
}
*/
const nodeHeight = 50;
const nodeWidth = 200;

const layerHeight = 100;

const getLayerColor = (layerNum) => {
  const colors = [
    "rgba(255, 0, 0, 0.2)",
    "rgba(0, 255, 255, 0.2)",
    "rgba(0, 255, 0, 0.2)",
    "rgba(255, 0, 255, 0.2)",
    "rgba(255, 255, 0, 0.2)",
  ];
  return colors[(layerNum - 1) % colors.length];
};

export const getEdges = (nodeArray) => {
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

const formatNodeLayer = (layerNodes, layerNum, layerStart) => {
  //layer node
  const layerWidth = layerNodes.length * (nodeWidth + 10) + 10;
  let ret = [
    {
      id: `layer-${layerNum}`,
      position: { x: -layerWidth / 2, y: layerStart },
      style: {
        width: layerWidth,
        height: layerHeight,
        backgroundColor: getLayerColor(layerNum),
      },
      data: { type: "Layer", layerNum },
      type: "layer",
    },
  ];

  //knowledge nodes
  let nodeStart = 10;
  layerNodes.forEach((node) => {
    ret.push({
      id: node.id,
      data: {
        ...node,
        label: node.name,
      },
      parentNode: `layer-${layerNum}`,
      extent: "parent",
      style: { width: nodeWidth, height: nodeHeight },
      position: { x: nodeStart, y: 40 },
    });
    nodeStart = nodeStart + nodeWidth + 10;
  });

  return ret;
};

const getNodes = (stratifiedNodes) => {
  const compNode = stratifiedNodes.shift()[0];
  let ret = [
    {
      id: compNode.id,
      data: {
        ...compNode,
        label: compNode.name,
      },
      position: { x: -nodeWidth / 2, y: 0 },
      style: { width: nodeWidth, height: nodeHeight },
    },
  ];
  let layerStart = nodeHeight + 25; //25 for margin
  stratifiedNodes.forEach((layer, i) => {
    const layerNodes = formatNodeLayer(layer, i + 1, layerStart);
    ret = ret.concat(layerNodes);
    layerStart = layerStart + layerHeight + 25; //25 for margin
  });
  return ret;
};

export const cleanNodeArray = (nodeArray) => {
  return nodeArray.map((node) => {
    let copy = { ...node };
    delete copy.__typename;
    if (node.parent) {
      copy.parentCompleted = nodeArray.find(
        (n) => n.id === node.parent
      ).completed;
    }
    return copy;
  });
};

export const stratifyNodeArray = (nodeArray) => {
  let ret = {};
  nodeArray.forEach((node) => {
    if (!ret[node.level]) {
      ret[node.level] = [node];
    } else {
      ret[node.level].push(node);
    }
  });
  return Object.keys(ret).map((key) => ret[key]);
};

export const formatTreeData = (nodeArray) => {
  const cleanedNodeArray = cleanNodeArray(nodeArray);
  const formattedEdges = getEdges(cleanedNodeArray);
  const formattedNodes = getNodes(stratifyNodeArray(cleanedNodeArray));
  return { nodes: formattedNodes, edges: formattedEdges };
};

const getMaxLevel = (nodes) => {
  return nodes
    .filter((node) => node.type === "layer")
    .reduce((maxLayer, node) => {
      return node.data.layerNum > maxLayer ? node.data.layerNum : maxLayer;
    }, 0);
};

export const createNewLayer = (nodes) => {
  const curLevel = getMaxLevel(nodes);
  const layerWidth = nodeWidth + 20;
  const layerYStart = nodeHeight + 25 + curLevel * (layerHeight + 25); //75 for comp node, 125 for each layer

  return {
    id: `layer-${curLevel + 1}`,
    position: { x: -layerWidth / 2, y: layerYStart },
    style: {
      width: layerWidth,
      height: layerHeight,
      backgroundColor: getLayerColor(curLevel + 1),
    },
    data: { type: "Layer", layerNum: curLevel + 1 },
    type: "layer",
  };
};
