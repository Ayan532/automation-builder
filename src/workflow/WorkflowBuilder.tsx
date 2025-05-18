// import React, { useState, useCallback, createContext, useEffect, useContext } from 'react';
// import ReactFlow, { 
//   addEdge, 
//   Background, 
//   Controls, 
//   useNodesState, 
//   useEdgesState,
//   MarkerType,
//   type Edge,
//   type Connection,
//   type Node,
//   type NodeTypes,
//   type NodeProps,
//   Handle,
//   Position
// } from 'reactflow';
// import 'reactflow/dist/style.css';



// interface WorkflowContextType {
//   apps: Record<string, AppData>;
//   nodes: Node[];
//   edges: Edge[];
//   setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
//   setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
// }

// export const WorkflowContext = createContext<WorkflowContextType>({
//   apps: {},
//   nodes: [],
//   edges: [],
//   setNodes: () => {},
//   setEdges: () => {},
// });
// export interface TriggerConfig {
//   key: string;
//   label: string;
//   description: string;
//   appId: string;
//   config: Record<string, any>;
// }

// export interface ActionConfig {
//   key: string;
//   label: string;
//   appId: string;
//   description: string;
//   config: Record<string, any>;
// }

// export interface AppData {
//   id: string;
//   name: string;
//   icon: string;
//   color: string;
//   description: string;
//   triggers: Record<string, TriggerConfig>;
//   actions: Record<string, ActionConfig>;
// }

// export interface NodeData {
//   label: string;
//   app?: string;
//   trigger?: string;
//   action?: string;
//   configured: boolean;
//   config?: Record<string, any>;
//   branches?: string[];
//   parentNode?: string;
//   branchLabel?: string;
//   nodeId?: string;
// }

// export interface ConfigurationData {
//   nodeId: string;
//   appId: string;
//   type: 'trigger' | 'action';
//   selectedItem?: TriggerConfig | ActionConfig;
//   parentNode?: string;
//   branchLabel?: string;
//   branches?: string[];
// }

// export const SAMPLE_APPS: Record<string, AppData> = {
//   gmail: {
//     id: 'gmail',
//     name: 'Gmail',
//     icon: '📧',
//     color: 'bg-red-100',
//     description: 'Gmail integration',
//     triggers: {
//       new_email: {
//         key: 'new_email',
//         label: 'New Email',
//         description: 'Triggers when new mail is found in your Gmail inbox',
//         appId: 'gmail',
//         config: {
//           label: 'Label',
//           type: 'input',
//           required: false,
//           placeholder: 'Example: INBOX'
//         }
//       },
//       new_labeled_email: {
//         key: 'new_labeled_email',
//         label: 'New Labeled Email',
//         description: 'Triggers when a label is added to an email',
//         appId: 'gmail',
//         config: {
//           label: 'Label',
//           type: 'input',
//           required: true,
//           placeholder: 'Enter label name'
//         }
//       }
//     },
//     actions: {
//       send_email: {
//         key: 'send_email',
//         label: 'Send Email',
//         appId: 'gmail',
//         description: 'Send an email via Gmail',
//         config: {
//           to: {
//             label: 'To',
//             type: 'input',
//             required: true,
//             placeholder: 'Recipient email'
//           },
//           subject: {
//             label: 'Subject',
//             type: 'input',
//             required: true,
//             placeholder: 'Email subject'
//           },
//           body: {
//             label: 'Email Body',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Email content'
//           }
//         }
//       }
//     }
//   },
//   slack: {
//     id: 'slack',
//     name: 'Slack',
//     icon: '💬',
//     color: 'bg-purple-100',
//     description: 'Slack integration',
//     triggers: {
//       new_message: {
//         key: 'new_message',
//         label: 'New Message',
//         description: 'Triggers when a new message is posted to a channel',
//         appId: 'slack',
//         config: {
//           channel: {
//             label: 'Channel',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter channel name'
//           }
//         }
//       }
//     },
//     actions: {
//       send_message: {
//         key: 'send_message',
//         label: 'Send Message',
//         appId: 'slack',
//         description: 'Send a message to a Slack channel',
//         config: {
//           channel: {
//             label: 'Channel',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter channel name'
//           },
//           message: {
//             label: 'Message',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Message content'
//           }
//         }
//       }
//     }
//   },
//   condition: {
//     id: 'condition',
//     name: 'Condition',
//     icon: '🔀',
//     color: 'bg-yellow-100',
//     description: 'Add conditions to your workflow',
//     triggers: {},
//     actions: {
//       condition: {
//         key: 'condition',
//         label: 'Condition',
//         appId: 'condition',
//         description: 'Branch your workflow based on conditions',
//         config: {
//           branches: {
//             label: 'Branches',
//             type: 'branches',
//             required: true,
//             defaultValue: ['Branch 1', 'Otherwise']
//           }
//         }
//       }
//     }
//   },
//   google_sheets: {
//     id: 'google_sheets',
//     name: 'Google Sheets',
//     icon: '📊',
//     color: 'bg-green-100',
//     description: 'Google Sheets integration',
//     triggers: {
//       new_row: {
//         key: 'new_row',
//         label: 'New Row',
//         description: 'Triggers when a new row is added to a sheet',
//         appId: 'google_sheets',
//         config: {
//           spreadsheetId: {
//             label: 'Spreadsheet ID',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter spreadsheet ID'
//           },
//           sheetName: {
//             label: 'Sheet Name',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter sheet name'
//           }
//         }
//       }
//     },
//     actions: {
//       add_row: {
//         key: 'add_row',
//         label: 'Add Row',
//         appId: 'google_sheets',
//         description: 'Add a new row to a Google Sheet',
//         config: {
//           spreadsheetId: {
//             label: 'Spreadsheet ID',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter spreadsheet ID'
//           },
//           sheetName: {
//             label: 'Sheet Name',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter sheet name'
//           },
//           values: {
//             label: 'Row Values',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Enter comma-separated values'
//           }
//         }
//       }
//     }
//   }
// };

// const TriggerNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   const nodeStyle = data.configured
//     ? 'border-2 border-blue-500 bg-blue-100 p-3 rounded-lg'
//     : 'border-2 border-gray-300 bg-gray-100 p-3 rounded-lg cursor-pointer';

//   return (
//     <div className={nodeStyle} style={{ minWidth: '180px', maxWidth: '250px' }}>
//       <div className="text-center font-bold">{data.label}</div>
//       {data.configured && (
//         <Handle
//           type="source"
//           position={Position.Bottom}
//           id="source"
//           style={{ background: '#555' }}
//         />
//       )}
//     </div>
//   );
// };

// const ActionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div 
//       className="border-2 border-green-500 bg-green-100 p-3 rounded-lg" 
//       style={{ minWidth: '180px', maxWidth: '250px' }}
//     >
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{ background: '#555' }}
//       />
//       <div className="text-center font-bold">{data.label}</div>
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="source"
//         style={{ background: '#555' }}
//       />
//     </div>
//   );
// };

// const ConditionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div 
//       className="border-2 border-yellow-500 bg-yellow-100 p-3 rounded-lg"
//       style={{ minWidth: '180px', maxWidth: '250px' }}
//     >
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{ background: '#555' }}
//       />
//       <div className="text-center font-bold">Condition</div>
//       <div className="text-sm mt-2">
//         {data.branches && data.branches.map((branch: string, index: number) => (
//           <div key={index} className="my-1">
//             <span className="font-medium">{branch}</span>
//           </div>
//         ))}
//       </div>
//       {/* We don't need explicit handles for the branches as they'll be created dynamically */}
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="source"
//         style={{ background: '#555', visibility: 'hidden' }}
//       />
//     </div>
//   );
// };

// const AddButtonNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div 
//       className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
//     >
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{ background: '#555' }}
//       />
//       <div className="text-2xl font-bold text-gray-700">+</div>
//     </div>
//   );
// };

// interface AppSelectorProps {
//   position: { x: number; y: number };
//   onSelect: (appId: string) => void;
//   onClose: () => void;
//   type: 'trigger' | 'action';
// }

// const AppSelector: React.FC<AppSelectorProps> = ({ position, onSelect, onClose, type }) => {
//   const { apps } = useContext(WorkflowContext);
  
//   // Filter apps based on type
//   const filteredApps = Object.values(apps).filter(app => {
//     if (type === 'trigger') {
//       return Object.keys(app.triggers).length > 0;
//     } else {
//       return Object.keys(app.actions).length > 0;
//     }
//   });

//   return (
//     <div 
//       className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-10"
//       style={{ 
//         left: `${position.x}px`, 
//         top: `${position.y}px`,
//         minWidth: '200px',
//         maxHeight: '300px',
//         overflowY: 'auto'
//       }}
//     >
//       <div className="p-2 border-b border-gray-200 flex justify-between items-center">
//         <span className="font-medium">Select an app</span>
//         <button 
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>
//       </div>
//       <div className="p-1">
//         {filteredApps.map(app => (
//           <div 
//             key={app.id}
//             className={`p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center ${app.color}`}
//             onClick={() => onSelect(app.id)}
//           >
//             <span className="mr-2 text-xl">{app.icon}</span>
//             <div>
//               <div className="font-medium">{app.name}</div>
//               <div className="text-xs text-gray-600">{app.description}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// interface ConfigurationSidebarProps {
//   data: ConfigurationData;
//   onSave: (config: ConfigurationData) => void;
//   onCancel: () => void;
// }

// const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({ data, onSave, onCancel }) => {
//   const { apps } = useContext(WorkflowContext);
//   const [selectedItem, setSelectedItem] = useState<TriggerConfig | ActionConfig | null>(null);
//   const [configValues, setConfigValues] = useState<Record<string, any>>({});
//   const [branches, setBranches] = useState<string[]>(['Branch 1', 'Otherwise']);
  
//   const app = apps[data.appId];
  
//   useEffect(() => {
//     // Initialize form values
//     setConfigValues({});
    
//     if (data.type === 'trigger') {
//       const triggerItems = Object.values(app.triggers);
//       if (triggerItems.length === 1) {
//         setSelectedItem(triggerItems[0]);
//       }
//     } else {
//       const actionItems = Object.values(app.actions);
//       if (actionItems.length === 1) {
//         setSelectedItem(actionItems[0]);
//       }
//     }
//   }, [data, app]);
  
//   const handleInputChange = (key: string, value: any) => {
//     setConfigValues({
//       ...configValues,
//       [key]: value
//     });
//   };
  
//   const handleBranchChange = (index: number, value: string) => {
//     const newBranches = [...branches];
//     newBranches[index] = value;
//     setBranches(newBranches);
//   };
  
//   const addBranch = () => {
//     setBranches([...branches.slice(0, -1), `Branch ${branches.length}`, branches[branches.length - 1]]);
//   };
  
//   const removeBranch = (index: number) => {
//     if (branches.length <= 2) return; // Need at least 2 branches
//     const newBranches = [...branches];
//     newBranches.splice(index, 1);
//     setBranches(newBranches);
//   };
  
//   const handleSave = () => {
//     const configData = {
//       ...data,
//       selectedItem,
//       config: configValues
//     };
    
//     // For condition nodes, add branches
//     if (selectedItem?.key === 'condition') {
//       configData.branches = branches;
//     }
    
//     onSave(configData);
//   };
  
//   const isValidConfig = () => {
//     if (!selectedItem) return false;
    
//     // For condition nodes, just check if we have at least 2 branches
//     if (selectedItem.key === 'condition') {
//       return branches.length >= 2;
//     }
    
//     // Check if all required config fields have values
//     const config = selectedItem.config;
//     if (typeof config === 'object') {
//       for (const key in config) {
//         if (config[key].required && !configValues[key]) {
//           return false;
//         }
//       }
//     }
    
//     return true;
//   };
  
//   if (!app) return null;
  
//   return (
//     <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-20">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="font-bold text-lg">Configure {data.type === 'trigger' ? 'Trigger' : 'Action'}</h3>
//         <button 
//           onClick={onCancel}
//           className="text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>
//       </div>
      
//       <div className="p-4">
//         <div className="mb-4">
//           <div className="flex items-center space-x-2 mb-2">
//             <span className="text-xl">{app.icon}</span>
//             <span className="font-medium text-lg">{app.name}</span>
//           </div>
//           <p className="text-sm text-gray-600">{app.description}</p>
//         </div>
        
//         {/* Type selector */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select {data.type === 'trigger' ? 'Trigger' : 'Action'} Type
//           </label>
//           <select 
//             className="w-full p-2 border border-gray-300 rounded-md"
//             value={selectedItem?.key || ''}
//             onChange={(e) => {
//               const items = data.type === 'trigger' ? app.triggers : app.actions;
//               const selected = Object.values(items).find(item => item.key === e.target.value);
//               setSelectedItem(selected || null);
//               setConfigValues({});
//             }}
//           >
//             <option value="">Select...</option>
//             {data.type === 'trigger' && Object.values(app.triggers).map(trigger => (
//               <option key={trigger.key} value={trigger.key}>
//                 {trigger.label}
//               </option>
//             ))}
//             {data.type === 'action' && Object.values(app.actions).map(action => (
//               <option key={action.key} value={action.key}>
//                 {action.label}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         {selectedItem && (
//           <div>
//             <div className="text-sm text-gray-600 mb-4">
//               {selectedItem.description}
//             </div>
            
//             {/* Configuration Fields */}
//             {selectedItem.key === 'condition' ? (
//               <div>
//                 <div className="mb-2 flex justify-between items-center">
//                   <label className="block text-sm font-medium text-gray-700">Branches</label>
//                   <button 
//                     onClick={addBranch}
//                     className="text-blue-500 hover:text-blue-700 text-sm"
//                   >
//                     + Add Branch
//                   </button>
//                 </div>
                
//                 {branches.map((branch, index) => (
//                   <div key={index} className="flex items-center mb-2">
//                     <input
//                       type="text"
//                       value={branch}
//                       onChange={(e) => handleBranchChange(index, e.target.value)}
//                       className="flex-1 p-2 border border-gray-300 rounded-md"
//                       placeholder={`Branch ${index + 1}`}
//                     />
//                     {index < branches.length - 1 && index > 0 && (
//                       <button
//                         onClick={() => removeBranch(index)}
//                         className="ml-2 text-red-500 hover:text-red-700"
//                       >
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               selectedItem.config && typeof selectedItem.config === 'object' && 
//               Object.entries(selectedItem.config).map(([key, field]: [string, any]) => (
//                 <div key={key} className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {field.label} {field.required && <span className="text-red-500">*</span>}
//                   </label>
//                   {field.type === 'textarea' ? (
//                     <textarea
//                       value={configValues[key] || ''}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder={field.placeholder}
//                       rows={3}
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       value={configValues[key] || ''}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder={field.placeholder}
//                     />
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
        
//         <div className="mt-6 flex justify-end space-x-2">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!isValidConfig()}
//             className={`px-4 py-2 rounded-md ${
//               isValidConfig() 
//                 ? 'bg-blue-500 text-white hover:bg-blue-600' 
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };



// const nodeTypes: NodeTypes = {
//   triggerNode: TriggerNode,
//   actionNode: ActionNode,
//   conditionNode: ConditionNode,
//   addButtonNode: AddButtonNode,
// };

// const WorkflowBuilder = () => {
//   // Initial empty trigger node
//   const initialNodes: Node[] = [
//     {
//       id: 'trigger-1',
//       type: 'triggerNode',
//       position: { x: 250, y: 50 },
//       data: { 
//         label: 'Select Trigger',
//         configured: false,
//         nodeId: 'trigger-1',
//       }
//     }
//   ];

//   const initialEdges: Edge[] = [];

//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
//   // State for app selection dropdown
//   const [showAppSelector, setShowAppSelector] = useState(false);
//   const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
//   const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
//   const [selectorType, setSelectorType] = useState<'trigger' | 'action'>('trigger');
//   const [parentNode, setParentNode] = useState<string | null>(null);
//   const [branchLabel, setBranchLabel] = useState<string | null>(null);
  
//   // State for configuration sidebar
//   const [showConfigSidebar, setShowConfigSidebar] = useState(false);
//   const [configData, setConfigData] = useState<any>(null);
  
//   // Handle connection between nodes
//   const onConnect = useCallback((params: Connection) => {
//     setEdges((eds) => addEdge({
//       ...params,
//       type: 'smoothstep',
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//       },
//     }, eds));
//   }, [setEdges]);

//   // Handle node click to show configuration or app selector
//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     if (node.type === 'triggerNode' && !node.data.configured) {
//       const rect = (event.target as Element).getBoundingClientRect();
//       setSelectorPosition({ 
//         x: rect.left, 
//         y: rect.bottom 
//       });
//       setCurrentNodeId(node.id);
//       setSelectorType('trigger');
//       setShowAppSelector(true);
//     } else if (node.type === 'addButtonNode') {
//       const rect = (event.target as Element).getBoundingClientRect();
//       setSelectorPosition({ 
//         x: rect.left, 
//         y: rect.bottom 
//       });
//       setCurrentNodeId(node.id);
//       setParentNode(node.data.parentNode);
//       setBranchLabel(node.data.branchLabel);
//       setSelectorType('action');
//       setShowAppSelector(true);
//     }
//   }, []);

//   // Handle app selection
//   const handleAppSelect = (app: string) => {
//     setShowAppSelector(false);
    
//     // Store selected app for configuration
//     setConfigData({
//       nodeId: currentNodeId,
//       appId: app,
//       type: selectorType,
//       parentNode: parentNode,
//       branchLabel: branchLabel
//     });
    
//     setShowConfigSidebar(true);
//   };

//   // Handle configuration save
//   const handleConfigSave = (config: any) => {
//     setShowConfigSidebar(false);
    
//     const { nodeId, appId, selectedItem, type, parentNode, branchLabel } = config;
//     const app = SAMPLE_APPS[appId];
    
//     if (type === 'trigger') {
//       // Update trigger node with configuration
//       setNodes(nodes.map(node => {
//         if (node.id === nodeId) {
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               label: `${app.name}: ${selectedItem.label}`,
//               app: appId,
//               trigger: selectedItem.key,
//               configured: true,
//               config: selectedItem.config
//             }
//           };
//         }
//         return node;
//       }));
      
//       // Add an AddButtonNode connected to this trigger
//       const triggerNode = nodes.find(n => n.id === nodeId);
//       if (triggerNode) {
//         const newAddButtonId = `add-button-${Date.now()}`;
        
//         // Add AddButtonNode
//         setNodes(nds => [
//           ...nds,
//           {
//             id: newAddButtonId,
//             type: 'addButtonNode',
//             position: { x: triggerNode.position.x, y: triggerNode.position.y + 150 },
//             data: { 
//               label: '+',
//               parentNode: nodeId
//             }
//           }
//         ]);
        
//         // Connect trigger to AddButtonNode
//         setEdges(eds => [
//           ...eds,
//           {
//             id: `e-${nodeId}-${newAddButtonId}`,
//             source: nodeId,
//             target: newAddButtonId,
//             type: 'smoothstep',
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//             }
//           }
//         ]);
//       }
//     } 
//     else if (type === 'action') {
//       if (selectedItem.key === 'condition') {
//         // Create condition node
//         const newNodeId = `condition-${Date.now()}`;
//         const parentNodeObj = nodes.find(n => n.id === parentNode);
        
//         if (parentNodeObj) {
//           // Remove the add button node
//           setNodes(nodes.filter(n => n.id !== nodeId));
          
//           // Find all edges connected to the add button
//           const connectedEdges = edges.filter(e => e.target === nodeId);
          
//           // Add condition node
//           setNodes(nds => [
//             ...nds,
//             {
//               id: newNodeId,
//               type: 'conditionNode',
//               position: {
//                 x: parentNodeObj.position.x,
//                 y: parentNodeObj.position.y + 150
//               },
//               data: {
//                 label: 'Condition',
//                 branches: config.branches || ['Branch 1', 'Otherwise'],
//                 configured: true,
//                 config: config
//               }
//             }
//           ]);
          
//           // Connect parent to condition
//           setEdges(eds => [
//             ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
//             {
//               id: `e-${parentNode}-${newNodeId}`,
//               source: parentNode,
//               target: newNodeId,
//               type: 'smoothstep',
//               markerEnd: {
//                 type: MarkerType.ArrowClosed,
//               },
//               data: { branchLabel: branchLabel }
//             }
//           ]);
          
//           // Create add button nodes for each branch
//           setTimeout(() => {
//             const branches = config.branches || ['Branch 1', 'Otherwise'];
//             branches.forEach((branch: string, index: number) => {
//               const addButtonId = `add-button-${Date.now()}-${index}`;
              
//               // Add a new AddButtonNode for this branch
//               setNodes(nds => [
//                 ...nds,
//                 {
//                   id: addButtonId,
//                   type: 'addButtonNode',
//                   position: {
//                     x: parentNodeObj.position.x + (index - (branches.length - 1) / 2) * 150,
//                     y: parentNodeObj.position.y + 250
//                   },
//                   data: {
//                     label: '+',
//                     parentNode: newNodeId,
//                     branchLabel: branch
//                   }
//                 }
//               ]);
              
//               // Connect condition to this AddButtonNode
//               setEdges(eds => [
//                 ...eds,
//                 {
//                   id: `e-${newNodeId}-${addButtonId}`,
//                   source: newNodeId,
//                   target: addButtonId,
//                   type: 'smoothstep',
//                   markerEnd: {
//                     type: MarkerType.ArrowClosed,
//                   },
//                   data: { branchLabel: branch }
//                 }
//               ]);
//             });
//           }, 10);
//         }
//       } else {
//         // Create standard action node
//         const newNodeId = `action-${Date.now()}`;
//         const parentNodeObj = nodes.find(n => n.id === parentNode);
        
//         if (parentNodeObj) {
//           // Remove the add button node
//           setNodes(nodes.filter(n => n.id !== nodeId));
          
//           // Add action node
//           setNodes(nds => [
//             ...nds,
//             {
//               id: newNodeId,
//               type: 'actionNode',
//               position: {
//                 x: parentNodeObj.position.x,
//                 y: parentNodeObj.position.y + 150
//               },
//               data: {
//                 label: `${app.name}: ${selectedItem.label}`,
//                 app: appId,
//                 action: selectedItem.key,
//                 configured: true,
//                 config: selectedItem.config
//               }
//             }
//           ]);
          
//           // Connect parent to action
//           setEdges(eds => [
//             ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
//             {
//               id: `e-${parentNode}-${newNodeId}`,
//               source: parentNode,
//               target: newNodeId,
//               type: 'smoothstep',
//               markerEnd: {
//                 type: MarkerType.ArrowClosed,
//               },
//               data: { branchLabel: branchLabel }
//             }
//           ]);
          
//           // Add new AddButtonNode after this action
//           const addButtonId = `add-button-${Date.now()}`;
//           setTimeout(() => {
//             setNodes(nds => [
//               ...nds,
//               {
//                 id: addButtonId,
//                 type: 'addButtonNode',
//                 position: {
//                   x: parentNodeObj.position.x,
//                   y: parentNodeObj.position.y + 250
//                 },
//                 data: {
//                   label: '+',
//                   parentNode: newNodeId
//                 }
//               }
//             ]);
            
//             // Connect action to AddButtonNode
//             setEdges(eds => [
//               ...eds,
//               {
//                 id: `e-${newNodeId}-${addButtonId}`,
//                 source: newNodeId,
//                 target: addButtonId,
//                 type: 'smoothstep',
//                 markerEnd: {
//                   type: MarkerType.ArrowClosed,
//                 }
//               }
//             ]);
//           }, 10);
//         }
//       }
//     }
//   };

//   // Handle configuration cancel
//   const handleConfigCancel = () => {
//     setShowConfigSidebar(false);
//   };

//   return (
//     <WorkflowContext.Provider value={{ 
//       apps: SAMPLE_APPS, 
//       nodes, 
//       edges, 
//       setNodes, 
//       setEdges 
//     }}>
//       <div className="h-screen w-full">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           <Background />
//           <Controls />
//         </ReactFlow>
        
//         {showAppSelector && (
//           <AppSelector
//             position={selectorPosition}
//             onSelect={handleAppSelect}
//             onClose={() => setShowAppSelector(false)}
//             type={selectorType}
//           />
//         )}
        
//         {showConfigSidebar && (
//           <ConfigurationSidebar
//             data={configData}
//             onSave={handleConfigSave}
//             onCancel={handleConfigCancel}
//           />
//         )}
//       </div>
//     </WorkflowContext.Provider>
//   );
// };

// export default WorkflowBuilder;



// import React, { useState, useCallback, createContext, useEffect, useContext, useRef } from 'react';
// import ReactFlow, {
//   addEdge,
//   Background,
//   Controls,
//   useNodesState,
//   useEdgesState,
//   MarkerType,
//   type Edge,
//   type Connection,
//   type Node,
//   type NodeTypes,
//   type NodeProps,
//   Handle,
//   Position,
//   Panel,
//   useReactFlow,
//   getBezierPath
// } from 'reactflow';
// import dagre from 'dagre';
// import 'reactflow/dist/style.css';

// interface WorkflowContextType {
//   apps: Record<string, AppData>;
//   nodes: Node[];
//   edges: Edge[];
//   setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
//   setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
// }

// export const WorkflowContext = createContext<WorkflowContextType>({
//   apps: {},
//   nodes: [],
//   edges: [],
//   setNodes: () => {},
//   setEdges: () => {},
// });

// export interface TriggerConfig {
//   key: string;
//   label: string;
//   description: string;
//   appId: string;
//   config: Record<string, any>;
// }

// export interface ActionConfig {
//   key: string;
//   label: string;
//   appId: string;
//   description: string;
//   config: Record<string, any>;
// }

// export interface AppData {
//   id: string;
//   name: string;
//   icon: string;
//   color: string;
//   description: string;
//   triggers: Record<string, TriggerConfig>;
//   actions: Record<string, ActionConfig>;
// }

// export interface NodeData {
//   label: string;
//   app?: string;
//   trigger?: string;
//   action?: string;
//   configured: boolean;
//   config?: Record<string, any>;
//   branches?: string[];
//   parentNode?: string;
//   branchLabel?: string;
//   nodeId?: string;
// }

// export interface ConfigurationData {
//   nodeId: string;
//   appId: string;
//   type: 'trigger' | 'action';
//   selectedItem?: TriggerConfig | ActionConfig;
//   parentNode?: string;
//   branchLabel?: string;
//   branches?: string[];
// }

// export const SAMPLE_APPS: Record<string, AppData> = {
//   gmail: {
//     id: 'gmail',
//     name: 'Gmail',
//     icon: '📧',
//     color: 'bg-red-100',
//     description: 'Gmail integration',
//     triggers: {
//       new_email: {
//         key: 'new_email',
//         label: 'New Email',
//         description: 'Triggers when new mail is found in your Gmail inbox',
//         appId: 'gmail',
//         config: {
//           label: {
//             label: 'Label',
//             type: 'input',
//             required: false,
//             placeholder: 'Example: INBOX'
//           }
//         }
//       },
//       new_labeled_email: {
//         key: 'new_labeled_email',
//         label: 'New Labeled Email',
//         description: 'Triggers when a label is added to an email',
//         appId: 'gmail',
//         config: {
//           label: {
//             label: 'Label',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter label name'
//           }
//         }
//       }
//     },
//     actions: {
//       send_email: {
//         key: 'send_email',
//         label: 'Send Email',
//         appId: 'gmail',
//         description: 'Send an email via Gmail',
//         config: {
//           to: {
//             label: 'To',
//             type: 'input',
//             required: true,
//             placeholder: 'Recipient email'
//           },
//           subject: {
//             label: 'Subject',
//             type: 'input',
//             required: true,
//             placeholder: 'Email subject'
//           },
//           body: {
//             label: 'Email Body',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Email content'
//           }
//         }
//       }
//     }
//   },
//   slack: {
//     id: 'slack',
//     name: 'Slack',
//     icon: '💬',
//     color: 'bg-purple-100',
//     description: 'Slack integration',
//     triggers: {
//       new_message: {
//         key: 'new_message',
//         label: 'New Message',
//         description: 'Triggers when a new message is posted to a channel',
//         appId: 'slack',
//         config: {
//           channel: {
//             label: 'Channel',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter channel name'
//           }
//         }
//       }
//     },
//     actions: {
//       send_message: {
//         key: 'send_message',
//         label: 'Send Message',
//         appId: 'slack',
//         description: 'Send a message to a Slack channel',
//         config: {
//           channel: {
//             label: 'Channel',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter channel name'
//           },
//           message: {
//             label: 'Message',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Message content'
//           }
//         }
//       }
//     }
//   },
//   condition: {
//     id: 'condition',
//     name: 'Condition',
//     icon: '🔀',
//     color: 'bg-yellow-100',
//     description: 'Add conditions to your workflow',
//     triggers: {},
//     actions: {
//       condition: {
//         key: 'condition',
//         label: 'Condition',
//         appId: 'condition',
//         description: 'Branch your workflow based on conditions',
//         config: {
//           branches: {
//             label: 'Branches',
//             type: 'branches',
//             required: true,
//             defaultValue: ['Branch 1', 'Otherwise']
//           }
//         }
//       }
//     }
//   },
//   google_sheets: {
//     id: 'google_sheets',
//     name: 'Google Sheets',
//     icon: '📊',
//     color: 'bg-green-100',
//     description: 'Google Sheets integration',
//     triggers: {
//       new_row: {
//         key: 'new_row',
//         label: 'New Row',
//         description: 'Triggers when a new row is added to a sheet',
//         appId: 'google_sheets',
//         config: {
//           spreadsheetId: {
//             label: 'Spreadsheet ID',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter spreadsheet ID'
//           },
//           sheetName: {
//             label: 'Sheet Name',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter sheet name'
//           }
//         }
//       }
//     },
//     actions: {
//       add_row: {
//         key: 'add_row',
//         label: 'Add Row',
//         appId: 'google_sheets',
//         description: 'Add a new row to a Google Sheet',
//         config: {
//           spreadsheetId: {
//             label: 'Spreadsheet ID',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter spreadsheet ID'
//           },
//           sheetName: {
//             label: 'Sheet Name',
//             type: 'input',
//             required: true,
//             placeholder: 'Enter sheet name'
//           },
//           values: {
//             label: 'Row Values',
//             type: 'textarea',
//             required: true,
//             placeholder: 'Enter comma-separated values'
//           }
//         }
//       }
//     }
//   }
// };

// const TriggerNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   const nodeStyle = data.configured
//     ? 'border-2 border-blue-500 bg-blue-100 p-3 rounded-lg'
//     : 'border-2 border-gray-300 bg-gray-100 p-3 rounded-lg cursor-pointer';
//   return (
//     <div className={nodeStyle} style={{ minWidth: '180px', maxWidth: '250px' }}>
//       <div className="text-center font-bold">{data.label}</div>
//       {data.configured && (
//         <Handle type="source" position={Position.Bottom} id="source" style={{ background: '#555' }} />
//       )}
//     </div>
//   );
// };

// const ActionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div className="border-2 border-green-500 bg-green-100 p-3 rounded-lg" style={{ minWidth: '180px', maxWidth: '250px' }}>
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
//       <div className="text-center font-bold">{data.label}</div>
//       <Handle type="source" position={Position.Bottom} id="source" style={{ background: '#555' }} />
//     </div>
//   );
// };

// const ConditionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div className="border-2 border-yellow-500 bg-yellow-100 p-3 rounded-lg" style={{ minWidth: '180px', maxWidth: '250px' }}>
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
//       <div className="text-center font-bold">Condition</div>
//       <div className="text-sm mt-2">
//         {data.branches && data.branches.map((branch: string, index: number) => (
//           <div key={index} className="my-1">
//             <span className="font-medium">{branch}</span>
//           </div>
//         ))}
//       </div>
//       {/* We don't need explicit handles for the branches as they'll be created dynamically */}
//       <Handle type="source" position={Position.Bottom} id="source" style={{ background: '#555', visibility: 'hidden' }} />
//     </div>
//   );
// };

// // Custom edge with dropdown
// interface CustomEdgeProps {
//   id: string;
//   source: string;
//   target: string;
//   sourceX: number;
//   sourceY: number;
//   targetX: number;
//   targetY: number;
//   sourcePosition?: Position;
//   targetPosition?: Position;
//   style?: any;
//   data?: any;
//   markerEnd?: string;
// }

// const CustomEdge: React.FC<CustomEdgeProps> = ({
//   id,
//   source,
//   target,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   data,
//   markerEnd,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const { apps } = useContext(WorkflowContext);
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   const handleEdgeClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setShowDropdown(!showDropdown);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const edgeLabel = data?.branchLabel ? (
//     <div
//       style={{
//         position: 'absolute',
//         transform: 'translate(-50%, -50%)',
//         fontSize: 12,
//         fontWeight: 700,
//         pointerEvents: 'all',
//         padding: '2px 4px',
//         borderRadius: 4,
//         background: 'white',
//         border: '1px solid #ccc',
//         left: labelX,
//         top: labelY,
//         cursor: 'pointer',
//       }}
//       onClick={handleEdgeClick}
//     >
//       {data.branchLabel}
//     </div>
//   ) : null;

//   return (
//     <>
//       <path
//         id={id}
//         style={{ ...style, strokeWidth: 2 }}
//         className="react-flow__edge-path stroke-gray-400 hover:stroke-blue-500 cursor-pointer"
//         d={edgePath}
//         markerEnd={markerEnd}
//         onClick={handleEdgeClick}
//       />
//       {edgeLabel}
      
//       {showDropdown && (
//         <div
//           ref={dropdownRef}
//           style={{
//             position: 'absolute',
//             left: (sourceX + targetX) / 2,
//             top: (sourceY + targetY) / 2,
//             background: 'white',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '5px',
//             zIndex: 1000,
//             boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//           }}
//         >
//           <div className="font-bold mb-2 border-b pb-1">Edge Options</div>
//           <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Delete Edge</div>
//           <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Edit Condition</div>
//           {data?.branchLabel && (
//             <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Rename Branch: {data.branchLabel}</div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// // Auto layout function using dagre
// const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
//   const dagreGraph = new dagre.graphlib.Graph();
//   dagreGraph.setDefaultEdgeLabel(() => ({}));
//   dagreGraph.setGraph({ rankdir: direction });

//   // Set node dimensions
//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, { width: 180, height: 80 });
//   });

//   // Set edges
//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   // Calculate layout
//   dagre.layout(dagreGraph);

//   // Apply layout to nodes
//   const layoutedNodes = nodes.map((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     return {
//       ...node,
//       position: {
//         x: nodeWithPosition.x - 90, // Center the node
//         y: nodeWithPosition.y - 40, // Center the node
//       },
//     };
//   });

//   return { nodes: layoutedNodes, edges };
// };

// const AddButtonNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
//   return (
//     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
//       <div className="text-2xl font-bold text-gray-700">+</div>
//     </div>
//   );
// };

// interface AppSelectorProps {
//   position: { x: number; y: number };
//   onSelect: (appId: string) => void;
//   onClose: () => void;
//   type: 'trigger' | 'action';
// }

// const AppSelector: React.FC<AppSelectorProps> = ({ position, onSelect, onClose, type }) => {
//   const { apps } = useContext(WorkflowContext);

//   // Filter apps based on type
//   const filteredApps = Object.values(apps).filter(app => {
//     if (type === 'trigger') {
//       return Object.keys(app.triggers).length > 0;
//     } else {
//       return Object.keys(app.actions).length > 0;
//     }
//   });

//   return (
//     <div
//       className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-10"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         minWidth: '200px',
//         maxHeight: '300px',
//         overflowY: 'auto'
//       }}
//     >
//       <div className="p-2 border-b border-gray-200 flex justify-between items-center">
//         <span className="font-medium">Select an app</span>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
//       </div>
//       <div className="p-1">
//         {filteredApps.map(app => (
//           <div
//             key={app.id}
//             className={`p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center ${app.color}`}
//             onClick={() => onSelect(app.id)}
//           >
//             <span className="mr-2 text-xl">{app.icon}</span>
//             <div>
//               <div className="font-medium">{app.name}</div>
//               <div className="text-xs text-gray-600">{app.description}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// interface ConfigurationSidebarProps {
//   data: ConfigurationData;
//   onSave: (config: ConfigurationData) => void;
//   onCancel: () => void;
// }

// const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({ data, onSave, onCancel }) => {
//   const { apps } = useContext(WorkflowContext);
//   const [selectedItem, setSelectedItem] = useState<TriggerConfig | ActionConfig | null>(null);
//   const [configValues, setConfigValues] = useState<Record<string, any>>({});
//   const [branches, setBranches] = useState<string[]>(['Branch 1', 'Otherwise']);

//   const app = apps[data.appId];

//   useEffect(() => {
//     // Initialize form values
//     setConfigValues({});
//     if (data.type === 'trigger') {
//       const triggerItems = Object.values(app.triggers);
//       if (triggerItems.length === 1) {
//         setSelectedItem(triggerItems[0]);
//       }
//     } else {
//       const actionItems = Object.values(app.actions);
//       if (actionItems.length === 1) {
//         setSelectedItem(actionItems[0]);
//       }
//     }
//   }, [data, app]);

//   const handleInputChange = (key: string, value: any) => {
//     setConfigValues({ ...configValues, [key]: value });
//   };

//   const handleBranchChange = (index: number, value: string) => {
//     const newBranches = [...branches];
//     newBranches[index] = value;
//     setBranches(newBranches);
//   };

//   const addBranch = () => {
//     setBranches([...branches.slice(0, -1), `Branch ${branches.length}`, branches[branches.length - 1]]);
//   };

//   const removeBranch = (index: number) => {
//     if (branches.length <= 2) return; // Need at least 2 branches
//     const newBranches = [...branches];
//     newBranches.splice(index, 1);
//     setBranches(newBranches);
//   };

//   const handleSave = () => {
//     const configData = { ...data, selectedItem, config: configValues };
//     // For condition nodes, add branches
//     if (selectedItem?.key === 'condition') {
//       configData.branches = branches;
//     }
//     onSave(configData);
//   };

//   const isValidConfig = () => {
//     if (!selectedItem) return false;

//     // For condition nodes, just check if we have at least 2 branches
//     if (selectedItem.key === 'condition') {
//       return branches.length >= 2;
//     }

//     // Check if all required config fields have values
//     const config = selectedItem.config;
//     if (typeof config === 'object') {
//       for (const key in config) {
//         if (config[key].required && !configValues[key]) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   if (!app) return null;

//   return (
//     <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-20">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h3 className="font-bold text-lg">Configure {data.type === 'trigger' ? 'Trigger' : 'Action'}</h3>
//         <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">✕</button>
//       </div>
//       <div className="p-4">
//         <div className="mb-4">
//           <div className="flex items-center space-x-2 mb-2">
//             <span className="text-xl">{app.icon}</span>
//             <span className="font-medium text-lg">{app.name}</span>
//           </div>
//           <p className="text-sm text-gray-600">{app.description}</p>
//         </div>

//         {/* Type selector */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Select {data.type === 'trigger' ? 'Trigger' : 'Action'} Type</label>
//           <select
//             className="w-full p-2 border border-gray-300 rounded-md"
//             value={selectedItem?.key || ''}
//             onChange={(e) => {
//               const items = data.type === 'trigger' ? app.triggers : app.actions;
//               const selected = Object.values(items).find(item => item.key === e.target.value);
//               setSelectedItem(selected || null);
//               setConfigValues({});
//             }}
//           >
//             <option value="">Select...</option>
//             {data.type === 'trigger' && Object.values(app.triggers).map(trigger => (
//               <option key={trigger.key} value={trigger.key}>{trigger.label}</option>
//             ))}
//             {data.type === 'action' && Object.values(app.actions).map(action => (
//               <option key={action.key} value={action.key}>{action.label}</option>
//             ))}
//           </select>
//         </div>

//         {selectedItem && (
//           <div>
//             <div className="text-sm text-gray-600 mb-4">{selectedItem.description}</div>

//             {/* Configuration Fields */}
//             {selectedItem.key === 'condition' ? (
//               <div>
//                 <div className="mb-2 flex justify-between items-center">
//                   <label className="block text-sm font-medium text-gray-700">Branches</label>
//                   <button onClick={addBranch} className="text-blue-500 hover:text-blue-700 text-sm">+ Add Branch</button>
//                 </div>
//                 {branches.map((branch, index) => (
//                   <div key={index} className="flex items-center mb-2">
//                     <input
//                       type="text"
//                       value={branch}
//                       onChange={(e) => handleBranchChange(index, e.target.value)}
//                       className="flex-1 p-2 border border-gray-300 rounded-md"
//                       placeholder={`Branch ${index + 1}`}
//                     />
//                     {index < branches.length - 1 && index > 0 && (
//                       <button onClick={() => removeBranch(index)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               selectedItem.config && typeof selectedItem.config === 'object' && Object.entries(selectedItem.config).map(([key, field]: [string, any]) => (
//                 <div key={key} className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {field.label}{field.required && <span className="text-red-500">*</span>}
//                   </label>
//                   {field.type === 'textarea' ? (
//                     <textarea
//                       value={configValues[key] || ''}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder={field.placeholder}
//                       rows={3}
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       value={configValues[key] || ''}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder={field.placeholder}
//                     />
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         <div className="mt-6 flex justify-end space-x-2">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!isValidConfig()}
//             className={`px-4 py-2 rounded-md ${isValidConfig() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const nodeTypes: NodeTypes = {
//   triggerNode: TriggerNode,
//   actionNode: ActionNode,
//   conditionNode: ConditionNode,
//   addButtonNode: AddButtonNode,
// };

// const edgeTypes = {
//   custom: CustomEdge,
// };

// const WorkflowBuilder = () => {
//   // Initial empty trigger node
//   const initialNodes: Node[] = [
//     {
//       id: 'trigger-1',
//       type: 'triggerNode',
//       position: { x: 250, y: 50 },
//       data: { label: 'Select Trigger', configured: false, nodeId: 'trigger-1' },
//     }
//   ];
//   const initialEdges: Edge[] = [];

//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const reactFlowInstance = useReactFlow();

//   // State for app selection dropdown
//   const [showAppSelector, setShowAppSelector] = useState(false);
//   const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
//   const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
//   const [selectorType, setSelectorType] = useState<'trigger' | 'action'>('trigger');
//   const [parentNode, setParentNode] = useState<string | null>(null);
//   const [branchLabel, setBranchLabel] = useState<string | null>(null);

//   // State for configuration sidebar
//   const [showConfigSidebar, setShowConfigSidebar] = useState(false);
//   const [configData, setConfigData] = useState<any>(null);

//   // Apply auto layout
//   const onLayout = useCallback((direction: string) => {
//     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//       nodes,
//       edges,
//       direction
//     );
    
//     setNodes([...layoutedNodes]);
//     reactFlowInstance.fitView();
//   }, [nodes, edges, setNodes, reactFlowInstance]);

//   // Handle connection between nodes
//   const onConnect = useCallback(
//     (params: Connection) => {
//       setEdges((eds) =>
//         addEdge(
//           {
//             ...params,
//             type: 'custom', // Use our custom edge
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//             },
//           },
//           eds
//         )
//       );
//     },
//     [setEdges]
//   );

//   // Handle node click to show configuration or app selector
//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     if (node.type === 'triggerNode' && !node.data.configured) {
//       const rect = (event.target as Element).getBoundingClientRect();
//       setSelectorPosition({ x: rect.left, y: rect.bottom });
//       setCurrentNodeId(node.id);
//       setSelectorType('trigger');
//       setShowAppSelector(true);
//     } else if (node.type === 'addButtonNode') {
//       const rect = (event.target as Element).getBoundingClientRect();
//       setSelectorPosition({ x: rect.left, y: rect.bottom });
//       setCurrentNodeId(node.id);
//       setParentNode(node.data.parentNode);
//       setBranchLabel(node.data.branchLabel);
//       setSelectorType('action');
//       setShowAppSelector(true);
//     }
//   }, []);

//   // Handle app selection
//   const handleAppSelect = (app: string) => {
//     setShowAppSelector(false);
//     // Store selected app for configuration
//     setConfigData({
//       nodeId: currentNodeId,
//       appId: app,
//       type: selectorType,
//       parentNode: parentNode,
//       branchLabel: branchLabel
//     });
//     setShowConfigSidebar(true);
//   };

//   // Handle configuration save
//   const handleConfigSave = (config: any) => {
//     setShowConfigSidebar(false);
//     const { nodeId, appId, selectedItem, type, parentNode, branchLabel } = config;
//     const app = SAMPLE_APPS[appId];

  

//     if (type === 'trigger') {
//       // Update trigger node with configuration
//       setNodes(nodes.map(node => {
//         if (node.id === nodeId) {
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               label: `${app.name}: ${selectedItem.label}`,
//               app: appId,
//               trigger: selectedItem.key,
//               configured: true,
//               config: selectedItem.config
//             }
//           };
//         }
//         return node;
//       }));
      
//       // Add an AddButtonNode connected to this trigger
//       const triggerNode = nodes.find(n => n.id === nodeId);
//       if (triggerNode) {
//         const newAddButtonId = `add-button-${Date.now()}`;
        
//         // Add AddButtonNode
//         setNodes(nds => [
//           ...nds,
//           {
//             id: newAddButtonId,
//             type: 'addButtonNode',
//             position: { x: triggerNode.position.x, y: triggerNode.position.y + 150 },
//             data: { 
//               label: '+',
//               parentNode: nodeId
//             }
//           }
//         ]);
        
//         // Connect trigger to AddButtonNode
//         setEdges(eds => [
//           ...eds,
//           {
//             id: `e-${nodeId}-${newAddButtonId}`,
//             source: nodeId,
//             target: newAddButtonId,
//             type: 'smoothstep',
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//             }
//           }
//         ]);
      
        
//         // Apply auto layout
//         setTimeout(() => {
//           onLayout('TB');
//         }, 10);
//       }
//     } else if (type === 'action') {
//       if (selectedItem.key === 'condition') {
//         // Create condition node
//         const newNodeId = `condition-${Date.now()}`;
//         const parentNodeObj = nodes.find(n => n.id === parentNode);
        
//         if (parentNodeObj) {
//           // Remove the add button node
//           setNodes(nodes.filter(n => n.id !== nodeId));
          
//           // Find all edges connected to the add button
//           const connectedEdges = edges.filter(e => e.target === nodeId);
          
//           // Add condition node
//           setNodes(nds => [
//             ...nds,
//             {
//               id: newNodeId,
//               type: 'conditionNode',
//               position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 150 },
//               data: {
//                 label: 'Condition',
//                 branches: config.branches || ['Branch 1', 'Otherwise'],
//                 configured: true,
//                 config: config
//               }
//             }
//           ]);
          
//           // Connect parent to condition
//           setEdges(eds => [
//             ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
//             {
//               id: `e-${parentNode}-${newNodeId}`,
//               source: parentNode,
//               target: newNodeId,
//               type: 'custom',
//               markerEnd: { type: MarkerType.ArrowClosed },
//               data: { branchLabel: branchLabel }
//             }
//           ]);
          
//           // Create add button nodes for each branch
//           setTimeout(() => {
//             const branches = config.branches || ['Branch 1', 'Otherwise'];
//             branches.forEach((branch: string, index: number) => {
//               const addButtonId = `add-button-${Date.now()}-${index}`;
              
//               // Add a new AddButtonNode for this branch
//               setNodes(nds => [
//                 ...nds,
//                 {
//                   id: addButtonId,
//                   type: 'addButtonNode',
//                   position: { 
//                     x: parentNodeObj.position.x + (index - (branches.length - 1) / 2) * 150, 
//                     y: parentNodeObj.position.y + 250
//                   },
//                   data: { 
//                     label: '+', 
//                     parentNode: newNodeId, 
//                     branchLabel: branch 
//                   }
//                 }
//               ]);
              
//               // Connect condition to this AddButtonNode
//               setEdges(eds => [
//                 ...eds,
//                 {
//                   id: `e-${newNodeId}-${addButtonId}`,
//                   source: newNodeId,
//                   target: addButtonId,
//                   type: 'custom',
//                   markerEnd: { type: MarkerType.ArrowClosed },
//                   data: { branchLabel: branch }
//                 }
//               ]);
//             });
            
//             // Apply auto layout
//             setTimeout(() => {
//               onLayout('TB');
//             }, 10);
//           }, 10);
//         }
//       } else {
//         // Create standard action node
//         const newNodeId = `action-${Date.now()}`;
//         const parentNodeObj = nodes.find(n => n.id === parentNode);
        
//         if (parentNodeObj) {
//           // Remove the add button node
//           setNodes(nodes.filter(n => n.id !== nodeId));
          
//           // Add action node
//           setNodes(nds => [
//             ...nds,
//             {
//               id: newNodeId,
//               type: 'actionNode',
//               position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 150 },
//               data: {
//                 label: `${app.name}: ${selectedItem.label}`,
//                 app: appId,
//                 action: selectedItem.key,
//                 configured: true,
//                 config: selectedItem.config
//               }
//             }
//           ]);
          
//           // Connect parent to action
//           setEdges(eds => [
//             ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
//             {
//               id: `e-${parentNode}-${newNodeId}`,
//               source: parentNode,
//               target: newNodeId,
//               type: 'custom',
//               markerEnd: { type: MarkerType.ArrowClosed },
//               data: { branchLabel: branchLabel }
//             }
//           ]);
          
//           // Add new AddButtonNode after this action
//           const addButtonId = `add-button-${Date.now()}`;
//           setTimeout(() => {
//             setNodes(nds => [
//               ...nds,
//               {
//                 id: addButtonId,
//                 type: 'addButtonNode',
//                 position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 250 },
//                 data: { label: '+', parentNode: newNodeId }
//               }
//             ]);
            
//             // Connect action to AddButtonNode
//             setEdges(eds => [
//               ...eds,
//               {
//                 id: `e-${newNodeId}-${addButtonId}`,
//                 source: newNodeId,
//                 target: addButtonId,
//                 type: 'custom',
//                 markerEnd: { type: MarkerType.ArrowClosed }
//               }
//             ]);
            
//             // Apply auto layout
//             setTimeout(() => {
//               onLayout('TB');
//             }, 10);
//           }, 10);
//         }
//       }
//     }
//   };

//   // Handle configuration cancel
//   const handleConfigCancel = () => {
//     setShowConfigSidebar(false);
//   };

//   return (
//     <WorkflowContext.Provider value={{ apps: SAMPLE_APPS, nodes, edges, setNodes, setEdges }}>
//       <div className="h-screen w-full">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           edgeTypes={edgeTypes}
//           defaultEdgeOptions={{ type: 'custom' }}
//           fitView
//         >
//           <Panel position="top-right">
//             <div className="bg-white p-2 rounded-md shadow border border-gray-200">
//               <button
//                 onClick={() => onLayout('TB')}
//                 className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
//               >
//                 Vertical Layout
//               </button>
//               <button
//                 onClick={() => onLayout('LR')}
//                 className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 Horizontal Layout
//               </button>
//             </div>
//           </Panel>
//           <Background />
//           <Controls />
//         </ReactFlow>
        
//         {showAppSelector && (
//           <AppSelector
//             position={selectorPosition}
//             onSelect={handleAppSelect}
//             onClose={() => setShowAppSelector(false)}
//             type={selectorType}
//           />
//         )}
        
//         {showConfigSidebar && (
//           <ConfigurationSidebar
//             data={configData}
//             onSave={handleConfigSave}
//             onCancel={handleConfigCancel}
//           />
//         )}
//       </div>
//     </WorkflowContext.Provider>
//   );
// };

// export default WorkflowBuilder;



import React, { useState, useCallback, createContext, useEffect, useContext, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Edge,
  type Connection,
  type Node,
  type NodeTypes,
  type NodeProps,
  Handle,
  Position,
  Panel,
  useReactFlow,
  getBezierPath
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

interface WorkflowContextType {
  apps: Record<string, AppData>;
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export const WorkflowContext = createContext<WorkflowContextType>({
  apps: {},
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
});

export interface TriggerConfig {
  key: string;
  label: string;
  description: string;
  appId: string;
  config: Record<string, any>;
}

export interface ActionConfig {
  key: string;
  label: string;
  appId: string;
  description: string;
  config: Record<string, any>;
}

export interface AppData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  triggers: Record<string, TriggerConfig>;
  actions: Record<string, ActionConfig>;
}

export interface NodeData {
  label: string;
  app?: string;
  trigger?: string;
  action?: string;
  configured: boolean;
  config?: Record<string, any>;
  branches?: string[];
  parentNode?: string;
  branchLabel?: string;
  nodeId?: string;
  isEndNode?: boolean;
}

export interface ConfigurationData {
  nodeId: string;
  appId: string;
  type: 'trigger' | 'action';
  selectedItem?: TriggerConfig | ActionConfig;
  parentNode?: string;
  branchLabel?: string;
  branches?: string[];
}

export const SAMPLE_APPS: Record<string, AppData> = {
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
        config: {
          label: {
            label: 'Label',
            type: 'input',
            required: false,
            placeholder: 'Example: INBOX'
          }
        }
      },
      new_labeled_email: {
        key: 'new_labeled_email',
        label: 'New Labeled Email',
        description: 'Triggers when a label is added to an email',
        appId: 'gmail',
        config: {
          label: {
            label: 'Label',
            type: 'input',
            required: true,
            placeholder: 'Enter label name'
          }
        }
      }
    },
    actions: {
      send_email: {
        key: 'send_email',
        label: 'Send Email',
        appId: 'gmail',
        description: 'Send an email via Gmail',
        config: {
          to: {
            label: 'To',
            type: 'input',
            required: true,
            placeholder: 'Recipient email'
          },
          subject: {
            label: 'Subject',
            type: 'input',
            required: true,
            placeholder: 'Email subject'
          },
          body: {
            label: 'Email Body',
            type: 'textarea',
            required: true,
            placeholder: 'Email content'
          }
        }
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
        config: {
          channel: {
            label: 'Channel',
            type: 'input',
            required: true,
            placeholder: 'Enter channel name'
          }
        }
      }
    },
    actions: {
      send_message: {
        key: 'send_message',
        label: 'Send Message',
        appId: 'slack',
        description: 'Send a message to a Slack channel',
        config: {
          channel: {
            label: 'Channel',
            type: 'input',
            required: true,
            placeholder: 'Enter channel name'
          },
          message: {
            label: 'Message',
            type: 'textarea',
            required: true,
            placeholder: 'Message content'
          }
        }
      }
    }
  },
  condition: {
    id: 'condition',
    name: 'Condition',
    icon: '🔀',
    color: 'bg-yellow-100',
    description: 'Add conditions to your workflow',
    triggers: {},
    actions: {
      condition: {
        key: 'condition',
        label: 'Condition',
        appId: 'condition',
        description: 'Branch your workflow based on conditions',
        config: {
          branches: {
            label: 'Branches',
            type: 'branches',
            required: true,
            defaultValue: ['Branch 1', 'Otherwise']
          }
        }
      }
    }
  },
  google_sheets: {
    id: 'google_sheets',
    name: 'Google Sheets',
    icon: '📊',
    color: 'bg-green-100',
    description: 'Google Sheets integration',
    triggers: {
      new_row: {
        key: 'new_row',
        label: 'New Row',
        description: 'Triggers when a new row is added to a sheet',
        appId: 'google_sheets',
        config: {
          spreadsheetId: {
            label: 'Spreadsheet ID',
            type: 'input',
            required: true,
            placeholder: 'Enter spreadsheet ID'
          },
          sheetName: {
            label: 'Sheet Name',
            type: 'input',
            required: true,
            placeholder: 'Enter sheet name'
          }
        }
      }
    },
    actions: {
      add_row: {
        key: 'add_row',
        label: 'Add Row',
        appId: 'google_sheets',
        description: 'Add a new row to a Google Sheet',
        config: {
          spreadsheetId: {
            label: 'Spreadsheet ID',
            type: 'input',
            required: true,
            placeholder: 'Enter spreadsheet ID'
          },
          sheetName: {
            label: 'Sheet Name',
            type: 'input',
            required: true,
            placeholder: 'Enter sheet name'
          },
          values: {
            label: 'Row Values',
            type: 'textarea',
            required: true,
            placeholder: 'Enter comma-separated values'
          }
        }
      }
    }
  }
};

const TriggerNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  const nodeStyle = data.configured
    ? 'border-2 border-blue-500 bg-blue-100 p-3 rounded-lg'
    : 'border-2 border-gray-300 bg-gray-100 p-3 rounded-lg cursor-pointer';
  
  return (
    <div
      className={nodeStyle}
      style={{ minWidth: '180px', maxWidth: '250px' }}
    >
      <div className="text-center font-bold">{data.label}</div>
    
    <Handle
      type="source"
      position={Position.Bottom}
      id="source"
      style={{ background: '#555' }}
    />
    </div>
  );
};

const ActionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div
      className="border-2 border-green-500 bg-green-100 p-3 rounded-lg"
      style={{ minWidth: '180px', maxWidth: '250px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="text-center font-bold">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#555' }}
      />
    </div>
  );
};

const ConditionNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div
      className="border-2 border-yellow-500 bg-yellow-100 p-3 rounded-lg"
      style={{ minWidth: '180px', maxWidth: '250px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="text-center font-bold">Condition</div>
      <div className="text-sm mt-2">
        {data.branches && data.branches.map((branch: string, index: number) => (
          <div key={index} className="my-1">
            <span className="font-medium">{branch}</span>
          </div>
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#555' }}
      />
    </div>
  );
};

const EndNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div
      className="border-2 border-gray-600 bg-gray-200 p-3 rounded-lg"
      style={{ minWidth: '180px', maxWidth: '250px' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="text-center font-bold">End</div>
    </div>
  );
};

// Custom edge with dropdown
interface CustomEdgeProps {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: any;
  data?: any;
  markerEnd?: string;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { apps } = useContext(WorkflowContext);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const edgeLabel = data?.branchLabel ? (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        fontSize: 12,
        fontWeight: 700,
        pointerEvents: 'all',
        padding: '2px 4px',
        borderRadius: 4,
        background: 'white',
        border: '1px solid #ccc',
        left: labelX,
        top: labelY,
        cursor: 'pointer',
      }}
      onClick={handleEdgeClick}
    >
      {data.branchLabel}
    </div>
  ) : null;

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 2 }}
        className="react-flow__edge-path stroke-gray-400 hover:stroke-blue-500 cursor-pointer"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={handleEdgeClick}
      />
      {edgeLabel}
      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            left: (sourceX + targetX) / 2,
            top: (sourceY + targetY) / 2,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <div className="font-bold mb-2 border-b pb-1">Edge Options</div>
          <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Delete Edge</div>
          <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Edit Condition</div>
          {data?.branchLabel && (
            <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">Rename Branch: {data.branchLabel}</div>
          )}
        </div>
      )}
    </>
  );
};

// Autolayout function using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50, rankSep: 150 });

  // Set node dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  // Set edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100, // Center the node
        y: nodeWithPosition.y - 50,  // Center the node
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const AddButtonNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="text-2xl font-bold text-gray-700">+</div>
    </div>
  );
};

interface AppSelectorProps {
  position: { x: number; y: number };
  onSelect: (appId: string) => void;
  onClose: () => void;
  type: 'trigger' | 'action';
}

const AppSelector: React.FC<AppSelectorProps> = ({
  position,
  onSelect,
  onClose,
  type
}) => {
  const { apps } = useContext(WorkflowContext);

  // Filter apps based on type
  const filteredApps = Object.values(apps).filter(app => {
    if (type === 'trigger') {
      return Object.keys(app.triggers).length > 0;
    } else {
      return Object.keys(app.actions).length > 0;
    }
  });

  return (
    <div
      className="absolute bg-white shadow-lg rounded-md border border-gray-200 z-10"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <span className="font-medium">Select an app</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="p-1">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className={`p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center ${app.color}`}
            onClick={() => onSelect(app.id)}
          >
            <span className="mr-2 text-xl">{app.icon}</span>
            <div>
              <div className="font-medium">{app.name}</div>
              <div className="text-xs text-gray-600">{app.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ConfigurationSidebarProps {
  data: ConfigurationData;
  onSave: (config: ConfigurationData) => void;
  onCancel: () => void;
}

const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({
  data,
  onSave,
  onCancel
}) => {
  const { apps } = useContext(WorkflowContext);
  const [selectedItem, setSelectedItem] = useState<TriggerConfig | ActionConfig | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [branches, setBranches] = useState<string[]>(['Branch 1', 'Otherwise']);

  const app = apps[data.appId];

  useEffect(() => {
    // Initialize form values
    setConfigValues({});
    if (data.type === 'trigger') {
      const triggerItems = Object.values(app.triggers);
      if (triggerItems.length === 1) {
        setSelectedItem(triggerItems[0]);
      }
    } else {
      const actionItems = Object.values(app.actions);
      if (actionItems.length === 1) {
        setSelectedItem(actionItems[0]);
      }
    }
  }, [data, app]);

  const handleInputChange = (key: string, value: any) => {
    setConfigValues({ ...configValues, [key]: value });
  };

  const handleBranchChange = (index: number, value: string) => {
    const newBranches = [...branches];
    newBranches[index] = value;
    setBranches(newBranches);
  };

  const addBranch = () => {
    setBranches([...branches.slice(0, -1), `Branch ${branches.length}`, branches[branches.length - 1]]);
  };

  const removeBranch = (index: number) => {
    if (branches.length <= 2) return; // Need at least 2 branches
    const newBranches = [...branches];
    newBranches.splice(index, 1);
    setBranches(newBranches);
  };

  const handleSave = () => {
    const configData = { ...data, selectedItem, config: configValues };
    // For condition nodes, add branches
    if (selectedItem?.key === 'condition') {
      configData.branches = branches;
    }
    onSave(configData);
  };

  const isValidConfig = () => {
    if (!selectedItem) return false;

    // For condition nodes, just check if we have at least 2 branches
    if (selectedItem.key === 'condition') {
      return branches.length >= 2;
    }

    // Check if all required config fields have values
    const config = selectedItem.config;
    if (typeof config === 'object') {
      for (const key in config) {
        if (config[key].required && !configValues[key]) {
          return false;
        }
      }
    }
    return true;
  };

  if (!app) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-20">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-lg">Configure {data.type === 'trigger' ? 'Trigger' : 'Action'}</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">{app.icon}</span>
            <span className="font-medium text-lg">{app.name}</span>
          </div>
          <p className="text-sm text-gray-600">{app.description}</p>
        </div>

        {/* Type selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select {data.type === 'trigger' ? 'Trigger' : 'Action'} Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedItem?.key || ''}
            onChange={(e) => {
              const items = data.type === 'trigger' ? app.triggers : app.actions;
              const selected = Object.values(items).find(item => item.key === e.target.value);
              setSelectedItem(selected || null);
              setConfigValues({});
            }}
          >
            <option value="">Select...</option>
            {data.type === 'trigger' && Object.values(app.triggers).map(trigger => (
              <option key={trigger.key} value={trigger.key}>{trigger.label}</option>
            ))}
            {data.type === 'action' && Object.values(app.actions).map(action => (
              <option key={action.key} value={action.key}>{action.label}</option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div>
            <div className="text-sm text-gray-600 mb-4">{selectedItem.description}</div>

            {/* Configuration Fields */}
            {selectedItem.key === 'condition' ? (
              <div>
                <div className="mb-2 flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Branches</label>
                  <button onClick={addBranch} className="text-blue-500 hover:text-blue-700 text-sm">+ Add Branch</button>
                </div>
                {branches.map((branch, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => handleBranchChange(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder={`Branch ${index + 1}`}
                    />
                    {index < branches.length - 1 && index > 0 && (
                      <button
                        onClick={() => removeBranch(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              selectedItem.config && typeof selectedItem.config === 'object' && Object.entries(selectedItem.config).map(([key, field]: [string, any]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={configValues[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={configValues[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidConfig()}
            className={`px-4 py-2 rounded-md ${
              isValidConfig()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  addButtonNode: AddButtonNode,
  endNode: EndNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const WorkflowBuilder = () => {
  // Initial setup with empty trigger node and end node
  const initialNodes: Node[] = [
    {
      id: 'trigger-1',
      type: 'triggerNode',
      position: { x: 250, y: 50 },
      data: { label: 'Select Trigger', configured: false, nodeId: 'trigger-1' },
    },
    {
      id: 'end-1',
      type: 'endNode',
      position: { x: 250, y: 200 },
      data: { label: 'End', isEndNode: true },
    }
  ];
  
  const initialEdges: Edge[] = [
    {
        id:'e1-trigger1-end1',
        source:'trigger-1',
        target:'end-1',
        type:'custom',
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();

  // State for app selection dropdown
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string|null>(null);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectorType, setSelectorType] = useState<'trigger'|'action'>('trigger');
  const [parentNode, setParentNode] = useState<string|null>(null);
  const [branchLabel, setBranchLabel] = useState<string|null>(null);

  // State for configuration sidebar
  const [showConfigSidebar, setShowConfigSidebar] = useState(false);
  const [configData, setConfigData] = useState<any>(null);

  // Initialize with an end node and connect it to the trigger
  useEffect(() => {
    if (nodes.length === 2 && edges.length === 0) {
      // Connect trigger to end node
      setEdges([{
        id: `e-trigger-1-end-1`,
        source: 'trigger-1',
        target: 'end-1',
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed },
      }]);
      
      // Apply layout after initialization
      setTimeout(() => {
        onLayout('TB');
      }, 100);
    }
  }, []);

  // Apply autolayout
  const onLayout = useCallback((direction: string) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    
    setNodes([...layoutedNodes]);
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [nodes, edges, setNodes, reactFlowInstance]);

  // Handle connection between nodes
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'custom',
          // Use our custom edge
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
        eds
      )
    );
  }, [setEdges]);

  // Handle node click to show configuration or app selector
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'triggerNode' && !node.data.configured) {
      const rect = (event.target as Element).getBoundingClientRect();
      setSelectorPosition({ x: rect.left, y: rect.bottom });
      setCurrentNodeId(node.id);
      setSelectorType('trigger');
      setShowAppSelector(true);
    } else if (node.type === 'addButtonNode') {
      const rect = (event.target as Element).getBoundingClientRect();
      setSelectorPosition({ x: rect.left, y: rect.bottom });
      setCurrentNode
Id(node.id);setParentNode(node.data.parentNode);
setBranchLabel(node.data.branchLabel);
setSelectorType('action');
setShowAppSelector(true);
} else if (node.data.configured) {
  // Edit existing configured nodes
  setConfigData({
    nodeId: node.id,
    appId: node.data.app,
    type: node.type === 'triggerNode' ? 'trigger' : 'action',
    selectedItem: node.data.trigger ? 
      SAMPLE_APPS[node.data.app].triggers[node.data.trigger] : 
      SAMPLE_APPS[node.data.app].actions[node.data.action],
    config: node.data.config,
    parentNode: node.data.parentNode,
    branchLabel: node.data.branchLabel,
    branches: node.data.branches
  });
  setShowConfigSidebar(true);
}
}, []);

// Handle app selection
const handleAppSelect = (app: string) => {
  setShowAppSelector(false);
  // Store selected app for configuration
  setConfigData({
    nodeId: currentNodeId,
    appId: app,
    type: selectorType,
    parentNode: parentNode,
    branchLabel: branchLabel
  });
  setShowConfigSidebar(true);
};

// Find the end node in the workflow
const findEndNode = () => {
  return nodes.find(n => n.data.isEndNode === true);
};

// Handle configuration save
const handleConfigSave = (config: any) => {
  setShowConfigSidebar(false);
  const { nodeId, appId, selectedItem, type, parentNode, branchLabel } = config;
  const app = SAMPLE_APPS[appId];
  
  if (type === 'trigger') {
    // Update trigger node with configuration
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: `${app.name}: ${selectedItem.label}`,
            app: appId,
            trigger: selectedItem.key,
            configured: true,
            config: config.config
          }
        };
      }
      return node;
    }));
    
    // Connect trigger node to end node if not already connected
    const endNode = findEndNode();
    if (endNode) {
      const existingEdge = edges.find(e => e.source === nodeId && e.target === endNode.id);
      if (!existingEdge) {
        setEdges(eds => [
          ...eds,
          {
            id: `e-${nodeId}-${endNode.id}`,
            source: nodeId,
            target: endNode.id,
            type: 'custom',
            markerEnd: { type: MarkerType.ArrowClosed }
          }
        ]);
      }
    }
    
    // Apply auto layout
    setTimeout(() => {
      onLayout('TB');
    }, 10);
  } else if (type === 'action') {
    if (selectedItem.key === 'condition') {
      // Create condition node
      const newNodeId = `condition-${Date.now()}`;
      const parentNodeObj = nodes.find(n => n.id === parentNode);
      if (parentNodeObj) {
        // Remove the add button node
        setNodes(nodes.filter(n => n.id !== nodeId));
        
        // Find all edges connected to the add button
        const connectedEdges = edges.filter(e => e.target === nodeId);
        
        // Find the end node
        const endNode = findEndNode();
        
        // Add condition node
        setNodes(nds => [
          ...nds,
          {
            id: newNodeId,
            type: 'conditionNode',
            position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 150 },
            data: {
              label: 'Condition',
              branches: config.branches || ['Branch1', 'Otherwise'],
              configured: true,
              config: config.config,
              app: appId,
              action: selectedItem.key
            }
          }
        ]);
        
        // Connect parent to condition
        setEdges(eds => [
          ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
          {
            id: `e-${parentNode}-${newNodeId}`,
            source: parentNode,
            target: newNodeId,
            type: 'custom',
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { branchLabel: branchLabel }
          }
        ]);
        
        // Create add button nodes for each branch
        setTimeout(() => {
          const branches = config.branches || ['Branch1', 'Otherwise'];
          branches.forEach((branch: string, index: number) => {
            const addButtonId = `add-button-${Date.now()}-${index}`;
            
            // Add a new AddButtonNode for this branch
            setNodes(nds => [
              ...nds,
              {
                id: addButtonId,
                type: 'addButtonNode',
                position: { 
                  x: parentNodeObj.position.x + (index - (branches.length - 1) / 2) * 150, 
                  y: parentNodeObj.position.y + 250 
                },
                data: {
                  label: '+',
                  parentNode: newNodeId,
                  branchLabel: branch
                }
              }
            ]);
            
            // Connect condition to this AddButtonNode
            setEdges(eds => [
              ...eds,
              {
                id: `e-${newNodeId}-${addButtonId}`,
                source: newNodeId,
                target: addButtonId,
                type: 'custom',
                markerEnd: { type: MarkerType.ArrowClosed },
                data: { branchLabel: branch }
              }
            ]);
          });
          
          // Apply auto layout
          setTimeout(() => {
            onLayout('TB');
          }, 10);
        }, 10);
      }
    } else {
      // Create standard action node
      const newNodeId = `action-${Date.now()}`;
      const parentNodeObj = nodes.find(n => n.id === parentNode);
      if (parentNodeObj) {
        // Remove the add button node
        setNodes(nodes.filter(n => n.id !== nodeId));
        
        // Find the end node
        const endNode = findEndNode();
        
        // Add action node
        setNodes(nds => [
          ...nds,
          {
            id: newNodeId,
            type: 'actionNode',
            position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 150 },
            data: {
              label: `${app.name}: ${selectedItem.label}`,
              app: appId,
              action: selectedItem.key,
              configured: true,
              config: config.config,
              parentNode: parentNode,
              branchLabel: branchLabel
            }
          }
        ]);
        
        // Connect parent to action
        setEdges(eds => [
          ...eds.filter(e => e.target !== nodeId), // Remove old edge to add button
          {
            id: `e-${parentNode}-${newNodeId}`,
            source: parentNode,
            target: newNodeId,
            type: 'custom',
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { branchLabel: branchLabel }
          }
        ]);
        
        // Connect action to end node if from a condition branch
        if (branchLabel && endNode) {
          setTimeout(() => {
            setEdges(eds => [
              ...eds,
              {
                id: `e-${newNodeId}-${endNode.id}`,
                source: newNodeId,
                target: endNode.id,
                type: 'custom',
                markerEnd: { type: MarkerType.ArrowClosed }
              }
            ]);
            
            // Apply auto layout
            onLayout('TB');
          }, 20);
        } else {
          // Add new AddButtonNode after this action if not a condition branch
          const addButtonId = `add-button-${Date.now()}`;
          setTimeout(() => {
            setNodes(nds => [
              ...nds,
              {
                id: addButtonId,
                type: 'addButtonNode',
                position: { x: parentNodeObj.position.x, y: parentNodeObj.position.y + 250 },
                data: {
                  label: '+',
                  parentNode: newNodeId
                }
              }
            ]);
            
            // Connect action to AddButtonNode
            setEdges(eds => [
              ...eds,
              {
                id: `e-${newNodeId}-${addButtonId}`,
                source: newNodeId,
                target: addButtonId,
                type: 'custom',
                markerEnd: { type: MarkerType.ArrowClosed }
              }
            ]);
            
            // Apply auto layout
            setTimeout(() => {
              onLayout('TB');
            }, 10);
          }, 10);
        }
      }
    }
  }
};

// Delete a node and its connected edges
const handleNodeDelete = (nodeId: string) => {
  // Remove the node
  setNodes(nodes.filter(n => n.id !== nodeId));
  
  // Remove all connected edges
  setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
  
  // Apply auto layout
  setTimeout(() => {
    onLayout('TB');
  }, 10);
};

// Handle edge delete
const handleEdgeDelete = (edgeId: string) => {
  setEdges(edges.filter(e => e.id !== edgeId));
};

// Handle configuration cancel
const handleConfigCancel = () => {
  setShowConfigSidebar(false);
};

// Export workflow as JSON
const exportWorkflow = () => {
  const workflow = {
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type,
      data: n.data
    })),
    edges: edges
  };
  
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(workflow, null, 2)
  )}`;
  
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = 'workflow.json';
  link.click();
};

return (
  <WorkflowContext.Provider value={{ apps: SAMPLE_APPS, nodes, edges, setNodes, setEdges }}>
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
        fitView
      >
        <Panel position="top-right">
          <div className="bg-white p-2 rounded-md shadow border border-gray-200 flex items-center space-x-2">
            <button
              onClick={() => onLayout('TB')}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Vertical Layout
            </button>
            <button
              onClick={() => onLayout('LR')}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Horizontal Layout
            </button>
            <button
              onClick={exportWorkflow}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 ml-2"
            >
              Export
            </button>
          </div>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
      
      {showAppSelector && (
        <AppSelector
          position={selectorPosition}
          onSelect={handleAppSelect}
          onClose={() => setShowAppSelector(false)}
          type={selectorType}
        />
      )}
      
      {showConfigSidebar && (
        <ConfigurationSidebar
          data={configData}
          onSave={handleConfigSave}
          onCancel={handleConfigCancel}
        />
      )}
    </div>
  </WorkflowContext.Provider>
);
};

// Widget for exporting the flow
const WorkflowExportWidget: React.FC = () => {
  const { nodes, edges } = useContext(WorkflowContext);
  
  const handleExport = () => {
    const workflow = {
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.type,
        data: n.data
      })),
      edges: edges
    };
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(workflow, null, 2)
    )}`;
    
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'workflow.json';
    link.click();
  };
  
  return (
    <button
      onClick={handleExport}
      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
      Export Workflow
    </button>
  );
};

// Widget for workflow validation
const WorkflowValidationWidget: React.FC = () => {
  const { nodes, edges } = useContext(WorkflowContext);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  
  const validateWorkflow = () => {
    // Check if we have at least one configured trigger
    const hasTrigger = nodes.some(n => n.type === 'triggerNode' && n.data.configured);
    
    if (!hasTrigger) {
      setIsValid(false);
      setValidationMessage('Workflow must have at least one configured trigger');
      return;
    }
    
    // Check if all nodes are connected
    const connectedNodeIds = new Set<string>();
    
    // Start with trigger nodes
    const triggerNodes = nodes.filter(n => n.type === 'triggerNode' && n.data.configured);
    triggerNodes.forEach(n => connectedNodeIds.add(n.id));
    
    // Follow edges to find all connected nodes
    let newConnections = true;
    while (newConnections) {
      newConnections = false;
      edges.forEach(edge => {
        if (connectedNodeIds.has(edge.source) && !connectedNodeIds.has(edge.target)) {
          connectedNodeIds.add(edge.target);
          newConnections = true;
        }
      });
    }
    
    // Check if all non-trigger nodes are connected
    const disconnectedNodes = nodes.filter(
      n => n.type !== 'triggerNode' && !connectedNodeIds.has(n.id)
    );
    
    if (disconnectedNodes.length > 0) {
      setIsValid(false);
      setValidationMessage('All nodes must be connected to the workflow');
      return;
    }
    
    setIsValid(true);
    setValidationMessage('Workflow is valid');
  };
  
  return (
    <div className="px-3 py-2 bg-white rounded shadow">
      <button
        onClick={validateWorkflow}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Validate Workflow
      </button>
      {validationMessage && (
        <div className={`mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;