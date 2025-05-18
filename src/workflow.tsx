import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  useNodesState, 
  useEdgesState, 
  useReactFlow,
  Controls,
  MiniMap, 
  Background,
  Panel,
  Handle,
  Position,
  addEdge,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import Icons
import { 
  AlertCircle, 
  ChevronDown, 
  Search, 
  HelpCircle, 
  X, 
  Plus, 
  Settings,
  Copy,
  Save,
  Play,
  Trash2
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Context API setup
const WorkflowContext = createContext();

const useWorkflow = () => useContext(WorkflowContext);

// Initial elements
const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { name: 'Empty Trigger', icon: AlertCircle },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 250, y: 300 },
    data: { label: 'End' },
    style: {
      background: '#f9fafb',
      color: '#374151',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      padding: '10px',
      width: 80,
      textAlign: 'center',
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'custom',
  },
];

// Sample applications data
const SAMPLE_APPS = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    color: 'bg-red-100',
    description: 'Gmail integration',
    triggers: {
      new_email: {
        key: 'new_email',
        label: 'New Email',
        description: 'Triggers when new mail is found in your Gmail inbox',
        appId: 'gmail',
        config: {}
      },
      new_labeled_email: {
        key: 'new_labeled_email',
        label: 'New Labeled Email',
        description: 'Triggers when a label is added to an email',
        appId: 'gmail',
        config: {}
      }
    },
    actions: {
      send_email: {
        key: 'send_email',
        label: 'Send Email',
        appId: 'gmail',
        description: 'Send an email via Gmail',
        config: {}
      }
    }
  },
  sheets: {
    id: 'sheets',
    name: 'Google Sheets',
    icon: '📊',
    color: 'bg-green-100',
    description: 'Google Sheets integration',
    triggers: {
      new_row: {
        key: 'new_row',
        label: 'New Row',
        description: 'Triggers when a new row is added to a sheet',
        appId: 'sheets',
        config: {}
      }
    },
    actions: {
      add_row: {
        key: 'add_row',
        label: 'Add Row',
        appId: 'sheets',
        description: 'Add a new row to a Google Sheet',
        config: {}
      }
    }
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    color: 'bg-purple-100',
    description: 'Slack integration',
    triggers: {
      new_message: {
        key: 'new_message',
        label: 'New Message',
        description: 'Triggers when a new message is posted to a channel',
        appId: 'slack',
        config: {}
      }
    },
    actions: {
      send_message: {
        key: 'send_message',
        label: 'Send Message',
        appId: 'slack',
        description: 'Send a message to a Slack channel',
        config: {}
      }
    }
  },
  contacts: {
    id: 'contacts',
    name: 'Contacts',
    icon: '👥',
    color: 'bg-blue-100',
    description: 'Contacts management',
    triggers: {
      new_contact: {
        key: 'new_contact',
        label: 'New Contact',
        description: 'Triggers when a new contact is created',
        appId: 'contacts',
        config: {}
      }
    },
    actions: {
      create_contact: {
        key: 'create_contact',
        label: 'Create Contact',
        appId: 'contacts',
        description: 'Create a new contact',
        config: {}
      }
    }
  },
  // core: {
  //   id: 'core',
  //   name: 'Core',
  //   icon: '⚙️',
  //   color: 'bg-gray-100',
  //   description: 'Core automation functions',
  //   actions: {
  //     condition: {
  //       key: 'condition',
  //       label: 'Condition',
  //       appId: 'core',
  //       description: 'Add a conditional branch to your workflow',
  //       config: {}
  //     },
  //     delay: {
  //       key: 'delay',
  //       label: 'Delay',
  //       appId: 'core',
  //       description: 'Delay execution for a specified time',
  //       config: {}
  //     }
  //   }
  // },
};

// Main workflow provider component
const WorkflowProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeEdge, setActiveEdge] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [configSidebar, setConfigSidebar] = useState({ isOpen: false, nodeData: null });
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges]
  );
  
  const onEdgeClick = useCallback((edgeId, sourceId, targetId, x, y) => {
    setActiveEdge({ id: edgeId, sourceId, targetId });
    setDropdownPosition({ x, y });
    setShowDropdown(true);
  }, []);
  
  const closeDropdown = useCallback(() => {
    setShowDropdown(false);
    setActiveEdge(null);
  }, []);
  
  const handleAppOptionSelect = useCallback(({ app, option, type, sourceNodeId, targetNodeId, edgeId }) => {
    // Determine if we need to replace the end node or insert a new node
    const isEndNode = targetNodeId === '2';
    const newNodeId = `node-${Date.now()}`;
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    
    if (!sourceNode) return;
    
    // Position for the new node
    const newNodePosition = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 150,
    };
    
    // Create the new node
    const newNode = {
      id: newNodeId,
      type: type === 'triggers' ? 'trigger' : 'action',
      position: newNodePosition,
      data: {
        name: option.label,
        label: option.label,
        description: option.description,
        icon: app.icon,
        color: app.color,
        appId: app.id,
        key: option.key,
        type: type === 'triggers' ? 'trigger' : 'action',
      },
    };
    
    // Update nodes based on whether we're replacing the end node or inserting a new node
    let newNodes = [...nodes];
    if (isEndNode) {
      // Move the end node down
      const endNode = nodes.find(node => node.id === targetNodeId);
      if (!endNode) return;
      
      const updatedEndNode = {
        ...endNode,
        position: {
          x: endNode.position.x,
          y: newNodePosition.y + 150,
        },
      };
      
      newNodes = [
        ...nodes.filter(node => node.id !== targetNodeId),
        newNode,
        updatedEndNode,
      ];
      
      // Update the edges
      const updatedEdges = edges.map(edge => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            target: newNodeId,
          };
        }
        return edge;
      });
      
      // Add a new edge from the new node to the end node
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: newNodeId,
        target: targetNodeId,
        type: 'custom',
      };
      
      setEdges([...updatedEdges, newEdge]);
    } else {
      // If not replacing the end node, just add the new node and update edges
      newNodes = [...nodes, newNode];
      
      // Update the edges
      const updatedEdges = edges.map(edge => {
        if (edge.id === edgeId) {
          // Redirect the original edge to the new node
          return {
            ...edge,
            target: newNodeId,
          };
        }
        return edge;
      });
      
      // Add a new edge from the new node to the original target
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: newNodeId,
        target: targetNodeId,
        type: 'custom',
      };
      
      setEdges([...updatedEdges, newEdge]);
    }
    
    // Update nodes
    setNodes(newNodes);
    
    // Open configuration sidebar for the new node
    setConfigSidebar({
      isOpen: true,
      nodeData: {
        ...newNode.data,
        id: newNodeId,
      },
    });
  }, [nodes, edges, setNodes, setEdges]);
  const handleAddConditional = useCallback(() => {
  if (!activeEdge || !reactFlowInstance) return;
  
  const { sourceId, targetId, id: edgeId } = activeEdge;
  const sourceNode = reactFlowInstance.getNode(sourceId);
  const targetNode = reactFlowInstance.getNode(targetId);
  
  if (!sourceNode || !targetNode) return;
  
  const newNodeId = `conditional-${Date.now()}`;
  
  // Position the conditional node between source and target
  const newNodePosition = {
    x: sourceNode.position.x,
    y: sourceNode.position.y + 150,
  };
  
  // Create the conditional node
  const conditionalNode = {
    id: newNodeId,
    type: 'condition',
    position: newNodePosition,
    data: {
      name: 'Condition',
      condition: {
        type: 'simple',
        valueType: 'string',
        leftValue: '',
        operator: 'equals',
        rightValue: '',
        summary: 'Set condition...'
      },
      branches: [
        { id: 'true', type: 'true', label: 'True' },
        { id: 'false', type: 'false', label: 'False' },
      ],
    },
  };
  
  // Remove the existing edge
  const remainingEdges = edges.filter(e => e.id !== edgeId);
  
  // Build new edges:
  // Source → conditional
  // conditional:true → target
  // conditional:false → target (or to a new node if needed)
  const newEdges = [
    {
      id: `e-${newNodeId}-in`,
      source: sourceId,
      target: newNodeId,
      type: 'custom',
    },
    {
      id: `e-${newNodeId}-true`,
      source: newNodeId,
      sourceHandle: 'true',
      target: targetId,
      type: 'custom',
      data: { label: 'True' },
    },
    {
      id: `e-${newNodeId}-false`,
      source: newNodeId,
      sourceHandle: 'false',
      target: targetId,
      type: 'custom',
      data: { label: 'False' },
    },
  ];
  
  // Update state
  setNodes(nds => [...nds, conditionalNode]);
  setEdges(eds => [...remainingEdges, ...newEdges]);
  
  // Open the sidebar to configure the new node
  setConfigSidebar({
    isOpen: true,
    nodeData: {
      ...conditionalNode.data,
      id: newNodeId,
      type: 'condition'
    }
  });
  
  // Close dropdown
  closeDropdown();
}, [activeEdge, edges, reactFlowInstance, setNodes, setEdges, closeDropdown]);

const updateNodeData = useCallback((nodeId, updatedData) => {
  setNodes(nodes => 
    nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData
          }
        };
      }
      return node;
    })
  );
}, [setNodes]);

const deleteNode = useCallback((nodeId) => {
  // Remove all edges connected to this node
  setEdges(edges => edges.filter(edge => 
    edge.source !== nodeId && edge.target !== nodeId
  ));
  
  // Remove the node itself
  setNodes(nodes => nodes.filter(node => node.id !== nodeId));
}, [setEdges, setNodes]);

// Fix for the duplicateNode helper function (add this to your WorkflowProvider)
const duplicateNode = useCallback((nodeId) => {
  const nodeToDuplicate = nodes.find(node => node.id === nodeId);
  if (!nodeToDuplicate) return;
  
  const newNodeId = `${nodeToDuplicate.type}-${Date.now()}`;
  const newNode = {
    ...nodeToDuplicate,
    id: newNodeId,
    position: {
      x: nodeToDuplicate.position.x + 50,
      y: nodeToDuplicate.position.y + 50
    }
  };
  
  setNodes(nodes => [...nodes, newNode]);
}, [nodes, setNodes]);



  
  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onEdgeClick,
        activeEdge,
        showDropdown,
        dropdownPosition,
        closeDropdown,
        handleAppOptionSelect,
        updateNodeData,
        configSidebar,
        setConfigSidebar,
        reactFlowWrapper,
        setReactFlowInstance,
        handleAddConditional,deleteNode,duplicateNode      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

// Custom nodes
const TriggerNode = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-md shadow-md p-4 border border-gray-200 w-64">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-md ${data.color || 'bg-gray-100'}`}>
          {data.icon && typeof data.icon === 'string' ? (
            <span className="text-xl">{data.icon}</span>
          ) : (
            <AlertCircle className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{data.title || '1. Select Trigger'}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">{data.name}</div>
        </div>
      </div>
      
      {data.name === "Empty Trigger" && (
        <div className="flex items-center mt-2 text-amber-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="text-xs">Configure this trigger</span>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Continuing from where the code left off...

// Complete the ActionNode component
const ActionNode = ({ data, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { setConfigSidebar, deleteNode, duplicateNode } = useWorkflow();
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const openConfig = () => {
    setConfigSidebar({
      isOpen: true,
      nodeData: { ...data, id }
    });
  };
  
  return (
    <div className="bg-white rounded-md shadow-md p-4 border border-gray-200 w-64 relative">
      {/* Node menu */}
      <div className="absolute top-2 right-2">
        <button 
          className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
        {showMenu && (
          <div ref={menuRef} className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={openConfig}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  duplicateNode(id);
                  setShowMenu(false);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  deleteNode(id);
                  setShowMenu(false);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-md ${data.color || 'bg-gray-100'}`}>
          {data.icon && typeof data.icon === 'string' ? 
            (<span className="text-xl">{data.icon}</span>) : 
            (<data.icon className="w-6 h-6 text-gray-500" />)
          }
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{data.label || data.name}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">{data.appId}</div>
          {data.description && (
            <div className="text-xs text-gray-400 mt-1">{data.description}</div>
          )}
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom edge component with path decoration and controls
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, target }) => {
  const { onEdgeClick } = useWorkflow();
  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };
  
  const [edgePath, labelX, labelY] = getBezierPath(edgePathParams);
  
  const handleClick = (event) => {
    event.stopPropagation();
    onEdgeClick(id, source, target, event.clientX, event.clientY);
  };
  
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#b1b1b7"
        strokeDasharray="5,5"
        onClick={handleClick}
      />
      <circle
        cx={labelX}
        cy={labelY}
        r={5}
        fill="#fff"
        stroke="#b1b1b7"
        strokeWidth={1}
        onClick={handleClick}
        className="cursor-pointer hover:fill-blue-100"
      />
      <circle
        cx={labelX}
        cy={labelY}
        r={2}
        fill="#b1b1b7"
        onClick={handleClick}
        className="cursor-pointer"
      />
    </>
  );
};



// App Dropdown component for edge connections
const EdgeDropdown = () => {
  const { showDropdown, dropdownPosition, closeDropdown, activeEdge, handleAppOptionSelect,handleAddConditional } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState('actions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  
  const apps = Object.values(SAMPLE_APPS);
  
  if (!showDropdown) return null;
  
  // Filter apps and options based on search term
  const filteredApps = apps.filter(app => {
    // If we're looking at triggers, only show apps with triggers
    if (selectedCategory === 'triggers' && Object.keys(app.triggers || {}).length === 0) {
      return false;
    }
    
    // If we're looking at actions, only show apps with actions
    if (selectedCategory === 'actions' && Object.keys(app.actions || {}).length === 0) {
      return false;
    }
    
    // If there's a search term, filter by app name or description
    if (searchTerm) {
      return (
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });
  
  const handleSelect = (app, option) => {
  
    handleAppOptionSelect({
      app,
      option,
      type: selectedCategory,
      sourceNodeId: activeEdge.sourceId,
      targetNodeId: activeEdge.targetId,
      edgeId: activeEdge.id,
    });
  };
  
  return (
    <div
      className="absolute bg-white shadow-xl rounded-lg border border-gray-200 w-80 z-50"
      style={{ top: dropdownPosition.y, left: dropdownPosition.x }}
    >

     <div className="border-b border-gray-200 p-2">
        <button 
          className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center"
          onClick={() => {
            handleAddConditional();  // Call handleAddConditional directly
            closeDropdown();  // Close dropdown after adding condition
          }}>
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-yellow-100">
            {/* Diamond icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-600">
              <polygon points="12 2 22 12 12 22 2 12 12 2"/>
            </svg>
          </div>
          <div className="ml-3">
            <div className="font-medium text-sm">Condition</div>
            <div className="text-xs text-gray-500">Add branching logic to workflow</div>
          </div>
        </button>
      </div>

         

      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-medium">Insert a step</h3>
        <button onClick={closeDropdown} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Category selector */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center ${selectedCategory === 'actions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setSelectedCategory('actions')}
        >
          Actions
        </button>
        <button
          className={`flex-1 py-2 text-center ${selectedCategory === 'triggers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setSelectedCategory('triggers')}
        >
          Triggers
        </button>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* App selection or app details */}
      <div className="max-h-96 overflow-y-auto">
        {!selectedApp ? (
          // App list
          <div className="p-2">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <button
                  key={app.id}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${app.color}`}>
                    <span className="text-xl">{app.icon}</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-sm">{app.name}</div>
                    <div className="text-xs text-gray-500">{app.description}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No apps found for your search.
              </div>
            )}
             
          </div>
        ) : (
          // App details - show triggers or actions based on selected category
          <div>
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <button
                className="flex items-center text-blue-600 text-sm"
                onClick={() => setSelectedApp(null)}
              >
                <ChevronDown className="w-4 h-4 transform rotate-90" />
                Back to apps
              </button>
            </div>
            <div className="p-2">
              <div className="flex items-center p-2">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${selectedApp.color}`}>
                  <span className="text-xl">{selectedApp.icon}</span>
                </div>
                <div className="ml-3">
                  <div className="font-medium">{selectedApp.name}</div>
                  <div className="text-xs text-gray-500">{selectedApp.description}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase px-2">
                  {selectedCategory === 'triggers' ? 'Triggers' : 'Actions'}
                </h4>
                
                {selectedCategory === 'triggers' ? (
                  Object.values(selectedApp.triggers || {}).length > 0 ? (
                    Object.values(selectedApp.triggers).map((trigger) => (
                      <button
                        key={trigger.key}
                        className="w-full text-left p-2 mt-1 hover:bg-gray-50 rounded-md"
                        onClick={() => handleSelect(selectedApp, trigger)}
                      >
                        <div className="font-medium text-sm">{trigger.label}</div>
                        <div className="text-xs text-gray-500">{trigger.description}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No triggers available for this app.
                    </div>
                  )
                ) : (
                  Object.values(selectedApp.actions || {}).length > 0 ? (
                    Object.values(selectedApp.actions).map((action) => (
                      <button
                        key={action.key}
                        className="w-full text-left p-2 mt-1 hover:bg-gray-50 rounded-md"
                        onClick={() => handleSelect(selectedApp, action)}
                      >
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No actions available for this app.
                    </div>
                  )
                )}
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Configuration sidebar component
const ConfigurationSidebar = () => {
  const { configSidebar, setConfigSidebar, updateNodeData,handleAddConditional } = useWorkflow();
  const [nodeConfig, setNodeConfig] = useState({});
  
  useEffect(() => {
    if (configSidebar.nodeData) {
      setNodeConfig(configSidebar.nodeData.config?.fields || {});
    }
  }, [configSidebar.nodeData]);
  
  if (!configSidebar.isOpen || !configSidebar.nodeData) return null;
  
  const { nodeData } = configSidebar;

  console.log({nodeData})
  
  const handleChange = (field, value) => {
    setNodeConfig(prev => ({
      ...prev,
      [field.key]: value
    }));
  };
  
const handleSave = () => {
    // Update node data with new configuration
    // Pass the node ID and updated configuration
    updateNodeData(configSidebar.nodeData.id, {
      config: {
        ...configSidebar.nodeData.config,
        fields: nodeConfig
      }
    });
    
    // Close the sidebar and show success message
    setConfigSidebar({ isOpen: false, nodeData: null });
    toast.success("Configuration saved");
  };
  
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder={field.placeholder}
            value={nodeConfig[field.key] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder={field.placeholder}
            value={nodeConfig[field.key] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            value={nodeConfig[field.key] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            className="w-5 h-5 border border-gray-300 rounded"
            checked={nodeConfig[field.key] || false}
            onChange={(e) => handleChange(field, e.target.checked)}
          />
        );
      case 'range':
        return (
          <div className="w-full">
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full"
              value={nodeConfig[field.key] || field.default}
              onChange={(e) => handleChange(field, parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.min}</span>
              <span>{nodeConfig[field.key] || field.default}</span>
              <span>{field.max}</span>
            </div>
          </div>
        );
      case 'dynamic':
        return (
          <div className="border border-gray-300 rounded-md p-2">
            {field.fields.map((subfield) => (
              <div key={subfield.key} className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {subfield.label}
                </label>
                <input
                  type={subfield.type}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder={subfield.placeholder}
                  value={(nodeConfig[field.key] || {})[subfield.key] || ''}
                  onChange={(e) => {
                    const currentValues = nodeConfig[field.key] || {};
                    handleChange(field, {
                      ...currentValues,
                      [subfield.key]: e.target.value
                    });
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

 
    if (nodeData.key === 'condition') {
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-lg">Configure Condition</h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={() => setConfigSidebar({ isOpen: false, nodeData: null })}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <ConditionalNodeConfig
          nodeData={nodeData}
          onSave={(config) => {
            updateNodeData(nodeData.id, config);
            setConfigSidebar({ isOpen: false, nodeData: null });
            toast.success('Condition saved');
          }}
        />
      </div>
    </div>
  );
}
  
  
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-lg">Configure {nodeData.name}</h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setConfigSidebar({ isOpen: false, nodeData: null })}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-md ${nodeData.color || 'bg-gray-100'}`}>
              {nodeData.icon && typeof nodeData.icon === 'string' ? 
                (<span className="text-xl">{nodeData.icon}</span>) : 
                (<nodeData.icon className="w-6 h-6 text-gray-500" />)
              }
            </div>
            <div className="ml-3">
              <div className="font-medium">{nodeData.name}</div>
              <div className="text-sm text-gray-500">{nodeData.description}</div>
            </div>
          </div>
        </div>
        
        {nodeData.config && nodeData.config.fields ? (
          <div className="space-y-4">
            {nodeData.config.fields.map((field) => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                )}
              </div>
            ))}
            
            <div className="pt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                onClick={handleSave}
              >
                Save Configuration
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            No configuration options available for this node.
          </div>
        )}
      </div>
    </div>
  );
};

export const ConditionalNode = ({ data, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { setConfigSidebar, deleteNode, duplicateNode } = useWorkflow();
  const menuRef = useRef(null);
  
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const openConfig = () => {
    setConfigSidebar({
      isOpen: true,
      nodeData: {
        ...data,
        id,
        type: 'conditional'
      }
    });
  };
  
  return (
    <div className="bg-white rounded-md shadow-md p-4 border border-gray-200 w-64 relative">
      {/* Node Menu */}
      <div className="absolute top-2 right-2">
        <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-100 rounded-full">
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
        {showMenu && (
          <div ref={menuRef} className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <button onClick={openConfig} className="w-full text-left px-4 py-2 hover:bg-gray-50">
              <Settings className="w-4 h-4 inline mr-2" />
              Configure
            </button>
            <button onClick={() => {
              duplicateNode(id);
              setShowMenu(false);
            }} className="w-full text-left px-4 py-2 hover:bg-gray-50">
              <Copy className="w-4 h-4 inline mr-2" />
              Duplicate
            </button>
            <button onClick={() => {
              deleteNode(id);
              setShowMenu(false);
            }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Node Content */}
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-yellow-100">
          {/* Diamond Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-600">
            <polygon points="12 2 22 12 12 22 2 12 12 2"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Condition</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transform ${isOpen ? 'rotate-180' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {data.condition?.summary || 'Set condition...'}
          </div>
          
          {/* Branch Summary */}
          {isOpen && data.branches && (
            <div className="mt-2 pl-2 border-l-2 border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">Branches:</div>
              {data.branches.map((b) => (
                <div key={b.id} className="flex items-center text-xs text-gray-600 mb-1">
                  <span 
                    className={`w-2 h-2 rounded-full mr-1 ${
                      b.type === 'true' ? 'bg-green-500' : 
                      b.type === 'false' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  ></span>
                  {b.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Input Handle */}
      <Handle type="target" position={Position.Top} />
      
      {/* Output Handles for each branch */}
      {data.branches?.map((b, idx) => (
        <Handle
          key={b.id}
          id={b.id}
          type="source"
          position={Position.Bottom}
          style={{ left: `${20 + idx * 50}%` }}
        >
          <div className="absolute -bottom-6 text-xs whitespace-nowrap transform -translate-x-1/2 left-1/2">
            {b.label}
          </div>
        </Handle>
      ))}
    </div>
  );
};

// --- Conditional Node Configuration for Sidebar ---
const ConditionalNodeConfig = ({ nodeData, onSave }) => {
  const [type, setType] = useState(nodeData.condition?.type || 'simple');
  const [valueType, setValueType] = useState(nodeData.condition?.valueType || 'string');
  const [leftValue, setLeftValue] = useState(nodeData.condition?.leftValue || '');
  const [operator, setOperator] = useState(nodeData.condition?.operator || 'equals');
  const [rightValue, setRightValue] = useState(nodeData.condition?.rightValue || '');
  const [branches, setBranches] = useState(
    nodeData.branches || [
      { id: 'true', type: 'true', label: 'True' },
      { id: 'false', type: 'false', label: 'False' }
    ]
  );

  const SUMMARY_OP = {
    string: {
      equals: 'equals',
      not_equals: '!=',
      contains: 'contains',
      starts_with: 'starts with',
      ends_with: 'ends with'
    },
    number: {
      equals: '=',
      not_equals: '!=',
      greater_than: '>',
      less_than: '<',
      greater_or_equal: '>=',
      less_or_equal: '<='
    },
    boolean: {
      equals: '='
    }
  };

  const getSummary = () => {
    if (type === 'simple') {
      return `${leftValue} ${SUMMARY_OP[valueType][operator] || operator} ${rightValue}`;
    }
    return 'Advanced condition';
  };

  const handleSave = () => {
    onSave({
      ...nodeData,
      condition: {
        type,
        valueType,
        leftValue,
        operator,
        rightValue,
        summary: getSummary()
      },
      branches
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Type Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Condition Type</label>
        <select 
          value={type} 
          onChange={e => setType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="simple">Simple</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {type === 'simple' && (
        <>
          <div>
            <label className="block mb-1">Value Type</label>
            <select 
              value={valueType} 
              onChange={e => setValueType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Left Value</label>
            <input 
              type="text" 
              value={leftValue} 
              onChange={e => setLeftValue(e.target.value)}
              placeholder="steps.trigger.data.field"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Operator</label>
            <select 
              value={operator} 
              onChange={e => setOperator(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {valueType === 'string' && (
                <>
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not equals</option>
                  <option value="contains">Contains</option>
                  <option value="starts_with">Starts with</option>
                  <option value="ends_with">Ends with</option>
                </>
              )}
              {valueType === 'number' && (
                <>
                  <option value="equals">Equals (=)</option>
                  <option value="not_equals">Not equals (!=)</option>
                  <option value="greater_than">Greater than (&gt;)</option>
                  <option value="less_than">Less than (&lt;)</option>
                  <option value="greater_or_equal">Greater or equal (&gt;=)</option>
                  <option value="less_or_equal">Less or equal (&lt;=)</option>
                </>
              )}
              {valueType === 'boolean' && (
                <>
                  <option value="equals">Equals</option>
                </>
              )}
            </select>
          </div>

          {valueType !== 'boolean' && (
            <div>
              <label className="block mb-1">Right Value</label>
              <input 
                type="text" 
                value={rightValue} 
                onChange={e => setRightValue(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </>
      )}

      {/* Advanced Field */}
      {type === 'advanced' && (
        <div>
          <label className="block mb-1">Expression</label>
          <textarea 
            rows={4} 
            value={leftValue} 
            onChange={e => setLeftValue(e.target.value)}
            className="w-full border p-2 rounded font-mono"
            placeholder="js expression"
          ></textarea>
        </div>
      )}

      {/* Branch Labels */}
      <div>
        <label className="block mb-1">Branches</label>
        {branches.map((b, i) => (
          <div key={b.id} className="flex items-center space-x-2 mb-2">
            <input 
              className="flex-1 border p-2 rounded"
              value={b.label}
              onChange={e => {
                const newB = [...branches];
                newB[i].label = e.target.value;
                setBranches(newB);
              }}
            />
            <span 
              className={`w-4 h-4 rounded-full ${b.type === 'true' ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Condition
      </button>
    </div>
  );
};


// Node type configuration
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition:ConditionalNode
};

const edgeTypes = {
  custom: CustomEdge,
};

// Workflow header component
const WorkflowHeader = () => {
  const { workflowName, setWorkflowName, saveWorkflow, isSaving, testWorkflow } = useWorkflow();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workflowName);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  const handleNameSave = () => {
    setWorkflowName(editName);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    }
  };
  
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div>
        {isEditing ? (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              className="border border-gray-300 rounded-md p-1 text-lg font-medium"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <h1 
              className="text-lg font-medium cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {workflowName}
            </h1>
            <button 
              className="ml-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditing(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          className="flex items-center px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          onClick={testWorkflow}
        >
          <Play className="w-4 h-4 mr-1" />
          Test
        </button>
        
        <button
          className={`flex items-center px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 ${isSaving ? 'opacity-75' : ''}`}
          onClick={saveWorkflow}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main workflow editor component
const WorkflowEditor = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useWorkflow();
  
  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Panel position="top-left">
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-2">
            <div className="text-xs font-medium text-gray-500 mb-1">Workflow Status</div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Ready</span>
            </div>
          </div>
        </Panel>
        <Controls />
        <MiniMap zoomable pannable />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      
      <EdgeDropdown />
      <ConfigurationSidebar />
    </div>
  );
};

// Main App Component
const WorkflowBuilder = () => {
  return (
    <div className="h-screen flex flex-col">
      <WorkflowProvider>
        <WorkflowHeader />
        <div className="flex-1 bg-gray-50">
          <ReactFlowProvider>
            <WorkflowEditor />
          </ReactFlowProvider>
        </div>
        <Toaster position="bottom-right" />
      </WorkflowProvider>
    </div>
  );
};

export default WorkflowBuilder;