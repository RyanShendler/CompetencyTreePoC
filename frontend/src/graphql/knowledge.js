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
