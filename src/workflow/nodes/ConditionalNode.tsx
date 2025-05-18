import { useState } from "react";
import { useWorkflow } from "../context/workflowContext";
import { Handle, Position, type NodeProps } from "reactflow";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BranchData {
  condition: string;
}

type ConditionalNodeProps = NodeProps & {
  data: {
    appId: string;
    typeKey: string;
    label: string;
    config?: Record<string, any>;
    branches?: BranchData[];
  };
};

const ConditionalNode = ({ id, data, selected }: ConditionalNodeProps) => {
  const { addBranch, addDefaultBranch } = useWorkflow();
  const [newCondition, setNewCondition] = useState('');
  const [showBranchInput, setShowBranchInput] = useState(false);

  const handleAddBranch = () => {
    if (newCondition.trim()) {
      addBranch(id, newCondition);
      setNewCondition('');
      setShowBranchInput(false);
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg shadow-md bg-white border-2 ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
      style={{ width: 220, minHeight: 120 }}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: 10, height: 10 }}
      />

      {/* Header */}
      <div className="flex items-center mb-3 gap-2">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ background: '#f3f4f6' }}
        >
          ⚙️
        </div>
        <div className="font-medium text-gray-900">Condition</div>
      </div>

      {/* Branches List */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-600 mb-1">Branches:</div>
        <div className="space-y-2">
          {data.branches?.map((branch:any, index:number) => (
            <div key={index} className="flex items-center text-sm p-1 bg-gray-50 rounded">
              <span>{branch.condition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Branch UI */}
      {showBranchInput ? (
        <div className="mb-2">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-2 py-1 border rounded text-sm"
              placeholder="Enter condition name"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
            />
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowBranchInput(false)}
            >
              <X size={16} />
            </button>
          </div>
          <Button
            size="sm"
            className="w-full text-xs py-1"
            disabled={!newCondition.trim()}
            onClick={handleAddBranch}
          >
            Add Branch
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-2 mt-1 text-xs"
          onClick={() => setShowBranchInput(true)}
        >
          <PlusCircle className="mr-1" size={14} />
          Add Branch
        </Button>
      )}

      <Button
        variant="secondary"
        size="sm"
        className="w-full text-xs"
        onClick={() => addDefaultBranch(id)}
      >
        Add Default Branch (Otherwise)
      </Button>

      {/* Output Handles - multiple outputs based on branches */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555', width: 10, height: 10 }}
      />
    </div>
  );
};

export default ConditionalNode;