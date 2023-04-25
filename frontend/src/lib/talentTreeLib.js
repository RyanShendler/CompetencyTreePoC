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

const formatNodeLayer = (
  layerNodes,
  layerNum,
  layerStart,
  levelArray,
  layerLocked
) => {
  //layer node
  const layerWidth = layerNodes.length * (nodeWidth + 10) + 10;
  let ret = [
    {
      id: `layer-${layerNum}`,
      position: { x: -layerWidth / 2, y: layerStart },
      style: {
        width: layerWidth,
        height: layerHeight,
        backgroundColor: layerLocked
          ? "rgba(83, 83, 83, 0.2)"
          : getLayerColor(layerNum),
      },
      data: { type: "Layer", layerNum, reqKnowledge: levelArray[layerNum - 1] },
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
        locked: layerLocked || !node.parentCompleted,
        layer: layerNum,
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
  let locked = false;
  let layerStart = nodeHeight + 25; //25 for margin
  stratifiedNodes.forEach((layer, i) => {
    const layerNodes = formatNodeLayer(
      layer,
      i + 1,
      layerStart,
      compNode.levels,
      locked
    );
    ret = ret.concat(layerNodes);
    layerStart = layerStart + layerHeight + 25; //25 for margin
    if (!checkLayerComplete(layer, compNode.levels[i])) locked = true;
  });
  return ret;
};

const checkLayerComplete = (layerNodes, layerReq) => {
  const completedNodes = layerNodes.filter((n) => n.completed);
  return completedNodes.length >= layerReq;
};

export const formatTalentTreeData = (nodeArray) => {
  const cleanedNodeArray = cleanNodeArray(nodeArray);
  const formattedEdges = getEdges(cleanedNodeArray);
  const formattedNodes = getNodes(stratifyNodeArray(cleanedNodeArray));
  return { nodes: formattedNodes, edges: formattedEdges };
};

export const processUserSkills = (skillArray) => {
  return skillArray.map((skill) => ({
    name: skill.node.name,
    id: skill.node.id,
    rating: skill.rating,
    categories: skill.node.categories.map((c) => c.id),
  }));
};

export const processUserCerts = (certArray) => {
  return certArray.map((cert) => ({
    name: cert.name,
    id: cert.id,
  }));
};

//invert project ratings to be inline with skill rating
const remapProjectRating = (projectRating) => {
  const remap = [3, 2, 1];
  return remap[projectRating - 1];
};

export const processProjectSkills = (assessmentArray) => {
  let ret = [];
  const allSkills = assessmentArray
    .map((a) => a?.skillsUsedConnection?.edges ?? [])
    .flat();
  allSkills.forEach((skill) => {
    const index = ret.findIndex((s) => s.id === skill.node.id);
    if (index < 0) {
      ret.push({
        name: skill.node.name,
        id: skill.node.id,
        categories: skill.node.categories.map((c) => c.id),
        ratings: [remapProjectRating(skill.rating)],
      });
    } else {
      ret[index].ratings = [
        ...ret[index].ratings,
        remapProjectRating(skill.rating),
      ];
    }
  });
  return ret;
};

export const checkSkillRequirement = (reqSkill, userSkills, projectSkills) => {
  if (reqSkill.minProjects > 0) {
    return !!projectSkills
      .filter((s) => s.ratings.length >= reqSkill.minProjects)
      .find(
        (s) =>
          s.id === reqSkill.node.id &&
          Math.max(...s.ratings) >= reqSkill.minRating
      );
  } else {
    return !!userSkills.find(
      (s) => s.id === reqSkill.node.id && s.rating >= reqSkill.minRating
    );
  }
};

export const checkCertRequirement = (reqCert, userCerts) => {
  return !!userCerts.find((c) => c.id === reqCert.node.id);
};

export const checkCategoryRequirement = (
  reqCategory,
  userSkills,
  projectSkills
) => {
  if (reqCategory.minProjects > 0) {
    return (
      !!projectSkills
        .filter((s) => s.ratings.length >= reqCategory.minProjects)
        .filter(
          (s) =>
            !!s.categories.find((c) => c === reqCategory.node.id) &&
            Math.max(...s.ratings) >= reqCategory.minRating
        ).length >= reqCategory.minSkills
    );
  } else {
    return !!userSkills.filter(
      (s) =>
        !!s.categories.find((c) => c === reqCategory.node.id) &&
        s.rating >= reqCategory.minRating
    );
  }
};
