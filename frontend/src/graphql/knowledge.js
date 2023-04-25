import { gql } from "@apollo/client";

export const GetAllKnowledge = gql`
  query GetAllKnowledge($options: KnowledgeOptions) {
    knowledges(options: $options) {
      name
      id
      description
    }
  }
`;
/*
{
    "options": {
      "sort": [
        {
          "name": "ASC"
        }
      ]
    }
}
*/

export const GetKnowledgeDetails = gql`
  query GetKnowledgeDetails($where: KnowledgeWhere) {
    knowledges(where: $where) {
      name
      description
      requiredSkillsConnection {
        edges {
          minRating
          minProjects
          node {
            name
            id
          }
        }
      }
      requiredCategoriesConnection {
        edges {
          minSkills
          minRating
          minProjects
          node {
            name
            id
          }
        }
      }
      requiredCertsConnection {
        edges {
          node {
            name
            id
          }
        }
      }
      requiredPromptsConnection {
        edges {
          node {
            question
            choices
            correctAnswer
          }
        }
      }
    }
  }
`;
/*
{
  "where": null
}
*/

export const CreateKnowledge = gql`
  mutation CreateKnowledge($input: [KnowledgeCreateInput!]!) {
    createKnowledges(input: $input) {
      info {
        nodesCreated
      }
    }
  }
`;
/*
{
  "input": [
    {
      "name": null,
      "id": null,
      "description": null
    }
  ]
}
*/

export const GetUserKnowledge = gql`
  query GetUserKnowledge {
    people {
      knownSkillsConnection {
        edges {
          rating
          node {
            name
            id
            categories {
              name
              id
            }
          }
        }
      }
      knownCerts {
        name
        id
      }
      projectAssessments {
        skillsUsedConnection {
          edges {
            rating
            node {
              name
              id
              categories {
                name
                id
              }
            }
          }
        }
      }
    }
  }
`;
