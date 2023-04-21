import { useQuery, useMutation } from "@apollo/client";
import { CreateKnowledge, GetAllKnowledge } from "../graphql/knowledge";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateNewKnowledge = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

  const handleCreateKnowledge = () => {
    createKnowledge({
      variables: {
        input: [
          {
            name: name,
            id: uuidv4(),
            description: description,
          },
        ],
      },
    });
    setName("");
    setDescription("");
  };

  return (
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
          <button
            onClick={() => handleCreateKnowledge()}
            className="text-white bg-slate-800 rounded-md p-1 w-20"
          >
            Create
          </button>
        </div>
      </div>
      <div className="flex flex-col p-4 h-full w-1/3">
        <h2 className="w-full text-center font-medium">All Knowledge Nodes</h2>
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
  );
};

export default CreateNewKnowledge;
