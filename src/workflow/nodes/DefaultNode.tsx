import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

const DefaultNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={`node w-auto ${selected ? 'selected' : ''}`}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden text-center p-3">
        <span className="text-sm font-medium text-gray-600">End</span>
        <Handle
          type="target"
          position={Position.Top}
          id="target"
          className="handle target-handle"
          style={{ 
            top: -6, 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            background: '#9ca3af',
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />
      </div>
    </div>
  );
};

export default memo(DefaultNode);