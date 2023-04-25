import { Handle } from "reactflow";

const TalentTreeCompNode = ({ data: { name, completed } }) => {
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center w-full h-full rounded-md border border-black ${
          completed ? "bg-green-400" : "bg-white"
        }`}
      >
        <div className="text-sm font-medium">{name}</div>
      </div>
      <Handle type="source" position="bottom" />
    </>
  );
};

export default TalentTreeCompNode;
