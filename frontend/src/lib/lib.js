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

const getLayerColor = (layerNum) => {
    const colors = ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 255, 0.2)']
    return colors[layerNum % 2];
}

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

const formatNodeLayer = (layerNodes, layerNum, layerStart) => {
  //layer node
  const layerWidth = layerNodes.length * (nodeWidth + 10) + 10;
  let ret = [
    {
      id: `layer-${layerNum}`,
      position: { x: (-layerWidth/2), y: layerStart },
      style: { width: layerWidth, height: 70, backgroundColor: getLayerColor(layerNum) },
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
        position: {x: nodeStart, y: 10}
      })
    nodeStart = nodeStart + nodeWidth + 10
  })

  return ret
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
      position: { x: (-nodeWidth/2), y: 0 },
      style: { width: nodeWidth, height: nodeHeight },
    },
  ];
  let layerStart = 75; //50 for node height, 25 for margin
  stratifiedNodes.forEach((layer, i) => {
    const layerNodes = formatNodeLayer(layer, i+1, layerStart);
    ret = ret.concat(layerNodes);
    layerStart += 95; //70 for layer height, 25 for margin
  });
  return ret;
};

const cleanNodeArray = (nodeArray) => {
  return nodeArray.map((node) => {
    let copy = { ...node };
    delete copy.__typename;
    return copy;
  });
};

const stratifyNodeArray = (nodeArray) => {
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