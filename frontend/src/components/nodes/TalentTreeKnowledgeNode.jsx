import { useMutation, useQuery } from "@apollo/client";
import { Handle } from "reactflow";
import { ClaimKnowledge, GetKnowledgeDetails } from "../../graphql/knowledge";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  checkCategoryRequirement,
  checkCertRequirement,
  checkSkillRequirement,
} from "../../lib/talentTreeLib";
import { CompleteCompetency } from "../../graphql/competencies";
import MiniAssessment from "../MiniAssessment";

const skillRatingMap = ["knowledgeable", "proficient", "expert"];

const TalentTreeKnowledgeNode = ({
  data: { id, name, completed, locked, layer },
}) => {
  const [open, setOpen] = useState(false);
  const [takingAssessment, setTakingAssessment] = useState(false);
  const [reqList, setReqList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const { layers, compId } = useSelector((state) => state.layer);
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
    fetchPolicy: "network-only",
  });
  const [claimKnowledge] = useMutation(ClaimKnowledge, {
    refetchQueries: ["GetCompetencyTree"],
  });
  const [completeCompetency] = useMutation(CompleteCompetency, {
    refetchQueries: ["GetCompetencyTree"],
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

    const promptReqs = knowledge?.requiredPromptsConnection.edges.map(
      (reqPrompt) => {
        let response = "";
        if (reqPrompt.node.type === "checklist") {
          response = !!reqPrompt.node.peopleAnsweredConnection.edges?.[0]
            ?.response
            ? JSON.parse(
                reqPrompt.node.peopleAnsweredConnection.edges?.[0]?.response
              )
            : reqPrompt.node.choices.map(() => false);
        } else {
          response =
            reqPrompt.node.peopleAnsweredConnection.edges?.[0]?.response ?? "";
        }

        return {
          prompt: reqPrompt.node.question,
          answers: reqPrompt.node.choices,
          correctAnswer: reqPrompt.node.correctAnswer,
          id: reqPrompt.node.id,
          response,
          verified:
            !!reqPrompt.node.peopleAnsweredConnection.edges.length &&
            reqPrompt.node.peopleAnsweredConnection.edges?.[0].verified,
          type: reqPrompt.node.type,
        };
      }
    );

    setReqList([...skillReqs, ...categoryReqs, ...certReqs]);
    setQuestions([...promptReqs]);
  }, [knowledge, userSkills, userProjectSkills, userCerts]);

  const handleClaimKnowledge = async () => {
    //complete competency node if last node in last layer
    const complete =
      layer === layers.length &&
      layers[layer - 1].required === layers[layer - 1].completed + 1;

    if (complete) {
      await completeCompetency({
        variables: {
          knowledgeId: id,
          competencyId: compId,
        },
      });
    } else {
      await claimKnowledge({
        variables: {
          knowledgeId: id,
        },
      });
    }
    setOpen(false);
  };

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
            ? "cursor-default bg-green-400"
            : "cursor-pointer bg-white hover:bg-gray-50"
        }`}
      >
        <div className="text-sm font-medium">{name}</div>
      </div>
      <Handle type="source" position="bottom" />
      <Modal
        open={open}
        onSecondaryButtonClick={() => {
          setOpen(false);
          setTakingAssessment(false);
        }}
        content={
          <div className="flex flex-col">
            {takingAssessment ? (
              <MiniAssessment
                name={`${name} Assessment`}
                questions={questions}
                setQuestions={setQuestions}
                completeAssessment={() => setTakingAssessment(false)}
              />
            ) : (
              <>
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
                      {!!questions.length && (
                        <>
                          <h3 className="text-sm font-medium">Questions:</h3>
                          <button
                            disabled={!!!questions.find((q) => !q.verified)}
                            onClick={() => setTakingAssessment(true)}
                            className="rounded-md p-1 text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 w-1/3 mt-2"
                          >
                            Take Assessment
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
                <div className="flex justify-center w-full mt-4">
                  <button
                    onClick={() => handleClaimKnowledge()}
                    disabled={
                      !knowledge ||
                      (reqList.length &&
                        !!reqList.find((req) => !req.completed)) ||
                      (questions.length && !!questions.find((q) => !q.verified))
                    }
                    className="p-1 w-1/2 rounded-md text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800"
                  >
                    Claim Knowledge
                  </button>
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
