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
