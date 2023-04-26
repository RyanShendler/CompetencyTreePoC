import { useMutation } from "@apollo/client";
import { useMemo, useState } from "react";
import { AnswerPrompt } from "../graphql/knowledge";

const MiniAssessment = ({
  name,
  questions,
  setQuestions,
  completeAssessment,
}) => {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(false);
  const [answerPrompt] = useMutation(AnswerPrompt);

  const currentQuestion = useMemo(
    () => questions[current],
    [current, questions]
  );
  console.log(questions);

  const submitCurrentQuestion = async () => {
    if (currentQuestion.type === "short answer" && !currentQuestion.response) {
      setError(true);
      return;
    }
    if (
      currentQuestion.type === "checklist" &&
      currentQuestion.response.filter((r) => r).length <
        parseInt(currentQuestion.correctAnswer, 10)
    ) {
      setError(true);
      return;
    }
    if (
      currentQuestion.type === "multiple choice" &&
      currentQuestion.response !== currentQuestion.correctAnswer
    ) {
      setError(true);
      return;
    }

    if (!currentQuestion.verified) {
      await answerPrompt({
        variables: {
          promptId: currentQuestion.id,
          response:
            currentQuestion.type === "checklist"
              ? JSON.stringify(currentQuestion.response)
              : currentQuestion.response,
          verified: true,
        },
      });
      let newQuestions = [...questions];
      newQuestions[current] = { ...currentQuestion, verified: true };
      setQuestions(newQuestions);
    }

    if (current === questions.length - 1) {
      completeAssessment();
      return;
    }
    setCurrent((c) => c + 1);
  };

  return (
    <>
      <h3 className="text-sm font-medium">{name}</h3>
      {currentQuestion.type === "multiple choice" && (
        <label className="flex flex-col mt-2 font-medium text-sm">
          {currentQuestion.prompt}
          {currentQuestion.answers.map((a, i) => (
            <div
              className="ml-1 flex flex-row items-center font-normal"
              key={i}
            >
              <input
                className="mr-1"
                disabled={currentQuestion.verified}
                checked={
                  currentQuestion.response === currentQuestion.answers[i]
                }
                onChange={() => {
                    let newQuestions = [...questions];
                  newQuestions[current] = {
                    ...currentQuestion,
                    response: currentQuestion.answers[i],
                  };
                  setQuestions(newQuestions);
                  setError(false);
                }}
                name={currentQuestion.prompt}
                type="radio"
              />
              {a}
            </div>
          ))}
          <span
            className={`text-red-600 text-xs font-normal ${
              error ? "block" : "hidden"
            }`}
          >
            Incorrect answer
          </span>
        </label>
      )}
      {currentQuestion.type === "checklist" && (
        <label className="flex flex-col mt-2 font-medium text-sm">
          {currentQuestion.prompt}
          {currentQuestion.answers.map((a, i) => (
            <div
              className="ml-1 flex flex-row items-center font-normal"
              key={i}
            >
              <input
                type="checkbox"
                className="mr-1"
                disabled={currentQuestion.verified}
                checked={currentQuestion.response[i]}
                onChange={() => {
                  let newResponse = [...currentQuestion.response];
                  newResponse[i] = !newResponse[i];
                  let newQuestions = [...questions];
                  newQuestions[current] = {
                    ...currentQuestion,
                    response: newResponse,
                  };
                  setQuestions(newQuestions);
                  setError(false);
                }}
              />
              {a}
            </div>
          ))}
          <span
            className={`text-red-600 text-xs font-normal ${
              error ? "block" : "hidden"
            }`}
          >{`You must select at least ${currentQuestion.correctAnswer} options`}</span>
        </label>
      )}
      {currentQuestion.type === "short answer" && (
        <label className="flex flex-col mt-2 font-medium text-sm">
          {currentQuestion.prompt}
          <textarea
            rows={3}
            disabled={currentQuestion.verified}
            className="mt-1 p-1 rounded-md text-sm font-normal bg-white disabled:bg-gray-200"
            value={currentQuestion.response}
            onChange={(e) => {
              let newQuestions = [...questions];
              newQuestions[current] = {
                ...currentQuestion,
                response: e.target.value,
              };
              setQuestions(newQuestions);
              setError(false);
            }}
          />
          <span
            className={`text-red-600 text-xs font-normal ${
              error ? "block" : "hidden"
            }`}
          >
            Required
          </span>
        </label>
      )}
      <div className="mt-4 w-full flex flex-row justify-between px-2">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="w-1/5 p-1 rounded-md text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800"
        >
          Prev
        </button>
        <button
          onClick={() => submitCurrentQuestion()}
          className="w-1/5 p-1 rounded-md text-white bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800"
        >
          {current === questions.length - 1 ? "Complete" : "Next"}
        </button>
      </div>
    </>
  );
};

export default MiniAssessment;
