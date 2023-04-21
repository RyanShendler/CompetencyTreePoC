import { useDispatch } from "react-redux";
import { toggleAddKnowledge } from "../../redux/addKnowledgeSlice";

const LayerNode = ({ data: { layerNum } }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-row justify-end items-start p-[5px]">
        <button onClick={() => dispatch(toggleAddKnowledge({open: true, layerNum}))} className="h-[25px] text-xs rounded-md bg-slate-800 hover:bg-slate-700 px-1 text-white">
          Add Knowledge
        </button>
      </div>
    </>
  );
};

export default LayerNode;
