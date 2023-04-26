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
            type
            id
            peopleAnsweredConnection {
              edges {
                verified
                response
              }
            }
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

export const ClaimKnowledge = gql`
  mutation ClaimKnowledge($knowledgeId: String!) {
    claimKnowledge(knowledgeId: $knowledgeId) {
      name
    }
  }
`;
/*
{
  "knowledgeId": null
}
*/

export const AnswerPrompt = gql`
  mutation AnswerPrompt(
    $promptId: String!
    $response: String!
    $verified: Boolean!
  ) {
    answerPrompt(
      promptId: $promptId
      response: $response
      verified: $verified
    ) {
      id
    }
  }
`;
/*
{  
  "promptId": null,
  "response": null,
  "verified": nulll
}
*/
