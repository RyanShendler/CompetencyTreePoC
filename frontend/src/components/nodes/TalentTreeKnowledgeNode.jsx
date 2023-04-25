import { useQuery } from "@apollo/client";
import { Handle } from "reactflow";
import { GetKnowledgeDetails } from "../../graphql/knowledge";
import Modal from "../Modal";
import { useEffect, useState } from "react";

const skillRatingMap = ["knowledgeable", "proficient", "expert"];

const TalentTreeKnowledgeNode = ({ data: { id, name, completed, locked } }) => {
  const [open, setOpen] = useState(false);
  const [reqList, setReqList] = useState([]);
  const { data: knowledgeData } = useQuery(GetKnowledgeDetails, {
    variables: {
      where: {
        id: id,
      },
    },
  });
  const knowledge = knowledgeData?.knowledges?.[0];

  useEffect(() => {
    if (!knowledge) return;
    const skillReqs = knowledge?.requiredSkillsConnection.edges.map(
      (reqSkill) =>
        `Must be ${skillRatingMap[reqSkill.minRating - 1]} in ${
          reqSkill.node.name
        }${
          reqSkill.minProjects > 0
            ? ` and have used it on at least ${reqSkill.minProjects} projects`
            : ""
        }`
    );
    const categoryReqs = knowledge?.requiredCategoriesConnection.edges.map(
      (reqCategory) =>
        `Must be ${skillRatingMap[reqCategory.minRating - 1]} in at least ${
          reqCategory.minSkills
        } skills from the ${reqCategory.node.name} category`
    );
    const certReqs = knowledge?.requiredCertsConnection.edges.map(
      (reqCert) => `Must have ${reqCert.node.name}`
    );
    const promptReqs = knowledge?.requiredPromptsConnection.edges.map(
      (reqPrompt) =>
        `Must correctly answer the following question: ${reqPrompt.node.question}`
    );

    setReqList([...skillReqs, ...categoryReqs, ...certReqs, ...promptReqs]);
  }, [knowledge]);

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
                          <li className="text-sm" key={i}>
                            {req}
                          </li>
                        );
                      })
                    )}
                  </ul>
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
