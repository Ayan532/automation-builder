import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  type ReactNode,
  useMemo
} from 'react';

import {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  MarkerType,
  type XYPosition
} from 'reactflow';

interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  addBranch: (nodeId: string, condition: string) => void;
  addDefaultBranch: (nodeId: string) => void;
  addTriggerNode: (position: XYPosition) => void;
  saveWorkflow: () => void;
  resetWorkflow: () => void;
  setNodes: React.Dispatch<React.SetStateAction<Node<any>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);



export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  
  return context;
};


export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Select a node for configuration
  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId);
  }, []);

  // Update node data
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes(nds => 
      nds.map(node => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add a conditional branch from a node
  const addBranch = useCallback((sourceNodeId: string, condition: string) => {
    // Create a new action node for this branch
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    if (!sourceNode) return;

    // Calculate position for the new branch node (offset to the right)
    const newNodeId = `action-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'action',
      position: { 
        x: sourceNode.position.x + 300, 
        y: sourceNode.position.y + 100 
      },
      data: { 
        isEmpty: true,
        condition: condition
      }
    };

    // Add the node
    setNodes(nds => [...nds, newNode]);

    // Create an edge with the condition
    const newEdge: Edge = {
      id: `e${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      target: newNodeId,
      type: 'custom',
      data: {
        condition: condition
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    };

    // Add the edge
    setEdges(eds => [...eds, newEdge]);
    
    // Select the new node for configuration
    selectNode(newNodeId);
  }, [nodes, setNodes, setEdges, selectNode]);

  // Add a default branch (else condition)
  const addDefaultBranch = useCallback((sourceNodeId: string) => {
    // Create a new action node for the default branch
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    if (!sourceNode) return;

    // Calculate position for the new branch node (offset to the left)
    const newNodeId = `action-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'action',
      position: { 
        x: sourceNode.position.x - 300, 
        y: sourceNode.position.y + 100 
      },
      data: { 
        isEmpty: true,
        condition: 'default'
      }
    };

    // Add the node
    setNodes(nds => [...nds, newNode]);

    // Create an edge with the default condition
    const newEdge: Edge = {
      id: `e${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      target: newNodeId,
      type: 'custom',
      data: {
        condition: 'default'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    };

    // Add the edge
    setEdges(eds => [...eds, newEdge]);
    
    // Select the new node for configuration
    selectNode(newNodeId);
  }, [nodes, setNodes, setEdges, selectNode]);

  // Save workflow
  const saveWorkflow = useCallback(() => {
    const workflowData = {
      nodes,
      edges
    };
    
    // In a real app, this would make an API call to save the workflow
    console.log('Saving workflow:', workflowData);
    localStorage.setItem('savedWorkflow', JSON.stringify(workflowData));
  }, [nodes, edges]);

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    // Create a new trigger node
    const initialNodes: Node[] = [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 100 },
        data: { 
          name: 'Empty Trigger',
          isEmpty: true
        }
      },
      {
        id: 'default-1',
        type: 'default',
        position: { x: 250, y: 300 },
        data: { 
          name: 'End',
        }
      }
    ];
    
    // Create an edge from trigger to end
    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'default-1',
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        }
      }
    ];
    
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Add new trigger node
  const addTriggerNode = useCallback((position: XYPosition) => {
    // Find an end node if it exists
    const endNode = nodes.find(node => node.type === 'default');
    if (!endNode) return;
    
    // Create a new trigger node
    const newTriggerId = `trigger-${Date.now()}`;
    const newTriggerNode: Node = {
      id: newTriggerId,
      type: 'trigger',
      position: position,
      data: { 
        name: 'Empty Trigger',
        isEmpty: true
      }
    };
    
    // Add the node
    setNodes(nds => [...nds, newTriggerNode]);
    
    // Create an edge to connect the trigger to the end node
    const newEdge: Edge = {
      id: `e${newTriggerId}-${endNode.id}`,
      source: newTriggerId,
      target: endNode.id,
      type: 'custom',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    };
    
    // Add the edge
    setEdges(eds => [...eds, newEdge]);
    
    // Select the new trigger node
    selectNode(newTriggerId);
  }, [nodes, setNodes, setEdges, selectNode]);

  // Create context value
  const contextValue = useMemo(() => ({
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    selectNode,
    updateNodeData,
    addBranch,
    addDefaultBranch,
    addTriggerNode,
    saveWorkflow,
    resetWorkflow,
    setNodes,
    setEdges,
  }), [
    nodes, 
    edges, 
    selectedNode, 
    onNodesChange, 
    onEdgesChange, 
    selectNode, 
    updateNodeData, 
    addBranch, 
    addDefaultBranch, 
    addTriggerNode,
    saveWorkflow, 
    resetWorkflow,
    setNodes,
    setEdges
  ]);
  
  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};

