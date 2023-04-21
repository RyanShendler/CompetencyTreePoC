import { gql } from "@apollo/client";

export const GetAllCompetencies = gql`
  query GetAllCompetencies {
    competencies {
      name
      id
    }
  }
`;

export const GetCompetencyTree = gql`
  query GetCompetencyTree($rootId: String!) {
    getCompetencyTree(rootId: $rootId) {
      name
      id
      description
      level
      parent
      type
    }
  }
`;

export const GetCompetencyComposition = gql`
  query GetCompetencyComposition {
    getCompetencyComposition {
      id
      name
      parent
    }
  }
`;

export const MergeCompetency = gql`
  mutation MergeCompetency(
    $mergeCompetencyId: String!
    $name: String!
    $levels: [Int!]!
  ) {
    mergeCompetency(id: $mergeCompetencyId, name: $name, levels: $levels) {
      id
    }
  }
`;
/*
{  
  "mergeCompetencyId": null,
  "name": null,
  "levels": nulll
}
*/

export const AddKnowledgeToTree = gql`
  mutation AddKnowledgeToTree(
    $parentId: String!
    $knowledgeId: String!
    $level: Int!
  ) {
    addKnowledgeToTree(
      parentId: $parentId
      knowledgeId: $knowledgeId
      level: $level
    ) {
      name
    }
  }
`;
/*
{  
  "parentId": null,
  "knowledgeId": null,
  "level": nulll
}
*/
