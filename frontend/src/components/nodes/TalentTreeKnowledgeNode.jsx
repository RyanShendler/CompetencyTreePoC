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

const skillRatingMap = ["knowledgeable", "proficient", "expert"];

const TalentTreeKnowledgeNode = ({ data: { id, name, completed, locked, layer } }) => {
  const [open, setOpen] = useState(false);
  const [reqList, setReqList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const {layers} = useSelector((state) => state.layer)
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
  const [claimKnowledge] = useMutation(ClaimKnowledge, {
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
      (reqPrompt) => ({
        prompt: reqPrompt.node.question,
        answers: reqPrompt.node.choices,
        correctAnswer: reqPrompt.node.correctAnswer,
        input: "",
        error: false,
      })
    );

    setReqList([...skillReqs, ...categoryReqs, ...certReqs]);
    setQuestions([...promptReqs]);
  }, [knowledge, userSkills, userProjectSkills, userCerts]);

  const handleClaimKnowledge = async () => {
    let error = false;
    const validatedQuestions = questions.map((q) => {
      let questionError = false;
      if (q.input !== q.correctAnswer) {
        questionError = true;
        error = true;
      }
      return { ...q, error: questionError };
    });
    if (error) {
      setQuestions(validatedQuestions);
      return;
    }

    await claimKnowledge({
      variables: {
        knowledgeId: id,
      },
    });
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
                  <div className="flex flex-col">
                    {!questions.length ? (
                      <div className="text-sm">No Questions</div>
                    ) : (
                      questions.map((q, i) => {
                        return (
                          <label className="text-sm flex flex-col mt-1" key={i}>
                            {q.prompt}
                            {q.answers.map((a, j) => (
                              <div
                                key={j}
                                className="flex flex-row items-center ml-2"
                              >
                                <input
                                  name={questions[i].prompt}
                                  checked={
                                    questions[i].input ===
                                    questions[i].answers[j]
                                  }
                                  onChange={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[i].input =
                                      questions[i].answers[j];
                                    newQuestions[i].error = false;
                                    setQuestions(newQuestions);
                                  }}
                                  className="mr-1"
                                  type="radio"
                                />
                                {a}
                              </div>
                            ))}
                            <span
                              className={`text-sm text-red-600 ${
                                questions[i].error ? "block" : "hidden"
                              }`}
                            >
                              This answer is incorrect
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-center w-full mt-4">
              <button
                onClick={() => handleClaimKnowledge()}
                disabled={
                  !knowledge ||
                  (reqList.length && !!reqList.find((req) => !req.completed)) ||
                  (questions.length && !!questions.find((q) => !q.input))
                }
                className="p-1 w-1/2 rounded-md text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800"
              >
                Claim Knowledge
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default TalentTreeKnowledgeNode;
