// import { useState } from "react";
// import { useWorkflow } from "../context/workflowContext";
// import { Handle, Position, type NodeProps } from "reactflow";
// import { PlusCircle, X } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface BranchData {
//   condition: string;
// }

// type ConditionalNodeProps = NodeProps & {
//   data: {
//     appId: string;
//     typeKey: string;
//     label: string;
//     config?: Record<string, any>;
//     branches?: BranchData[];
//   };
// };

// const ConditionalNode = ({ id, data, selected }: ConditionalNodeProps) => {
//   const { addBranch, addDefaultBranch } = useWorkflow();
//   const [newCondition, setNewCondition] = useState('');
//   const [showBranchInput, setShowBranchInput] = useState(false);

//   const handleAddBranch = () => {
//     if (newCondition.trim()) {
//       addBranch(id, newCondition);
//       setNewCondition('');
//       setShowBranchInput(false);
//     }
//   };

//   return (
//     <div
//       className={`relative p-4 rounded-lg shadow-md bg-white border-2 ${
//         selected ? 'border-blue-500' : 'border-gray-200'
//       }`}
//       style={{ width: 220, minHeight: 120 }}
//     >
//       {/* Input Handle */}
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{ background: '#555', width: 10, height: 10 }}
//       />

//       {/* Header */}
//       <div className="flex items-center mb-3 gap-2">
//         <div
//           className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
//           style={{ background: '#f3f4f6' }}
//         >
//           ⚙️
//         </div>
//         <div className="font-medium text-gray-900">Condition</div>
//       </div>

//       {/* Branches List */}
//       <div className="mb-3">
//         <div className="text-sm font-medium text-gray-600 mb-1">Branches:</div>
//         <div className="space-y-2">
//           {data.branches?.map((branch:any, index:number) => (
//             <div key={index} className="flex items-center text-sm p-1 bg-gray-50 rounded">
//               <span>{branch.condition}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add Branch UI */}
//       {showBranchInput ? (
//         <div className="mb-2">
//           <div className="flex gap-2 mb-2">
//             <input
//               type="text"
//               className="flex-1 px-2 py-1 border rounded text-sm"
//               placeholder="Enter condition name"
//               value={newCondition}
//               onChange={(e) => setNewCondition(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleAddBranch()}
//             />
//             <button
//               className="text-gray-500 hover:text-gray-700"
//               onClick={() => setShowBranchInput(false)}
//             >
//               <X size={16} />
//             </button>
//           </div>
//           <Button
//             size="sm"
//             className="w-full text-xs py-1"
//             disabled={!newCondition.trim()}
//             onClick={handleAddBranch}
//           >
//             Add Branch
//           </Button>
//         </div>
//       ) : (
//         <Button
//           variant="outline"
//           size="sm"
//           className="w-full mb-2 mt-1 text-xs"
//           onClick={() => setShowBranchInput(true)}
//         >
//           <PlusCircle className="mr-1" size={14} />
//           Add Branch
//         </Button>
//       )}

//       <Button
//         variant="secondary"
//         size="sm"
//         className="w-full text-xs"
//         onClick={() => addDefaultBranch(id)}
//       >
//         Add Default Branch (Otherwise)
//       </Button>

//       {/* Output Handles - multiple outputs based on branches */}
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         style={{ background: '#555', width: 10, height: 10 }}
//       />
//     </div>
//   );
// };

// export default ConditionalNode;

import { useState, useEffect } from "react";
import { useWorkflow } from "../context/workflowContext";
import { Handle, Position, type NodeProps, useReactFlow } from "reactflow";
import { PlusCircle, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BranchData {
  condition: string;
  nodeId?: string;
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
  const { addBranch, addDefaultBranch, updateNodeData, nodes, edges } = useWorkflow();
  const [newCondition, setNewCondition] = useState('');
  const [showBranchInput, setShowBranchInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { getNode, setNodes } = useReactFlow();
  
  // Initialize branches array if it doesn't exist
  useEffect(() => {
    if (!data.branches) {
      updateNodeData(id, { branches: [] });
    }
  }, [id, data, updateNodeData]);

  // // Organize connected nodes into their respective branches
  // useEffect(() => {
  //   const autoLayout = () => {
  //     const currentNode = getNode(id);
  //     if (!currentNode || !data.branches) return;

  //     // Find all edges that come from this node
  //     const outgoingEdges = edges.filter(edge => edge.source === id);
      
  //     // Get all target nodes
  //     const connectedNodes = outgoingEdges.map(edge => {
  //       const targetNode = nodes.find(node => node.id === edge.target);
  //       return {
  //         nodeId: edge.target,
  //         condition: edge.data?.condition || 'default',
  //         node: targetNode
  //       };
  //     });

  //     if (connectedNodes.length === 0) return;

  //     // Calculate the horizontal offset needed for branches
  //     const branchCount = Math.max(data.branches.length, 1);
  //     const totalWidth = branchCount * 300; // 300px per branch
  //     const startX = currentNode.position.x - (totalWidth / 2) + 110; // Center the branches
  //     const branchY = currentNode.position.y + 150; // 150px below this node

  //     // Reposition all connected nodes based on branch position
  //     let updates = [];
  //     let branchIndex = 0;
      
  //     // Handle regular branches (non-default)
  //     const regularBranches = data.branches.filter(branch => branch.condition !== 'default');
  //     regularBranches.forEach((branch, index) => {
  //       const connectedNode = connectedNodes.find(n => 
  //         n.condition === branch.condition || 
  //         (branch.nodeId && n.nodeId === branch.nodeId)
  //       );
        
  //       if (connectedNode && connectedNode.node) {
  //         updates.push({
  //           id: connectedNode.nodeId,
  //           position: { 
  //             x: startX + (index * 300),
  //             y: branchY
  //           }
  //         });
          
  //         // Update branch with nodeId if not already set
  //         if (!branch.nodeId) {
  //           const updatedBranches = [...data.branches];
  //           updatedBranches[data.branches.indexOf(branch)].nodeId = connectedNode.nodeId;
  //           updateNodeData(id, { branches: updatedBranches });
  //         }
  //       }
  //       branchIndex = index + 1;
  //     });
      
  //     // Handle default branch (if exists)
  //     const defaultBranch = data.branches.find(branch => branch.condition === 'default');
  //     const defaultConnected = connectedNodes.find(n => 
  //       n.condition === 'default' || 
  //       (defaultBranch?.nodeId && n.nodeId === defaultBranch.nodeId)
  //     );
      
  //     if (defaultConnected && defaultConnected.node) {
  //       // Position default branch on the far right
  //       updates.push({
  //         id: defaultConnected.nodeId,
  //         position: { 
  //           x: startX + (branchIndex * 300),
  //           y: branchY
  //         }
  //       });
        
  //       // Update default branch with nodeId if not already set
  //       if (defaultBranch && !defaultBranch.nodeId) {
  //         const updatedBranches = [...data.branches];
  //         updatedBranches[data.branches.indexOf(defaultBranch)].nodeId = defaultConnected.nodeId;
  //         updateNodeData(id, { branches: updatedBranches });
  //       }
  //     }
      
  //     // Apply all position updates
  //     if (updates.length > 0) {
  //       setNodes(nodes => 
  //         nodes.map(node => {
  //           const update = updates.find(u => u.id === node.id);
  //           if (update) {
  //             return {
  //               ...node,
  //               position: update.position
  //             };
  //           }
  //           return node;
  //         })
  //       );
  //     }
  //   };

  //   // Run auto layout whenever branches or connections change
  //   autoLayout();
  // }, [id, data.branches, edges, nodes, getNode, setNodes, updateNodeData]);

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
      style={{ width: 220, minHeight: isExpanded ? 120 : 80 }}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: 10, height: 10 }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ background: '#f3f4f6' }}
          >
            ⚙️
          </div>
          <div className="font-medium text-gray-900">Condition</div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown 
            size={16} 
            className={`transform transition-transform ${isExpanded ? '' : 'rotate-180'}`} 
          />
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Branches List */}
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-600 mb-1">Branches:</div>
            <div className="space-y-2">
              {data.branches?.map((branch, index) => (
                <div 
                  key={index}
                  className="flex items-center text-sm p-1 bg-gray-50 rounded border border-gray-100"
                >
                  {branch.condition === 'default' ? 'Otherwise' : branch.condition}
                </div>
              ))}
              {(!data.branches || data.branches.length === 0) && (
                <div className="text-sm text-gray-400 italic">No branches defined</div>
              )}
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
              className="w-full mb-2 text-xs"
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
        </>
      )}
      
      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555', width: 10, height: 10 }}
      />
    </div>
  );
};

export default ConditionalNode;