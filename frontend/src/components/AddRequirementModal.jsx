import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  GetAllCategories,
  GetAllCertifications,
  GetAllSkills,
} from "../graphql/requirements";

const reqTypes = ["Skill", "Skill Category", "Certification", "Prompt"];

const AddRequirementModal = ({ closeModal, addRequirement }) => {
  const [reqType, setReqType] = useState("");
  const [skillReq, setSkillReq] = useState({
    name: "",
    id: "",
    minRating: 1,
    minProjects: 0,
  });
  const [categoryReq, setCategoryReq] = useState({
    name: "",
    id: "",
    minSkills: 1,
    minRating: 1,
    minProjects: 0,
  });
  const [certReq, setCertReq] = useState({
    name: "",
    id: "",
  });
  const [promptReq, setPromptReq] = useState({
    name: "",
    type: "multiple choice",
    choices: [],
    correctAnswer: "",
  });
  const [answerInput, setAnswerInput] = useState("");

  const { data: skillData, loading: skillLoading } = useQuery(GetAllSkills);
  const { data: categoryData, loading: categoryLoading } =
    useQuery(GetAllCategories);
  const { data: certData, loading: certLoading } =
    useQuery(GetAllCertifications);

  const handleAddRequirement = () => {
    const reqDict = {
        "Skill": skillReq,
        "Skill Category": categoryReq,
        "Certification": certReq,
        "Prompt": promptReq
    }

    addRequirement(reqType, reqDict[reqType])
    closeModal();
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-medium text-sm">Add a Requirement</h3>
      <label className="flex flex-col font-medium text-sm mt-2">
        Requirement Type
        <select
          value={reqType}
          onChange={(e) => {
            setReqType(e.target.value);
          }}
          className="w-1/2 mt-1 text-base font-normal"
        >
          <option value={""} />
          {reqTypes.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </label>
      {reqType === "Skill" && !skillLoading && (
        <>
          <label className="flex flex-col font-medium text-sm mt-2">
            Required Skill
            <select
              value={skillReq.id}
              onChange={(e) => {
                const skill = skillData.skills.find(
                  (s) => s.id === e.target.value
                );
                setSkillReq((s) => ({
                  ...s,
                  id: e.target.value,
                  name: skill?.name ?? "",
                }));
              }}
              className="w-1/2 mt-1 text-base font-normal"
            >
              <option value={""} />
              {skillData.skills.map((skill, i) => {
                return (
                  <option key={i} value={skill.id}>
                    {skill.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Minimum Rating
            <input
              type="number"
              min={1}
              max={3}
              value={skillReq.minRating}
              onChange={(e) =>
                setSkillReq((s) => ({
                  ...s,
                  minRating: parseInt(e.target.value, 10),
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Minimum Projects
            <input
              type="number"
              min={0}
              value={skillReq.minProjects}
              onChange={(e) =>
                setSkillReq((s) => ({
                  ...s,
                  minProjects: parseInt(e.target.value, 10),
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
        </>
      )}
      {reqType === "Skill Category" && !categoryLoading && (
        <>
          <label className="flex flex-col font-medium text-sm mt-2">
            Required Skill Category
            <select
              value={categoryReq.id}
              onChange={(e) => {
                const category = categoryData.skillCategories.find(
                  (c) => c.id === e.target.value
                );
                setCategoryReq((c) => ({
                  ...c,
                  id: e.target.value,
                  name: category?.name ?? "",
                }));
              }}
              className="w-1/2 mt-1 text-base font-normal"
            >
              <option value={""} />
              {categoryData.skillCategories.map((category, i) => {
                return (
                  <option key={i} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Minimum Skills
            <input
              type="number"
              min={1}
              value={categoryReq.minSkills}
              onChange={(e) =>
                setCategoryReq((c) => ({
                  ...c,
                  minSkills: parseInt(e.target.value, 10),
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Minimum Rating
            <input
              type="number"
              min={1}
              max={3}
              value={categoryReq.minRating}
              onChange={(e) =>
                setCategoryReq((c) => ({
                  ...c,
                  minRating: parseInt(e.target.value, 10),
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Minimum Projects
            <input
              type="number"
              min={0}
              value={categoryReq.minProjects}
              onChange={(e) =>
                setCategoryReq((c) => ({
                  ...c,
                  minProjects: parseInt(e.target.value, 10),
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
        </>
      )}
      {reqType === "Certification" && !certLoading && (
        <>
          <label className="flex flex-col font-medium text-sm mt-2">
            Required Certification
            <select
              value={certReq.id}
              onChange={(e) => {
                const cert = certData.certifications.find(
                  (c) => c.id === e.target.value
                );
                setCertReq((c) => ({
                  ...c,
                  id: e.target.value,
                  name: cert?.name ?? "",
                }));
              }}
              className="w-1/2 mt-1 text-base font-normal"
            >
              <option value={""} />
              {certData.certifications.map((cert, i) => {
                return (
                  <option key={i} value={cert.id}>
                    {cert.name}
                  </option>
                );
              })}
            </select>
          </label>
        </>
      )}
      {reqType === "Prompt" && (
        <>
          <label className="flex flex-col font-medium text-sm mt-2">
            Prompt
            <input
              type="text"
              value={promptReq.name}
              onChange={(e) =>
                setPromptReq((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              className="w-1/2 mt-1 text-base font-normal p-1"
            />
          </label>
          <label className="flex flex-col font-medium text-sm mt-2">
            Answers
            <div className="flex flex-col items-center rounded-md border border-black p-2">
              {promptReq.choices.map((a, i) => {
                return (
                  <div
                    className="w-full flex items-center text-base p-1"
                    key={i}
                  >
                    <input
                      type="radio"
                      name="correct"
                      className="mr-2"
                      checked={promptReq.correctAnswer === a}
                      onChange={() => setPromptReq((p) => ({ ...p, correctAnswer: a }))}
                    />
                    {a}
                    <span
                      onClick={() => {
                        let newChoices = [...promptReq.choices];
                        newChoices.splice(i, 1);
                        setPromptReq((p) => ({
                          ...p,
                          choices: newChoices,
                        }));
                      }}
                      className="ml-2 text-red-600 cursor-pointer rounded-md hover:bg-gray-200"
                    >
                      X
                    </span>
                  </div>
                );
              })}
              <div className="w-full flex items-center">
                <input
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  className="text-base font-normal p-1"
                />
                <button
                  onClick={() => {
                    setAnswerInput("");
                    setPromptReq((p) => ({
                      ...p,
                      choices: [...p.choices, answerInput],
                    }));
                  }}
                  className="text-sm text-white bg-slate-700 rounded-md p-1 ml-2 hover:bg-slate-600"
                >
                  Add Answer
                </button>
              </div>
            </div>
          </label>
        </>
      )}
      <div className="flex justify-evenly w-full mt-2">
        <button
          onClick={() => handleAddRequirement()}
          className="bg-slate-700 text-white p-1 rounded-md hover:bg-slate-600"
        >
          Confirm
        </button>
        <button
          onClick={() => closeModal()}
          className="bg-red-600 text-white p-1 rounded-md hover:bg-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddRequirementModal;
