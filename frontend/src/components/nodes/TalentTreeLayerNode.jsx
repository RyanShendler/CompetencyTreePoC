const TalentTreeLayerNode = ({data}) => {
  return (
    <>
      <div className="flex flex-col overflow-clip">
        <div className="w-full flex flex-row justify-between">
          <div className="text-xs bg-white rounded-br-sm p-1 font-medium">{`Layer ${data.layerNum}`}</div>
          <div className="text-xs bg-white rounded-br-sm p-1 font-medium">{`Required Knowledge: ${data.reqKnowledge}`}</div>
        </div>
      </div>
    </>
  );
};

export default TalentTreeLayerNode