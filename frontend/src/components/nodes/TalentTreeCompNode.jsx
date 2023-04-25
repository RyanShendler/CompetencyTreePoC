import { Handle } from "reactflow";

const TalentTreeCompNode = ({ data }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-white w-full h-full rounded-md border border-black">
        <div className="text-sm font-medium">{data.name}</div>
      </div>
      <Handle type="source" position="bottom" />
    </>
  );
};

export default TalentTreeCompNode;