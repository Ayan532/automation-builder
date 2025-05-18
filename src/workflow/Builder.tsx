import { BackgroundVariant, MarkerType, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Connection,
  type Edge,
 type Node,
  type OnConnect,
 type ReactFlowInstance
} from 'reactflow';

import { Play, Pause, Trash2, Clock, Plus } from 'lucide-react';
import { SAMPLE_APPS } from './workflow-data';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import CustomEdge from './edges/CustomEdge';
import { useWorkflow, WorkflowProvider } from './context/workflowContext';
import { toast } from 'sonner';
import HeaderBar from './_comps/HeaderBar';
import ConfigPanel from './_comps/ConfigPannel';
import DefaultNode from './nodes/DefaultNode';
import ConditionalNode from './nodes/ConditionalNode';



// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  default: ActionNode
};

// Define custom edge types
const edgeTypes = {
  custom: CustomEdge
};

type AppSelectionStep = 'app' | 'type' | 'condition' | 'config';

 function BuilderContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onNodesChange, 
    onEdgesChange, 
    selectedNode, 
    selectNode 
  } = useWorkflow();

  // Initialize workflow with a trigger node if empty
  useEffect(() => {
    if (nodes.length === 0) {
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
          id: 'end',
          type: 'default',
          position: { x: 250, y: 500 },
          data: { 
            name: 'End',
          }
        }
      ];

      const initalEdges=[
        {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'end',
        type: 'custom',
        markerEnd: {
          type: MarkerType.Arrow,
        }
      }
      ]
      
      setNodes(initialNodes);
      setEdges(initalEdges)
    }
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    // Create edge with custom type
    const newEdge = {
      ...connection,
      type: 'custom',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const nodeType = event.dataTransfer.getData('application/reactflow/type');
      const appId = event.dataTransfer.getData('application/reactflow/app');
      const type = event.dataTransfer.getData('application/reactflow/nodetype');
      
      // Check if the dropped app exists
      const app = SAMPLE_APPS[appId as keyof typeof SAMPLE_APPS];
      if (!app) return;

      // Get action or trigger data
      let nodeData;
      if (nodeType === 'trigger') {
        nodeData = app.triggers[type as keyof typeof app.triggers];
      } else if (nodeType === 'action') {
        nodeData = app.actions[type as keyof typeof app.actions];
      }
      
      if (!nodeData) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          appId,
          type,
          name: nodeData.label,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
      
      // Select the newly created node for configuration
      selectNode(newNode.id);
    },
    [reactFlowInstance, setNodes, selectNode]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  // We don't need app modal handlers anymore since we're using dropdowns in the edges

  // Memoize the node types to avoid re-creation on each render
  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
    default: DefaultNode,
    conditional: ConditionalNode,
  }), []);
  
  // Memoize the edge types to avoid re-creation on each render 
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge
  }), []);
  
  // Determine if config panel should be shown
  const showConfigPanel = !!selectedNode;

  return (
   

      
      
      <div className="flex flex-col h-screen">
      <HeaderBar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="workflow-canvas flex-1 relative bg-gray-50 bg-grid" style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlowProvider>
     
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onInit={setReactFlowInstance}
              fitView
              attributionPosition="bottom-right"
              deleteKeyCode="Delete"
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#e5e7eb"
              />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        
        {showConfigPanel && <ConfigPanel />}
      </div>
    </div>
    
  );
}

export default function Builder() {
  return (
    <WorkflowProvider>
      <BuilderContent />
    </WorkflowProvider>
  );
}