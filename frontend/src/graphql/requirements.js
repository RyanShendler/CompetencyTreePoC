import { gql } from "@apollo/client";

export const GetAllCertifications = gql`
  query GetAllCertifications {
    certifications {
      name
      id
    }
  }
`;

export const GetAllSkills = gql`
  query GetAllSkills {
    skills {
      name
      id
    }
  }
`;

export const GetAllCategories = gql`
  query GetAllCategories {
    skillCategories {
      name
      id
      childSkills {
        name
        id
      }
    }
  }
`;

export const AttachRequiredSkills = gql`
  mutation AttachRequiredSkills(
    $knowledgeId: String!
    $requiredSkills: [RequiredSkill!]!
  ) {
    attachRequiredSkills(
      knowledgeId: $knowledgeId
      requiredSkills: $requiredSkills
    ) {
      name
    }
  }
`;
/*
{  
  "knowledgeId": null,
  "requiredSkills": [{
    skillId: null,
    minProjects: null,
    minRating: null
  }]
}
*/

export const AttachRequiredCategories = gql`
  mutation AttachRequiredCategories(
    $knowledgeId: String!
    $requiredCategories: [RequiredCategory!]!
  ) {
    attachRequiredCategories(
      knowledgeId: $knowledgeId
      requiredCategories: $requiredCategories
    ) {
      name
    }
  }
`;
/*
{  
  "knowledgeId": null,
  "requiredCategories": [{
    categoryId: null,
    minProjects: null,
    minRating: null,
    minSkills: null
  }]
}
*/

export const AttachRequiredCerts = gql`
  mutation AttachRequiredCerts(
    $knowledgeId: String!
    $requiredCerts: [RequiredCert!]!
  ) {
    attachRequiredCerts(
      knowledgeId: $knowledgeId
      requiredCerts: $requiredCerts
    ) {
      name
    }
  }
`;
/*
{  
  "knowledgeId": null,
  "requiredCerts": [{
    certId: null
  }]
}
 */

export const AttachRequiredPrompts = gql`
  mutation AttachRequiredPrompts(
    $knowledgeId: String!
    $requiredPrompts: [RequiredPrompt!]!
  ) {
    attachRequiredPrompts(
      knowledgeId: $knowledgeId
      requiredPrompts: $requiredPrompts
    ) {
      name
    }
  }
`;
/*
{  
  "knowledgeId": null,
  "requiredPrompts": [{
    question: null,
    type: null,
    choices: null,
    correctAnswer: null
  }]
}
 */
