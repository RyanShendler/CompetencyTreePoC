import { useQuery, useMutation } from "@apollo/client";
import { CreateKnowledge, GetAllKnowledge } from "../graphql/knowledge";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import AddRequirementModal from "./AddRequirementModal";
import {
  AttachRequiredCategories,
  AttachRequiredCerts,
  AttachRequiredPrompts,
  AttachRequiredSkills,
} from "../graphql/requirements";

const CreateNewKnowledge = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const { data } = useQuery(GetAllKnowledge, {
    variables: {
      options: {
        sort: [
          {
            name: "ASC",
          },
        ],
      },
    },
  });
  const [createKnowledge] = useMutation(CreateKnowledge, {
    refetchQueries: ["GetAllKnowledge"],
  });
  const [attachRequiredSkills] = useMutation(AttachRequiredSkills);
  const [attachRequiredCategories] = useMutation(AttachRequiredCategories);
  const [attachRequiredCerts] = useMutation(AttachRequiredCerts);
  const [attachRequiredPrompts] = useMutation(AttachRequiredPrompts);

  const addRequirement = (reqType, req) => {
    setRequirements([...requirements, { reqType, ...req }]);
  };

  const handleCreateKnowledge = async () => {
    const knowledgeId = uuidv4();
    const requiredSkills = requirements
      .filter((req) => req.reqType === "Skill")
      .map((req) => ({
        skillId: req.id,
        minRating: req.minRating,
        minProjects: req.minProjects,
      }));
    const requiredCategories = requirements
      .filter((req) => req.reqType === "Skill Category")
      .map((req) => ({
        categoryId: req.id,
        minSkills: req.minSkills,
        minRating: req.minRating,
        minProjects: req.minProjects,
      }));
    const requiredCerts = requirements
      .filter((req) => req.reqType === "Certification")
      .map((req) => ({ certId: req.id }));
    const requiredPrompts = requirements
      .filter((req) => req.reqType === "Prompt")
      .map((req) => ({
        question: req.name,
        type: req.type,
        choices: req.choices,
        correctAnswer: req.correctAnswer,
      }));

    await createKnowledge({
      variables: {
        input: [
          {
            name: name,
            id: knowledgeId,
            description: description,
          },
        ],
      },
    })
      .then(() =>
        attachRequiredSkills({
          variables: {
            knowledgeId,
            requiredSkills,
          },
        })
      )
      .then(() =>
        attachRequiredCategories({
          variables: {
            knowledgeId,
            requiredCategories,
          },
        })
      )
      .then(() =>
        attachRequiredCerts({
          variables: {
            knowledgeId,
            requiredCerts,
          },
        })
      )
      .then(() =>
        attachRequiredPrompts({
          variables: {
            knowledgeId,
            requiredPrompts,
          },
        })
      );
    setName("");
    setDescription("");
    setRequirements([]);
  };

  return (
    <>
      <div className="flex flex-row border border-black rounded-md w-full h-full">
        <div className="flex flex-col border-r border-black w-2/3 h-full p-4">
          <h2 className="font-medium">Create New Knowledge Node</h2>
          <div className="flex flex-col pl-2 space-y-4 mt-4">
            <label className="flex flex-col text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 text-sm font-normal p-1 rounded-md w-1/4"
                type="text"
              />
            </label>
            <label className="flex flex-col text-sm font-medium">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 text-sm font-normal p-1 rounded-md w-1/2"
                rows={3}
              />
            </label>
            <div className="flex flex-col w-2/3">
              <div className="flex flex-row justify-between">
                <h3 className="text-sm font-medium">Requirements</h3>
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-md p-1 text-sm text-white bg-slate-800 hover:bg-slate-700"
                >
                  Add Requirement
                </button>
              </div>
              <div className="flex flex-col items-center rounded-md p-2 border border-black mt-2">
                {!requirements.length ? (
                  <div className="text-sm font-medium">No Requirements</div>
                ) : (
                  requirements.map((req, i) => {
                    return (
                      <div key={i} className="flex items-center">
                        {req.name}
                        <span
                          onClick={() => {
                            let newReqs = [...requirements];
                            newReqs.splice(i, 1);
                            setRequirements(newReqs);
                          }}
                          className="ml-2 text-red-600 cursor-pointer rounded-md hover:bg-gray-200"
                        >
                          X
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <button
              onClick={() => handleCreateKnowledge()}
              className="text-white bg-slate-800 hover:bg-slate-700 rounded-md p-1 w-20"
            >
              Create
            </button>
          </div>
        </div>
        <div className="flex flex-col p-4 h-full w-1/3">
          <h2 className="w-full text-center font-medium">
            All Knowledge Nodes
          </h2>
          <div className="flex flex-col items-center space-y-2 mt-2 w-full">
            {!data ? (
              <span>Loading...</span>
            ) : (
              data.knowledges.map((k, i) => {
                return (
                  <div
                    className="border border-black rounded-md p-2 w-2/3 text-center"
                    key={i}
                  >
                    {k.name}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onSecondaryButtonClick={() => setOpen(false)}
        content={
          <AddRequirementModal
            closeModal={() => setOpen(false)}
            addRequirement={addRequirement}
          />
        }
      />
    </>
  );
};

export default CreateNewKnowledge;
