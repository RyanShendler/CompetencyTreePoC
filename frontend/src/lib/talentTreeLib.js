import { cleanNodeArray, getEdges, stratifyNodeArray } from "./lib";

const nodeHeight = 50;
const nodeWidth = 200;

const layerHeight = 90;

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

const formatNodeLayer = (layerNodes, layerNum, layerStart, levelArray) => {
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
      data: { type: "Layer", layerNum, reqKnowledge: levelArray[layerNum-1] },
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
      },
      parentNode: `layer-${layerNum}`,
      extent: "parent",
      style: { width: nodeWidth, height: nodeHeight },
      position: { x: nodeStart, y: 30 },
      type: "knowledge",
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
      },
      position: { x: -nodeWidth / 2, y: 0 },
      style: { width: nodeWidth, height: nodeHeight },
      type: "comp",
    },
  ];
  let layerStart = nodeHeight + 25; //25 for margin
  stratifiedNodes.forEach((layer, i) => {
    const layerNodes = formatNodeLayer(layer, i + 1, layerStart, compNode.levels);
    ret = ret.concat(layerNodes);
    layerStart = layerStart + layerHeight + 25; //25 for margin
  });
  return ret;
};

export const formatTalentTreeData = (nodeArray) => {
  const cleanedNodeArray = cleanNodeArray(nodeArray);
  const formattedEdges = getEdges(cleanedNodeArray);
  const formattedNodes = getNodes(stratifyNodeArray(cleanedNodeArray));
  return { nodes: formattedNodes, edges: formattedEdges };
};
