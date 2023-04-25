import { useQuery } from "@apollo/client";
import { Handle } from "reactflow";
import { GetKnowledgeDetails } from "../../graphql/knowledge";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  checkCategoryRequirement,
  checkCertRequirement,
  checkSkillRequirement,
} from "../../lib/talentTreeLib";

const skillRatingMap = ["knowledgeable", "proficient", "expert"];

const TalentTreeKnowledgeNode = ({ data: { id, name, completed, locked } }) => {
  const [open, setOpen] = useState(false);
  const [reqList, setReqList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const {
    skills: userSkills,
    projectSkills: userProjectSkills,
    certs: userCerts,
  } = useSelector((state) => state.userKnowledge);
  const { data: knowledgeData } = useQuery(GetKnowledgeDetails, {
    variables: {
      where: {
        id: id,
      },
    },
  });
  const knowledge = knowledgeData?.knowledges?.[0];

  useEffect(() => {
    if (!knowledge || !userSkills || !userProjectSkills || !userCerts) return;
    const skillReqs = knowledge?.requiredSkillsConnection.edges.map(
      (reqSkill) => {
        const completed = checkSkillRequirement(
          reqSkill,
          userSkills,
          userProjectSkills
        );

        return {
          name: `Must be ${skillRatingMap[reqSkill.minRating - 1]} in ${
            reqSkill.node.name
          }${
            reqSkill.minProjects > 0
              ? ` and have used it on at least ${reqSkill.minProjects} projects`
              : ""
          }`,
          completed,
        };
      }
    );
    const categoryReqs = knowledge?.requiredCategoriesConnection.edges.map(
      (reqCategory) => {
        const completed = checkCategoryRequirement(
          reqCategory,
          userSkills,
          userProjectSkills
        );

        return {
          name: `Must be ${
            skillRatingMap[reqCategory.minRating - 1]
          } in at least ${reqCategory.minSkills} skills from the ${
            reqCategory.node.name
          } category`,
          completed,
        };
      }
    );
    const certReqs = knowledge?.requiredCertsConnection.edges.map((reqCert) => {
      const completed = checkCertRequirement(reqCert, userCerts);

      return { name: `Must have ${reqCert.node.name}`, completed };
    });

    setReqList([...skillReqs, ...categoryReqs, ...certReqs]);
  }, [knowledge, userSkills, userProjectSkills, userCerts]);
  
  return (
    <>
      <Handle type="target" position="top" />
      <div
        onClick={() => {
          if (!locked && !completed) setOpen(true);
        }}
        className={`flex flex-col justify-center items-center w-full h-full rounded-md border border-black ${
          locked
            ? "cursor-default bg-gray-200"
            : completed
            ? "cursor-default bg-green-500"
            : "cursor-pointer bg-white hover:bg-gray-50"
        }`}
      >
        <div className="text-sm font-medium">{name}</div>
      </div>
      <Handle type="source" position="bottom" />
      <Modal
        open={open}
        onSecondaryButtonClick={() => setOpen(false)}
        content={
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{name}</h3>
            {!knowledge ? (
              <div className="text-sm font-normal mt-2">Loading...</div>
            ) : (
              <>
                <div className="text-sm font-normal mt-2">
                  {knowledge.description}
                </div>
                <div className="flex flex-col mt-4">
                  <h3 className="text-sm font-medium">Requirements:</h3>
                  <ul className="list-disc list-inside">
                    {!reqList.length ? (
                      <li className="text-sm">No Requirements</li>
                    ) : (
                      reqList.map((req, i) => {
                        return (
                          <li className="text-sm flex" key={i}>
                            {req.name}
                            {req.completed ? (
                              <span className="ml-1 text-green-600">✓</span>
                            ) : (
                              <span className="ml-1 text-red-600">X</span>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
                <div className="flex flex-col mt-4">
                  <h3 className="text-sm font-medium">Questions:</h3>
                  <div className="flex flex-col"></div>
                </div>
              </>
            )}
          </div>
        }
      />
    </>
  );
};

export default TalentTreeKnowledgeNode;
