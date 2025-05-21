
import dagre from 'dagre';
import { Plus } from 'lucide-react';
// import { Badge, Label } from '@components/ui';

// // Context to manage workflow state
// const WorkflowContext = createContext(null);

// // Layout configuration
// const nodeWidth = 300;
// const nodeHeight = 100;
// const getLayoutedElements = (nodes, edges, direction = 'TB') => {
//   const dagreGraph = new dagre.graphlib.Graph();
//   dagreGraph.setDefaultEdgeLabel(() => ({}));

//   // Set graph direction and configuration
//   dagreGraph.setGraph({
//     rankdir: direction,
//   nodesep: 100,    // Increased node spacing
//   ranksep: 120,    // Better vertical spacing
//   marginx: 80,
//   marginy: 80,
//   acyclicer: 'greedy',
//   ranker: 'tight-tree'  // Better for dense graphs
//   });

//   // Add nodes to dagre graph
//   nodes.forEach((node) => {
//     // Consider node type or data for custom dimensions if needed
//     dagreGraph.setNode([node.id](http://node.id/), {
//       width: nodeWidth,
//       height: nodeHeight,
//       // You can add custom properties based on node type if needed
//       // weight: node.data?.priority || 1
//     });
//   });

//   // Process edges - important for branching
//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target, {
//       // Pass through any edge attributes that might be useful
//       sourceHandle: edge.sourceHandle,
//       targetHandle: edge.targetHandle,
//       // Add weight to prioritize certain edges in layout
//       weight: edge.data?.weight || 1,
//       // Add minimum length to control edge distance
//       minlen: edge.data?.minlen || 1
//     });
//   });

//   // Calculate layout with improved options
//   dagre.layout(dagreGraph);

//   // Update node positions with optional offset based on node type
//   const layoutedNodes = nodes.map((node) => {
//     const nodeWithPosition = dagreGraph.node([node.id](http://node.id/));

//     // Ensure the node was properly processed
//     if (!nodeWithPosition) {
//       console.warn(`Node ${node.id} was not processed by dagre layout`);
//       return node; // Return original node if not found
//     }

//     // Apply position with potential custom offset based on node type/data
//     const xOffset = node.data?.xOffset || 0;
//     const yOffset = node.data?.yOffset || 0;

//     return {
//       ...node,
//       position: {
//         x: nodeWithPosition.x - nodeWidth / 2 + xOffset,
//         y: nodeWithPosition.y - nodeHeight / 2 + yOffset,
//       },
//     };
//   });

//   return layoutedNodes
// };

// // Sample data
// const SAMPLE_APPS = {
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
//         config: {}
//       },
//       new_labeled_email: {
//         key: 'new_labeled_email',
//         label: 'New Labeled Email',
//         description: 'Triggers when a label is added to an email',
//         appId: 'gmail',
//         config: {}
//       }
//     },
//     actions: {
//       send_email: {
//         key: 'send_email',
//         label: 'Send Email',
//         appId: 'gmail',
//         description: 'Send an email via Gmail',
//         config: {}
//       }
//     }
//   },
//   sheets: {
//     id: 'sheets',
//     name: 'Google Sheets',
//     icon: '📊',
//     color: 'bg-green-100',
//     description: 'Google Sheets integration',
//     triggers: {
//       new_row: {
//         key: 'new_row',
//         label: 'New Row',
//         description: 'Triggers when a new row is added to a sheet',
//         appId: 'sheets',
//         config: {}
//       }
//     },
//     actions: {
//       add_row: {
//         key: 'add_row',
//         label: 'Add Row',
//         appId: 'sheets',
//         description: 'Add a new row to a Google Sheet',
//         config: {}
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
//         config: {}
//       }
//     },
//     actions: {
//       send_message: {
//         key: 'send_message',
//         label: 'Send Message',
//         appId: 'slack',
//         description: 'Send a message to a Slack channel',
//         config: {}
//       }
//     }
//   },
//   contacts: {
//     id: 'contacts',
//     name: 'Contacts',
//     icon: '👥',
//     color: 'bg-blue-100',
//     description: 'Contacts management',
//     triggers: {
//       new_contact: {
//         key: 'new_contact',
//         label: 'New Contact',
//         description: 'Triggers when a new contact is created',
//         appId: 'contacts',
//         config: {}
//       }
//     },
//     actions: {
//       create_contact: {
//         key: 'create_contact',
//         label: 'Create Contact',
//         appId: 'contacts',
//         description: 'Create a new contact',
//         config: {}
//       }
//     }
//   },
//   core: {
//     id: 'core',
//     name: 'Core',
//     icon: '⚙️',
//     color: 'bg-gray-100',
//     description: 'Core automation functions',
//     actions: {
//       condition: {
//         key: 'condition',
//         label: 'Condition',
//         appId: 'core',
//         description: 'Add a conditional branch to your workflow',
//         config: {}
//       },
//       delay: {
//         key: 'delay',
//         label: 'Delay',
//         appId: 'core',
//         description: 'Delay execution for a specified time',
//         config: {}
//       }
//     }
//   },
//   ai: {
//     id: 'ai',
//     name: 'AI',
//     icon: '🧠',
//     color: 'bg-yellow-100',
//     description: 'AI automation tools',
//     actions: {
//       generate_text: {
//         key: 'generate_text',
//         label: 'Generate Text',
//         appId: 'ai',
//         description: 'Generate text using AI',
//         config: {}
//       },
//       analyze_sentiment: {
//         key: 'analyze_sentiment',
//         label: 'Analyze Sentiment',
//         appId: 'ai',
//         description: 'Analyze the sentiment of text',
//         config: {}
//       }
//     }
//   },
//   human: {
//     id: 'human',
//     name: 'Human Input',
//     icon: '🙋',
//     color: 'bg-indigo-100',
//     description: 'Human interaction steps',
//     actions: {
//       approval: {
//         key: 'approval',
//         label: 'Approval',
//         appId: 'human',
//         description: 'Request human approval before proceeding',
//         config: {}
//       }
//     }
//   },
//   schedule: {
//     id: 'schedule',
//     name: 'Schedule',
//     icon: '🕒',
//     color: 'bg-purple-100',
//     description: 'Schedule-based triggers',
//     triggers: {
//       cron: {
//         key: 'cron',
//         label: 'Cron Schedule',
//         description: 'Trigger based on a cron schedule',
//         appId: 'schedule',
//         config: {}
//       }
//     }
//   },
//   webhook: {
//     id: 'webhook',
//     name: 'Webhook',
//     icon: '🔗',
//     color: 'bg-pink-100',
//     description: 'Webhook integration',
//     triggers: {
//       new_webhook: {
//         key: 'new_webhook',
//         label: 'New Webhook',
//         description: 'Triggers when a webhook is received',
//         appId: 'webhook',
//         config: {}
//       }
//     }
//   }
// };

// // Custom Edge Component with delete button
// function CustomEdge(props) {
//   const {
//     source,
//     target,
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition,
//     targetPosition,
//     style = {},
//     markerEnd,
//     sourceHandleId,
//     data
//   } = props;

//   const { addNode } = useContext(WorkflowContext);

//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition: Position.Bottom, // Force bottom position for source
//     targetPosition: Position.Top,    // Force top position for target
//   });

//   const onAddNode = (e) => {
//     e.stopPropagation();
//     addNode(source, target);
//   };

//   return (
//     <>
//       <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

//       <EdgeLabelRenderer>
//         <div
//           style={{
//             position: 'absolute',
//             transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
//             pointerEvents: 'all',
//             zIndex: 1000,
//           }}
//           className="no-drag no-pan"
//         >
//           <button
//             className="w-5 h-5 z-40 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100"
//             onClick={onAddNode}
//           >
//             <Plus size={12} />
//           </button>
//         </div>
//       </EdgeLabelRenderer>
//     </>
//   );
// }

// // RouterStartEdge.tsx

// export interface RouterStartEdgeData {
//   isBranchEmpty: boolean;
//   branchIndex: number;
//   label: string;
//   parentStepName: string;
// }

// function RouterStartEdge(props) {
//   const {
//     id,
//     source,
//     target,
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     markerEnd,
//     style = {},
//     data,
//   } = props;

//   console.log('router start edge', { data });

//   // Compute a smooth bezier curve from parent → branch
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition: Position.Bottom,
//     targetPosition: Position.Top,
//   });

//   return (
//     <>
//       {/* Main curved edge */}
//       <path
//         id={id}
//         className="react-flow__edge-path"
//         d={edgePath}
//         markerEnd={markerEnd}
//         style={{ ...style }}
//       />

//       {/* Branch label centered along the edge */}
//       {data?.label && (
//         <foreignObject
//           width={100}
//           height={40}
//           x={labelX - 50}
//           y={labelY - 20}
//           className="edge-label-foreign-object"
//           requiredExtensions="http://www.w3.org/1999/xhtml"
//         >
//           <div
//             className="edge-label-container"
//             style={{
//               background: 'white',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               border: '1px solid #ccc',
//               textAlign: 'center',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//             onClick={() => {
//               // Handle click event
//               if (data.onAddStep) {
//                 data.onAddStep(id, source, target);
//               }
//             }}
//           >
//             {data.label}
//           </div>
//         </foreignObject>
//       )}
//     </>
//   );
// }

// const AddButtonNode = ({ data }) => {
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

// export function RouterEndEdge(props) {
//   const {
//     id,
//     source,
//     target,
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     markerEnd,
//     style = {},
//     data,
//   } = props;

//   console.log({data})

//   // Calculate the path using elbow connectors for a cleaner look
//   // First go down from the source a bit
//   const sourceBottomY = sourceY + 20;

//   // Then, all branches connect at this y-position
//   const commonY = targetY - 40;

//   // Build path: elbow connector style
//   let path = `M${sourceX},${sourceY}`;  // Move to source
//   path +=  `L${sourceX},${sourceBottomY}`;  // Go down from source
//   path +=  `L${sourceX},${commonY}`;  // Continue down to the common Y position
//   path +=  `L${targetX},${commonY}`;  // Go horizontally to the target X position
//   path +=  `L${targetX},${targetY}`;  // Go down to the target

//   // Arc radius for plus button
//   const arc = 12;

//   return (
//     <>
//       {/* The straight merging edge */}
//       <BaseEdge
//         path={path}
//         markerEnd={markerEnd}
//         style={{ ...style, strokeWidth: 1.5, stroke: '#d1d5db' }}
//       />

//       {/* "+" drop target at the merge point (if needed) */}
//       {!data.isNextStepEmpty && (

//         <foreignObject
//           x={targetX - arc}
//           y={targetY - arc}
//           width={arc * 2}
//           height={arc * 2}
//           className="overflow-visible"
//         >
//           <div
//             style={{
//               width: arc * 2,
//               height: arc * 2,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               background: '#fff',
//               borderRadius: arc,
//               cursor: 'pointer',
//             }}

//           >
//             <button
//             className="w-5 h-5 z-40 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100"

//           >
//             <Plus size={12} />
//           </button>

//           </div>
//         </foreignObject>
//       )}
//     </>
//   );
// }

// // Categories for filters
// const CATEGORIES = [
//   { id: 'all', label: 'All' },
//   { id: 'ai', label: 'AI' },
//   { id: 'core', label: 'Core' },
//   { id: 'apps', label: 'Apps' }
// ];

// // Node types for the workflow
// const NODE_TYPES = {
//   TRIGGER: 'trigger',
//   ACTION: 'action',
//   CONDITION:'condition' ,
//   ADD_BUTTON: 'add-button',
//   BRANCH:'branch',
//   END: 'end'
// };

// // Custom Trigger Node Component
// const TriggerNode = ({ data }) => {
//   const { openAppSelector } = useContext(WorkflowContext);

//   return (
//     <div className={`relative px-4 py-3 rounded-lg shadow-sm border border-violet-200 bg-white transition-all ${data.selected ? "border-violet-500 shadow-md" : "" //       } w-[300px]`}>

//       <div
//         className="flex items-center cursor-pointer gap-3"
//         onClick={() => data.configured ? data.onEdit() : openAppSelector('trigger', [data.id](http://data.id/))}
//       >
//         {data.app ? (
//           <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${data.app.color || "bg-gray-100"}`}>
//             {data.app.icon}
//           </div>
//         ) : (
//           <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
//             <span className="text-gray-500">🔌</span>
//           </div>
//         )}

//         <div className="flex-1">
//           {
//             data?.app && <Badge variant="outline" className="bg-purple-50 text-blue-600">Trigger</Badge>

//           }
//           <div className="flex items-center gap-2">

//             <span className={`font-medium ${data.configured ? "text-gray-800" : "text-gray-600" //               }`}>
//               {data.configured ? data.triggerConfig.label : "Select Trigger"}
//             </span>
//             <ChevronDown className="w-4 h-4 text-gray-400" />
//           </div>

//           {data.configured ? (
//             <p className="text-xs text-gray-500 mt-1 line-clamp-1">{data.triggerConfig.description}</p>
//           ) : (
//             <div className="flex items-center mt-1 gap-1">
//               <span className="text-xs text-amber-600">Empty Trigger</span>
//               <AlertCircle className="w-3 h-3 text-amber-500" />
//             </div>
//           )}
//         </div>
//       </div>

//       <Handle
//         type="source"
//         position={Position.Bottom}
//         style={{
//           width: '10px',
//           height: '10px',
//           bottom: '-5px',
//           borderRadius: '50%',
//           background: '#e2e8f0',
//           zIndex: 1
//         }}
//       />
//     </div>
//   );
// };

// // Custom Action Node Component
// const ActionNode = ({ data }) => {
//   const { openAppSelector } = useContext(WorkflowContext);
//     console.log('actions',{data})
//   // Extract branch labels from the data
//   const branchLabels = data.branchLabels || [];
//   const isCondition = data.actionConfig?.key === 'condition';

//   return (
//     <div className={`relative px-4 py-3 rounded-lg shadow-sm border border-blue-200 bg-white ${data.selected ? "border-blue-500 shadow-md" : ""} w-[300px]`}>
//       <div className="flex items-center cursor-pointer gap-3" onClick={() => data.configured ? data.onEdit() : openAppSelector('action', [data.id](http://data.id/))}>
//         {data.app ? (
//           <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${data.app.color || "bg-gray-100"}`}>
//             {data.app.icon}
//           </div>
//         ) : (
//           <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
//             <span className="text-gray-500">🔌</span>
//           </div>
//         )}
//         <div className="flex-1">
//           {data?.app && <Badge variant="outline" className="bg-purple-50 text-green-600">Action</Badge>}
//           <div className="flex items-center gap-2">
//             <span className={`font-medium ${data.configured ? "text-gray-800" : "text-gray-600"}`}>
//               {data.configured ? data.actionConfig.label : "Select Action"}
//             </span>
//             <ChevronDown className="w-4 h-4 text-gray-400" />
//           </div>
//           {data.configured ? (
//             <p className="text-xs text-gray-500 mt-1">{data.actionConfig.description}</p>
//           ) : (
//             <div className="flex items-center mt-1 gap-1">
//               <span className="text-xs text-gray-400">Empty Action</span>
//             </div>
//           )}
//         </div>
//       </div>
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{
//           width: '10px',
//           height: '10px',
//           top: '-5px',
//           borderRadius: '50%',
//           background: '#e2e8f0',
//           zIndex: 1
//         }}
//       />

//         <Handle
//           type="source"
//           position={Position.Bottom}
//           style={{
//             width: '10px',
//             height: '10px',
//             bottom: '-5px',
//             borderRadius: '50%',
//             background: '#e2e8f0',
//             zIndex: 1
//           }}
//         />
//     </div>
//   );
// };
// const ConditionNode = ({ data }) => {
//   const { openAppSelector } = useContext(WorkflowContext);
//     console.log('actions',{data})
//   // Extract branch labels from the data
//   const branchLabels = data.branchLabels || [];
//   const isCondition = data.actionConfig?.key === 'condition';

//   return (
//     <div className={`relative px-4 py-3 rounded-lg shadow-sm border border-blue-200 bg-white ${data.selected ? "border-blue-500 shadow-md" : ""} w-[300px]`}>
//       <div className="flex items-center cursor-pointer gap-3" onClick={() => data.configured ? data.onEdit() : openAppSelector('action', [data.id](http://data.id/))}>
//         {data.app ? (
//           <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${data.app.color || "bg-gray-100"}`}>
//             {data.app.icon}
//           </div>
//         ) : (
//           <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
//             <span className="text-gray-500">🔌</span>
//           </div>
//         )}
//         <div className="flex-1">
//           {data?.app && <Badge variant="outline" className="bg-purple-50 text-green-600">Action</Badge>}
//           <div className="flex items-center gap-2">
//             <span className={`font-medium ${data.configured ? "text-gray-800" : "text-gray-600"}`}>
//               {data.configured ? data.actionConfig.label : "Select Action"}
//             </span>
//             <ChevronDown className="w-4 h-4 text-gray-400" />
//           </div>
//           {data.configured ? (
//             <p className="text-xs text-gray-500 mt-1">{data.actionConfig.description}</p>
//           ) : (
//             <div className="flex items-center mt-1 gap-1">
//               <span className="text-xs text-gray-400">Empty Action</span>
//             </div>
//           )}
//         </div>
//       </div>
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{
//           width: '10px',
//           height: '10px',
//           top: '-5px',
//           borderRadius: '50%',
//           background: '#e2e8f0',
//           zIndex: 1
//         }}
//       />

//         <Handle
//           type="source"
//           position={Position.Bottom}
//           style={{
//             width: '10px',
//             height: '10px',
//             bottom: '-5px',
//             borderRadius: '50%',
//             background: '#e2e8f0',
//             zIndex: 1
//           }}
//         />
//     </div>
//   );
// };
// const BranchNode = ({ data }) => {
//   const { openAppSelector } = useContext(WorkflowContext);

//   // Extract branch labels from the data
//   const nodes=useNodes()
//   const currentNode=nodes.find((d)=>[d.id===data.id](http://d.id===data.id/))
//    console.log({currentNode})

//   return (
//     <div className={`relative px-4 py-3 rounded-lg shadow-sm border border-blue-200 bg-white ${data.selected ? "border-blue-500 shadow-md" : ""} w-[300px]`}>

//   <div className="w-full flex items-center justify-center">
//       <Label >{data?.label}</Label>
//   </div>
//     <Handle
//         type="target"
//         position={Position.Top}
//         style={{
//           width: '10px',
//           height: '10px',
//           top: '-5px',
//           borderRadius: '50%',
//           background: '#e2e8f0',
//           zIndex: 1
//         }}
//       />

//         <Handle
//           type="source"
//           position={Position.Bottom}
//           style={{
//             width: '10px',
//             height: '10px',
//             bottom: '-5px',
//             borderRadius: '50%',
//             background: '#e2e8f0',
//             zIndex: 1
//           }}
//         />
//     </div>
//   );
// };

// // End Node Component
// const EndNode = ({ data }) => {
//   console.log('end',{data})
//   const nodes=useNodes()
//   const edges=useEdges()

//   console.log('end nodes',edges?.filter((d)=>[d.target===data.id](http://d.target===data.id/)))
//   return (

//     <div className="px-6 py-2 rounded-full  flex justify-center items-center  font-medium w-[300px]">
//       End
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{
//           width: '10px',
//           height: '10px',
//           top: '-5px',
//           borderRadius: '50%',
//           background: '#e2e8f0',
//           zIndex: 1
//         }}
//         className='invisible'
//       />
//     </div>
//   );
// };

// // App Selector Component
// const AppSelector = ({ isOpen, type, nodeId, onClose, onSelectApp, onSelectTrigger, onSelectAction }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedApp, setSelectedApp] = useState(null);

//   // Filter apps based on search term and category
//   const filteredApps = Object.values(SAMPLE_APPS).filter(app => {
//     const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' ||
//       (selectedCategory === 'ai' && [app.id](http://app.id/) === 'ai') ||
//       (selectedCategory === 'core' && [app.id](http://app.id/) === 'core') ||
//       (selectedCategory === 'apps' && [app.id](http://app.id/) !== 'ai' && [app.id](http://app.id/) !== 'core');

//     // For triggers, only include apps that have triggers
//     if (type === 'trigger' && !app.triggers) {
//       return false;
//     }

//     // For actions, only include apps that have actions
//     if (type === 'action' && !app.actions) {
//       return false;
//     }

//     return matchesSearch && matchesCategory;
//   });

//   const handleSelectApp = (app) => {
//     if (type === 'trigger' && app.triggers) {
//       setSelectedApp(app);
//     } else if (type === 'action' && app.actions) {
//       setSelectedApp(app);
//     } else {
//       onSelectApp(app);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={onClose}>
//       <div
//         className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-medium">
//             {selectedApp ? `Select ${type === 'trigger' ? 'Trigger' : 'Action'}` : `Select App`}
//           </h3>
//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {!selectedApp ? (
//           <>
//             <div className="p-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
//                 />
//               </div>

//               <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
//                 {CATEGORIES.map(category => (
//                   <button
//                     key={[category.id](http://category.id/)}
//                     className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category.id //                       ? "bg-violet-100 text-violet-700 font-medium" //                       : "bg-gray-100 text-gray-700" //                       }`}
//                     onClick={() => setSelectedCategory([category.id](http://category.id/))}
//                   >
//                     {category.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 max-h-[50vh] overflow-y-auto">
//               <div className="col-span-1 border-r overflow-y-auto p-4">
//                 <h4 className="text-sm font-medium text-gray-500 mb-3">Popular</h4>
//                 <div className="space-y-2">
//                   {filteredApps.map(app => (
//                     <div
//                       key={[app.id](http://app.id/)}
//                       className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
//                       onClick={() => handleSelectApp(app)}
//                     >
//                       <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${app.color}`}>
//                         {app.icon}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">{[app.name](http://app.name/)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="col-span-2 p-4 overflow-y-auto bg-gray-50">
//                 <div className="text-center text-gray-500 p-8">
//                   Select an app from the left panel
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="p-4 max-h-[50vh] overflow-y-auto">
//             <div className="mb-4">
//               <button
//                 className="flex items-center text-sm text-gray-500 hover:text-gray-700"
//                 onClick={() => setSelectedApp(null)}
//               >
//                 <ChevronDown className="w-4 h-4 rotate-90 mr-1" />
//                 Back to apps
//               </button>
//             </div>

//             <div className="space-y-2">
//               {type === 'trigger' && Object.values(selectedApp.triggers || {}).map(trigger => (
//                 <div
//                   key={trigger.key}
//                   className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200"
//                   onClick={() => onSelectTrigger(selectedApp, trigger)}
//                 >
//                   <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${selectedApp.color}`}>
//                     {selectedApp.icon}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{trigger.label}</p>
//                     <p className="text-xs text-gray-500">{trigger.description}</p>
//                   </div>
//                 </div>
//               ))}

//               {type === 'action' && Object.values(selectedApp.actions || {}).map(action => (
//                 <div
//                   key={action.key}
//                   className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200"
//                   onClick={() => onSelectAction(selectedApp, action)}
//                 >
//                   <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${selectedApp.color}`}>
//                     {selectedApp.icon}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{action.label}</p>
//                     <p className="text-xs text-gray-500">{action.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="p-4 border-t">
//           <button
//             className="w-full py-2 bg-violet-600 text-white rounded-md font-medium hover:bg-violet-700"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Configuration Sidebar Component// Modified ConfigurationSidebar component to handle condition configuration
// const ConfigurationSidebar = ({ isOpen, item, type, onClose, onSave }) => {
//   const [config, setConfig] = useState({});
//   const [branchCount, setBranchCount] = useState(2);

//   useEffect(() => {
//     if (item) {
//       setConfig(item.config || {});
//       if (item.conditionCount) {
//         setBranchCount(item.conditionCount);
//       }
//     }
//   }, [item]);

//   if (!isOpen || !item) return null;

//   const isCondition = type === 'action' && item?.key === 'condition';
//   console.log({ isCondition, item })
//   const handleSave = () => {
//     if (isCondition) {
//       onSave({
//         ...config,
//         branchCount,
//         type: 'condition'
//       });
//     } else {
//       onSave(config);
//     }
//   };

//   return (
//     <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
//       <div className="p-4 border-b flex items-center justify-between">
//         <h3 className="font-medium">Configure {type}</h3>
//         <button onClick={onClose}>
//           <X className="w-5 h-5 text-gray-500" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         {isCondition ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Number of branches
//               </label>
//               <input
//                 type="number"
//                 min="2"
//                 max="5"
//                 value={branchCount}
//                 onChange={(e) => setBranchCount(Math.max(2, Math.min(5, parseInt(e.target.value))))}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Branch names
//               </label>
//               {Array.from({ length: branchCount }).map((_, i) => (
//                 <div key={i} className="mb-2">
//                   <input
//                     type="text"
//                     placeholder={`Branch ${i + 1}`}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     value={config[`branch${i + 1}`] || ''}
//                     onChange={(e) => setConfig(prev => ({
//                       ...prev,
//                       [`branch${i + 1}`]: e.target.value
//                     }))}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {type === 'trigger' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {item.label} configuration
//                 </label>
//                 <p className="text-sm text-gray-500 mb-4">{item.description}</p>
//                 {/* Placeholder for trigger-specific config */}
//                 <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
//                   <p className="text-sm text-gray-500">
//                     Configuration fields would appear here based on the selected trigger.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {type === 'action' && !isCondition && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {item.label} configuration
//                 </label>
//                 <p className="text-sm text-gray-500 mb-4">{item.description}</p>
//                 {/* Placeholder for action-specific config */}
//                 <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
//                   <p className="text-sm text-gray-500">
//                     Configuration fields would appear here based on the selected action.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t bg-gray-50">
//         <button
//           className="w-full py-2 bg-violet-600 text-white rounded-md font-medium hover:bg-violet-700"
//           onClick={handleSave}
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Workflow Builder Component
// export default function WorkflowBuilder() {
//   const reactFlowWrapper = useRef(null);
//   const [nodes, setNodes] = useState([
//     {
//       id: 'trigger-1',
//       type: NODE_TYPES.TRIGGER,
//       position: { x: 0, y: 0 },
//       data: {
//         id: 'trigger-1',
//         configured: false,
//         type: 'trigger',
//         stepNumber: 1,
//         onEdit: () => handleEditNode('trigger-1')
//       }
//     },
//     {
//       id: 'end-1',
//       type: NODE_TYPES.END,
//       position: { x: 0, y: 50 },
//       data: { id: 'end-1' }
//     }
//   ]);
//   const [pendingAddition, setPendingAddition] = useState(null);
//   const [pendingAction, setPendingAction] = useState(null);

//   const [edges, setEdges] = useState([
//     {
//       id: 'e-trigger-1-end-1',
//       source: 'trigger-1',
//       target: 'end-1',
//       type: 'custom',
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//       }
//     }
//   ]);
//   const [nextId, setNextId] = useState(1);
//   const [appSelectorOpen, setAppSelectorOpen] = useState(false);
//   const [appSelectorType, setAppSelectorType] = useState(null);
//   const [appSelectorNodeId, setAppSelectorNodeId] = useState(null);
//   const [configSidebarOpen, setConfigSidebarOpen] = useState(false);
//   const [configItem, setConfigItem] = useState(null);
//   const [configType, setConfigType] = useState(null);
//   const [layout, setLayout] = useState('TB'); // Top to Bottom layout by default

//   const { fitView } = useReactFlow();

//   console.log({ nodes, edges })

//   // Update node step numbers
//   const updateNodeStepNumbers = useCallback((updatedNodes) => {
//     const nodeMap = {};
//     updatedNodes.forEach(node => {
//       nodeMap[[node.id](http://node.id/)] = node;
//     });

//     const visited = new Set();
//     const assignStepNumbers = (nodeId, stepNumber) => {
//       if (visited.has(nodeId)) return;
//       visited.add(nodeId);

//       const node = nodeMap[nodeId];
//       if (node && node.type !== NODE_TYPES.TRIGGER && node.type !== NODE_TYPES.END) {
//         node.data = { ...node.data, stepNumber };
//         stepNumber++;
//       }

//       // Find all outgoing edges from this node
//       const outgoingEdges = edges.filter(edge => edge.source === nodeId);
//       outgoingEdges.forEach(edge => {
//         assignStepNumbers(edge.target, stepNumber);
//       });
//     };

//     // Start with trigger nodes
//     const triggerNodes = updatedNodes.filter(node => node.type === NODE_TYPES.TRIGGER);
//     triggerNodes.forEach(trigger => {
//       assignStepNumbers([trigger.id](http://trigger.id/), 2); // Start with step 2 (after trigger)
//     });

//     return updatedNodes;
//   }, [edges]);

//   const startAddingNode = useCallback((sourceId, targetId) => {
//     setPendingAddition({ sourceId, targetId });
//     setAppSelectorType('action');
//     setAppSelectorOpen(true);
//   }, []);

//   // Handle node selection
//   const onNodeClick = useCallback((event, node) => {
//     setNodes(nodes =>
//       nodes.map(n => ({
//         ...n,
//         data: {
//           ...n.data,
//           selected: [n.id](http://n.id/) === [node.id](http://node.id/)
//         }
//       }))
//     );
//   }, []);

//   // Handle opening app selector
//   const openAppSelector = useCallback((type, nodeId) => {
//     setAppSelectorType(type);
//     setAppSelectorNodeId(nodeId);
//     setAppSelectorOpen(true);
//   }, []);

//   // Handle closing app selector
//   const closeAppSelector = useCallback(() => {
//     setAppSelectorOpen(false);
//     setAppSelectorType(null);
//     setAppSelectorNodeId(null);
//   }, []);

//   // Handle editing a node
//   const handleEditNode = useCallback((nodeId) => {

//     const node = nodes.find(n => [n.id](http://n.id/) === nodeId);
//     console.log({ node })
//     if (!node) return;
//     if (node.type === NODE_TYPES.TRIGGER && node.data.configured) {
//       setConfigItem(node.data.triggerConfig);
//       setConfigType('trigger');
//       setConfigSidebarOpen(true);
//     } else if (node.type === NODE_TYPES.ACTION && node.data.configured) {
//       setConfigItem(node.data.actionConfig);
//       setConfigType('action');
//       setConfigSidebarOpen(true);
//     }
//   }, [nodes]);

//   // Handle selecting a trigger
//   const handleSelectTrigger = useCallback((app, trigger) => {
//     setNodes(nodes =>
//       nodes.map(node => {
//         if ([node.id](http://node.id/) === appSelectorNodeId) {
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               app,
//               configured: true,
//               triggerConfig: trigger,
//               onEdit: () => handleEditNode([node.id](http://node.id/))
//             }
//           };
//         }
//         return node;
//       })
//     );

//     closeAppSelector();
//   }, [appSelectorNodeId, handleEditNode, closeAppSelector]);

//   const handleSelectAction = useCallback((app, action) => {

//     console.log({ action })
//     if (pendingAddition) {
//       setPendingAction({
//         app,
//         action,
//         sourceId: pendingAddition.sourceId,
//         targetId: pendingAddition.targetId
//       });
//       setConfigItem(action);
//       setConfigType('action');
//       setConfigSidebarOpen(true);
//       setPendingAddition(null);
//       closeAppSelector();
//     } else {
//       // Existing logic for editing existing nodes
//       setNodes(nodes =>
//         nodes.map(node => {
//           if ([node.id](http://node.id/) === appSelectorNodeId) {
//             return {
//               ...node,
//               data: {
//                 ...node.data,
//                 app,
//                 configured: true,
//                 actionConfig: action,
//                 onEdit: () => handleEditNode([node.id](http://node.id/))
//               }
//             };
//           }
//           return node;
//         })
//       );
//       closeAppSelector();
//     }
//   }, [pendingAddition, appSelectorNodeId, closeAppSelector]);

//   // Handle saving configuration
//  const handleSaveConfig = useCallback((config) => {

//   console.log({config})
//   if (configType === 'action' && pendingAction) {

//        const { app, action, sourceId, targetId } = pendingAction;
//     const newId = nextId + 1;
//     const newNodeId = `action-${newId}`;
//     const isCondition = action.key === 'condition';

//     //check if the source id is add button then create a new node then replace the sourceid node with current action also replace in edges
//     console.log({sourceId,targetId})
//     const currentSourceNode=nodes.find((d)=>d.id===sourceId)

//     // Determine branch info
//     const branchCount = isCondition ? (config.branchCount || 2) : 0;
//     const branchLabels = isCondition
//       ? Array.from({ length: branchCount }).map(
//           (_, i) => config[`branch${i + 1}`] || `Branch ${i + 1}`
//         )
//       : [];

//     // 1) Create the main action/condition node
//     const newNode: Node = {
//       id: newNodeId,
//       type: isCondition?NODE_TYPES.CONDITION:NODE_TYPES.ACTION,
//       position: { x: 0, y: 0 },
//       data: {
//         id: newNodeId,
//         app,
//         configured: true,
//         actionConfig: { ...action, config },
//         onEdit: () => handleEditNode(newNodeId),

//         ...(isCondition && { branchCount, branchLabels, targetId }),
//       },
//     };

//     const prunedEdges = edges.filter(
//       (e) => !(e.source === sourceId && e.target === targetId)
//     );

//     // 2) Prune the old source→target edge

//     // 3) Start building newEdges with source→newNode
//     const newEdges = [
//       ...prunedEdges,
//       {
//         id: `e-${sourceId}-${newNodeId}`,
//         source: sourceId,
//         target: newNodeId,
//         type: 'custom',
//         markerEnd: { type: MarkerType.ArrowClosed },
//       },
//     ];

//     // 4) If conditional router, generate branch nodes + edges
//     const branchNodes: Node[] = [];
//     if (isCondition) {
//       for (let i = 0; i < branchCount; i++) {
//         const branchNodeId = `${newNodeId}-branch-${i}`;

//         // a) create branch node
//         branchNodes.push({
//           id: branchNodeId,
//           type: NODE_TYPES.BRANCH,
//           position: { x: 0, y: 0 },
//           data: {
//             id: branchNodeId,
//             label: branchLabels[i],
//             stepLocationRelativeToParent:'inside_branch',
//             parentConditionId: newNodeId,
//             parentTargetId:targetId,
//             onEdit: () => handleEditNode(branchNodeId),
//           },
//         });

//         // b) RouterStart edge (condition → branch)
//         newEdges.push({
//           id: `e-${newNodeId}-branch-${i}-start`,
//           source: newNodeId,
//           target: branchNodeId,
//           type: 'step',
//           markerEnd: { type: MarkerType.ArrowClosed },
//           data: {
//             isBranchEmpty: false,
//             branchIndex: i,
//             label: branchLabels[i],
//             parentStepName: newNodeId,
//           } ,
//         });

//         // c) RouterEnd edge (branch → original target)
//         newEdges.push({
//           id: `e-branch-${i}-${targetId}-end`,
//           source: branchNodeId,
//           target: targetId,
//           type: 'custom',
//           markerEnd: { type: MarkerType.ArrowClosed },
//           data: {
//             isNextStepEmpty: false,
//             branchIndex: i,
//             parentStepName: newNodeId,
//           }
//         });
//       }
//     } else {
//       // 5) Normal action→target link
//       newEdges.push({
//         id: `e-${newNodeId}-${targetId}`,
//         source: newNodeId,
//         target: targetId,
//         type: 'custom',
//         markerEnd: { type: MarkerType.ArrowClosed },
//       });
//     }

//     // 6) Combine all nodes & auto-layout
//     const allNodes = [...nodes, newNode, ...branchNodes];
//     const layouted = getLayoutedElements(
//       updateNodeStepNumbers(allNodes),
//       newEdges,
//       layout
//     );
//     setNodes(layouted);
//     setEdges(newEdges);

//     // 7) Cleanup
//     setNextId(newId);
//     setPendingAction(null);
//     setConfigSidebarOpen(false);

//   } else if (configType === 'trigger' || configType === 'action') {
//     // Update existing node
//     setNodes(nodes => nodes.map(node => {
//       if ([node.id](http://node.id/) === appSelectorNodeId) {
//         if (node.data?.actionConfig?.key === 'condition') {
//           const branchCount = config.branchCount || 2;
//           const branchLabels = Array.from({ length: branchCount }).map((_, i) =>
//             config[`branch${i+1}`] || `Branch ${i+1}`
//           );
//           const targetId = node.data.targetId || 'end-1';

//           // Update branch nodes and edges
//           setEdges(edges => {
//             // Remove old branch-related edges and nodes
//             const updatedEdges = edges.filter(edge =>
//               !edge.source.startsWith(`${node.id}-branch-`) &&
//               !edge.target.startsWith(`${node.id}-branch-`)
//             );

//             // Create new branch nodes and edges
//             const newBranchEdges = [];
//             const newBranchNodes = [];

//             for (let i = 0; i < branchCount; i++) {
//               const branchNodeId = `${node.id}-branch-${i}`;

//               newBranchNodes.push({
//                 id: branchNodeId,
//                 type: 'branch',
//                 position: { x: 0, y: 0 },
//                 data: {
//                   label: branchLabels[i],
//                   parentConditionId: [node.id](http://node.id/)
//                 }
//               });

//               newBranchEdges.push({
//                 id: `e-${node.id}-${branchNodeId}`,
//                 source: [node.id](http://node.id/),
//                 target: branchNodeId,
//                 sourceHandle: `handle-${i}`,
//                 type: 'custom',
//                 markerEnd: { type: MarkerType.ArrowClosed },
//                 data: { label: branchLabels[i] }
//               });

//               newBranchEdges.push({
//                 id: `e-${branchNodeId}-${targetId}`,
//                 source: branchNodeId,
//                 target: targetId,
//                 type: 'custom',
//                 markerEnd: { type: MarkerType.ArrowClosed }
//               });
//             }

//             // Update nodes array
//             setNodes(prevNodes => [
//               ...prevNodes.filter(n => !n.id.startsWith(`${node.id}-branch-`)),
//               ...newBranchNodes
//             ]);

//             return [...updatedEdges, ...newBranchEdges];
//           });

//           return {
//             ...node,
//             data: {
//               ...node.data,
//               branchLabels,
//               branchCount,
//               targetId,
//               isCondition: true,
//               config
//             }
//           };
//         }

//         return {
//           ...node,
//           data: {
//             ...node.data,
//             config
//           }
//         };
//       }
//       return node;
//     }));
//   }

//   setConfigSidebarOpen(false);
//   setConfigItem(null);
//   setConfigType(null);
// }, [nodes, edges, appSelectorNodeId, configType, pendingAction, nextId, layout, updateNodeStepNumbers, handleEditNode]);

//   // Add a new node
//   // Update the addNode function in the WorkflowBuilder component
//   // const addNode = useCallback((sourceNodeId) => {
//   //   const newId = nextId + 1;
//   //   const newNodeId = `action-${newId}`;

//   //   // Find the source node
//   //   const sourceNode = nodes.find(node => [node.id](http://node.id/) === sourceNodeId);
//   //   if (!sourceNode) return;

//   //   // Create new node (position will be updated by layout)
//   //   const newNode = {
//   //     id: newNodeId,
//   //     type: NODE_TYPES.ACTION,
//   //     position: sourceNode.position, // Initial position (will be overridden by layout)
//   //     data: {
//   //       id: newNodeId,
//   //       configured: false,
//   //       type: 'action',
//   //       onEdit: () => handleEditNode(newNodeId)
//   //     }
//   //   };

//   //   // Create updated nodes array
//   //   const updatedNodes = [...nodes, newNode];

//   //   // Generate new edges
//   //   let newEdges = [...edges];
//   //   const edgeToEnd = edges.find(edge =>
//   //     edge.source === sourceNodeId &&
//   //     nodes.find(n => [n.id](http://n.id/) === edge.target && n.type === NODE_TYPES.END)
//   //   );

//   //   if (edgeToEnd) {
//   //     // Remove existing edge to end node
//   //     newEdges = newEdges.filter(edge => [edge.id](http://edge.id/) !== [edgeToEnd.id](http://edgetoend.id/));
//   //     // Add edge from new node to end node
//   //     newEdges.push({
//   //       id: `e-${newNodeId}-${edgeToEnd.target}`,
//   //       source: newNodeId,
//   //       target: edgeToEnd.target,
//   //       type: 'custom',
//   //       markerEnd: { type: MarkerType.ArrowClosed }
//   //     });
//   //   }

//   //   // Add edge from source to new node
//   //   newEdges.push({
//   //     id: `e-${sourceNodeId}-${newNodeId}`,
//   //     source: sourceNodeId,
//   //     target: newNodeId,
//   //     type: 'custom',
//   //     markerEnd: { type: MarkerType.ArrowClosed }
//   //   });

//   //   // Apply layout to new nodes and edges
//   //   const layoutedNodes = getLayoutedElements(updateNodeStepNumbers(updatedNodes), newEdges, layout);

//   //   // Update state with layouted nodes and new edges
//   //   setNodes(layoutedNodes);
//   //   setEdges(newEdges);
//   //   setNextId(newId);

//   //   // Open app selector for the new node
//   //   //   setTimeout(() => openAppSelector('action', newNodeId), 100);
//   // }, [nextId, nodes, edges, layout, updateNodeStepNumbers, handleEditNode, openAppSelector]);

//   // Auto-layout the workflow
//   const handleAutoLayout = useCallback(() => {
//     const layoutedNodes = getLayoutedElements(nodes, edges, layout);
//     setNodes(layoutedNodes);

//     setTimeout(() => {
//       fitView();
//     }, 50);
//   }, [nodes, edges, layout, fitView]);

//   // Toggle layout direction
//   const toggleLayout = useCallback(() => {
//     const newLayout = layout === 'TB' ? 'LR' : 'TB';
//     setLayout(newLayout);

//     const layoutedNodes = getLayoutedElements(nodes, edges, newLayout);
//     setNodes(layoutedNodes);

//     setTimeout(() => {
//       fitView();
//     }, 50);
//   }, [nodes, edges, layout, fitView]);

//   // Run auto-layout on mount
//   useEffect(() => {
//     handleAutoLayout();
//   }, []);

//   // Context value for WorkflowContext
//   const workflowContextValue = {
//     openAppSelector,
//     closeAppSelector,
//     addNode: startAddingNode,
//     setNodes,
//     setEdges
//   };

//   // Map node types to components
//   const nodeTypes = {
//     [NODE_TYPES.TRIGGER]: TriggerNode,
//     [NODE_TYPES.ACTION]: ActionNode,
//     [NODE_TYPES.END]: EndNode,
//     [NODE_TYPES.CONDITION]:ConditionNode,
//     [NODE_TYPES.ADD_BUTTON]:AddButtonNode,
//     [NODE_TYPES.BRANCH]:BranchNode
//   };

//   const edgeTypes = {
//     custom: CustomEdge,
//      routerStart: RouterStartEdge,
//     routerEnd:   RouterEndEdge,

//   };

//   return (
//     <WorkflowContext.Provider value={workflowContextValue}>
//       <div className="h-[70vh] flex flex-col">
//         <div className="border-b bg-white p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <h1 className="text-xl font-medium">Workflow Builder</h1>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 className="flex items-center gap-1 px-3 py-1.5 rounded border text-sm hover:bg-gray-50"
//                 onClick={toggleLayout}
//               >
//                 <Settings className="w-4 h-4" />
//                 {layout === 'TB' ? 'Top to Bottom' : 'Left to Right'}
//               </button>

//               <button
//                 className="flex items-center gap-1 px-3 py-1.5 rounded bg-violet-600 text-white text-sm hover:bg-violet-700"
//                 onClick={handleAutoLayout}
//               >
//                 Auto Layout
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 flex overflow-hidden">
//           <div className="flex-1" ref={reactFlowWrapper}>
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               nodeTypes={nodeTypes}
//               edgeTypes={edgeTypes}
//               zoomOnScroll={false}
//               zoomOnPinch={false}
//               panOnScroll
//               defaultPosition={[500, 50]}
//               panOnDrag
//               preventScrolling
//               onNodesChange={(changes) => {
//                 setNodes((nodes) => {
//                   const updatedNodes = updateNodeStepNumbers(
//                     changes.reduce((acc, change) => {
//                       // Handle position change
//                       if (change.type === 'position' && change.position) {
//                         return acc.map((node) => {
//                           if ([node.id](http://node.id/) === [change.id](http://change.id/)) {
//                             return {
//                               ...node,
//                               position: change.position
//                             };
//                           }
//                           return node;
//                         });
//                       }
//                       return acc;
//                     }, nodes)
//                   );
//                   return updatedNodes;
//                 });
//               }}
//               onEdgesChange={(changes) => {
//                 setEdges((edges) => {
//                   return changes.reduce((acc, change) => {
//                     if (change.type === 'remove') {
//                       return acc.filter((edge) => [edge.id](http://edge.id/) !== [change.id](http://change.id/));
//                     }
//                     return acc;
//                   }, edges);
//                 });
//               }}
//               onNodeClick={onNodeClick}
//               fitView
//               attributionPosition="bottom-right"
//             >
//               <Background />
//               <Controls />
//               <Panel position="top-right">
//                 <div className="bg-white rounded-md shadow p-2">
//                   <button
//                     className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
//                     onClick={handleAutoLayout}
//                     title="Auto Layout"
//                   >
//                     <Settings className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>
//               </Panel>

//             </ReactFlow>
//           </div>

//           {configSidebarOpen && (
//             <ConfigurationSidebar
//               isOpen={configSidebarOpen}
//               item={configItem}
//               type={configType}
//               onClose={() => setConfigSidebarOpen(false)}
//               onSave={handleSaveConfig}
//             />
//           )}
//         </div>

//         <AppSelector
//           isOpen={appSelectorOpen}
//           type={appSelectorType}
//           nodeId={appSelectorNodeId}
//           onClose={closeAppSelector}
//           onSelectTrigger={handleSelectTrigger}
//           onSelectAction={handleSelectAction}
//         />
//       </div>
//     </WorkflowContext.Provider>
//   );
// }

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
getBezierPath,
BaseEdge,
EdgeLabelRenderer,
EdgeTypes,
useNodes,
useEdges,
getSmoothStepPath,
EdgeProps
} from 'reactflow';
import 'reactflow/dist/style.css';

// Improved layout function to better handle the condition branches
export const getLayoutedElements = (nodes: Node[], edges: Edge[]): Node[] => {
const dagreGraph = new dagre.graphlib.Graph()
.setDefaultEdgeLabel(() => ({}));

// Graph configuration
dagreGraph.setGraph({
rankdir: 'TB',
nodesep: 10,
edgesep: 300,
ranksep: 80,
});

// 1) Add each node to the graph with dynamic width/height
nodes.forEach((node) => {
let width = 250;
let height = 200;

switch (node.type) {
  case 'conditionNode':
    // Width depends on number of branches: at least 250px, plus 100px per branch name
    width = node.data.branches
      ? Math.max(250, node.data.branches.length * 100)
      : 250;
    // Height grows a bit per branch to fit labels
    height = 120 + (node.data.branches?.length || 0) * 30;
    break;

  case 'addButtonNode':
    width = 40;
    height = 40;
    break;

  case 'triggerNode':
    width = 250;
    height = 80;
    break;

  case 'actionNode':
    width = 250;
    height = 80;
    break;

  case 'end':
    width = 250;
    height = 40;
    break;

  // Fallback: default sizes
  default:
    width = 200;
    height = 80;
}

dagreGraph.setNode(node.id, { width, height });


});

// 2) Add each edge to the graph (only source/target matter for layout)
edges.forEach((edge) => {
dagreGraph.setEdge(edge.source, edge.target);
});

// 3) Run Dagre layout
dagre.layout(dagreGraph);

// 4) For each node, read back computed x/y and update its position
const layoutedNodes = nodes.map((node) => {
const nodeWithPosition = dagreGraph.node([node.id](http://node.id/));
const isEndNode = [node.id](http://node.id/) === 'end';
const nodeWidth = nodeWithPosition.width;
const nodeHeight = nodeWithPosition.height;

// Default position is centered, so subtract half width/height
let x = nodeWithPosition.x - nodeWidth / 2;
let y = nodeWithPosition.y - nodeHeight / 2;

// Special handling: if “end” node has multiple incoming edges (a merge point),
// center it under the average X of all sources
if (isEndNode) {
  const incoming = edges.filter((e) => e.target === node.id);
  if (incoming.length > 1) {
    const avgX =
      incoming.reduce((sum, e) => {
        const srcNode = nodes.find((n) => n.id === e.source);
        const pos = dagreGraph.node(srcNode!.id).x;
        return sum + pos;
      }, 0) / incoming.length;
    // Center “end” at avgX
    x = avgX - nodeWidth / 2;
  }
}

return {
  ...node,
  position: { x, y },
};


});

return layoutedNodes;
};

interface WorkflowContextType {
apps: Record<string, AppData>;
nodes: Node[];
edges: Edge[];
setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
// Add these properties for edge interaction
setShowAppSelector: React.Dispatch<React.SetStateAction<boolean>>;
setSelectorPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
setSelectorType: React.Dispatch<React.SetStateAction<'trigger' | 'action'>>;
// Use edgeId to know which edge was clicked
setEdgeId: React.Dispatch<React.SetStateAction<string | null>>;
// Keep these for node selection
setCurrentNodeId: React.Dispatch<React.SetStateAction<string | null>>;
setParentNode: React.Dispatch<React.SetStateAction<string | null>>;
setBranchLabel: React.Dispatch<React.SetStateAction<string | null>>;
}

export const WorkflowContext = createContext<WorkflowContextType>({
apps: {},
nodes: [],
edges: [],
setNodes: () => { },
setEdges: () => { },
setShowAppSelector: () => { },
setSelectorPosition: () => { },
setSelectorType: () => { },
setEdgeId: () => { },
setCurrentNodeId: () => { },
setParentNode: () => { },
setBranchLabel: () => { },

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
branches?: any[];
parentNode?: string;
branchLabel?: string;
nodeId?: string;
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

export const FlowLocationRelativeToParent = {
INSIDE_BRANCH: 'inside_branch',
AFTER: 'after',
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
label: 'Label',
type: 'input',
required: false,
placeholder: 'Example: INBOX'
}
},
new_labeled_email: {
key: 'new_labeled_email',
label: 'New Labeled Email',
description: 'Triggers when a label is added to an email',
appId: 'gmail',
config: {
label: 'Label',
type: 'input',
required: true,
placeholder: 'Enter label name'
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

const CustomTriggerEdge = (props: EdgeProps) => {
const {
id,
source,
sourceX,
sourceY,
targetX,
targetY,
markerEnd,
style = {},
data,
} = props;

const nodes = useNodes();
// 1) Extract branchIndex & branchCount from edge.data
const triggerIndex: number = data?.triggerIndex ?? 0;
const triggerCount: number = data?.triggerCount ?? 1;
const isTriggerConfigured: boolean = nodes.find((node) => [node.id](http://node.id/) === source)?.data?.configured ?? false;
const {
setShowAppSelector,
setSelectorPosition,
setSelectorType,
setEdgeId,
} = useContext(WorkflowContext);

// 2) Corner radius and padding so elbow sits above the End node
const cornerRadius = 15;
const smallPadding = 5;
const midY = targetY - (cornerRadius + smallPadding);

// 3) Decide whether we’re in the “odd” or “even” case
const isOdd = triggerCount % 2 !== 0;
let curveRight = false;
let curveLeft = false;
let straightDrop = false;

if (isOdd) {
// If odd, one branch (the exact middle) does a straight drop
const midIndex = Math.floor(triggerCount / 2);
if (triggerIndex < midIndex) {
curveRight = true;
} else if (triggerIndex === midIndex) {
straightDrop = true;
} else {
curveLeft = true;
}
} else {
// If even, no straight‐drop—half go right, half go left
const half = triggerCount / 2;
if (triggerIndex < half) {
curveRight = true;
} else {
curveLeft = true;
}
}

// 4) Build the SVG path:
let path = `M ${sourceX},${sourceY}`;

// 4a) Drop vertically down to just above midY (for any branch)
path +=  `L ${sourceX},${midY - cornerRadius}`;

if (curveRight) {
// ─── “Curve Right” elbow ────────────────────────────────────────────────
path +=  `Q ${sourceX},${midY} ${sourceX + cornerRadius},${midY}`;
path +=  `L ${targetX - cornerRadius},${midY}`;
path +=  `Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
} else if (curveLeft) {
// ─── “Curve Left” elbow ─────────────────────────────────────────────────
path +=  `Q ${sourceX},${midY} ${sourceX - cornerRadius},${midY}`;
path +=  `L ${targetX + cornerRadius},${midY}`;
path +=  `Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
} else if (straightDrop) {
// ─── “Straight Drop” (no horizontal) ───────────────────────────────────
// Drop from (sourceX, midY - r) → (sourceX, midY + r)
path +=  `L ${sourceX},${midY + cornerRadius}`;
// If sourceX ≠ targetX, step horizontally at midY + r:
if (sourceX !== targetX) {
path +=  `L ${targetX},${midY + cornerRadius}`;
}
}

// 4b) Final vertical drop into End node
path +=  `L ${targetX},${targetY}`;

// 5) “+” button sits centered on the horizontal line (or above the vertical drop)
const arc = 12;                          // radius of the circular button
const offsetAbove = arc + 4;             // 4px above the arrow tip
const buttonX = targetX;
const buttonY = targetY - offsetAbove;   // y = arrow tip Y minus offset

// Place the other “+” slightly above the arrow tip:

const onAddNode = (e: React.MouseEvent) => {
e.stopPropagation();
const rect = (e.target as HTMLElement).getBoundingClientRect();
setSelectorPosition({ x: rect.left, y: rect.bottom });
setEdgeId(id!);
setSelectorType('action');
setShowAppSelector(true);
};

return (
<>
{/* 5a) Draw the curved or straight path */}
<BaseEdge
path={path}
markerEnd={markerEnd}
style={{
...style,
strokeWidth: 1.5,
stroke: '#d1d5db',
}}
/>

  {/* 5b) Render “+” if isNextStepEmpty = false */}
  {isTriggerConfigured && (
    <foreignObject
      x={sourceX - arc}
      y={sourceY + (arc + 10)}
      width={arc * 2}
      height={arc * 2}
      className="overflow-visible"
    >
      <div
        style={{
          width: arc * 2,
          height: arc * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          borderRadius: arc,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={onAddNode}
          className="w-5 h-5 z-40 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100"
        >
          <Plus size={12} />
        </button>
      </div>
    </foreignObject>
  )}

  <foreignObject
    x={buttonX - arc}
    y={buttonY - arc + 30}
    width={arc * 2}
    height={arc * 2}
    className="overflow-visible"
    style={{ pointerEvents: 'all' }}
  >
    <div
      style={{
        width: arc * 2,
        height: arc * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderRadius: arc,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
      onClick={onAddNode}
    >
      <button className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100">
        <Plus size={12} />
      </button>
    </div>
  </foreignObject>
</>


);
}

export function ConditionalStartEdge(props: any) {
const {
id,
source,
target,
sourceX,
sourceY,
targetX,
targetY,
markerEnd,
style = {},
data,
} = props;

const { setShowAppSelector, setSelectorPosition, setSelectorType, setEdgeId } =
useContext(WorkflowContext);

// Compute the same Bezier path as before
const [edgePath, labelX, labelY] = getBezierPath({
sourceX,
sourceY,
targetX,
targetY,
sourcePosition: Position.Bottom,
targetPosition: Position.Top,
});

// Branch name now lives in data.branchLabel
const branchLabel = data?.branchName ?? '';

// Click handler: forward to your existing “+” logic
const onAddStep = (_edgeId: string, _source: string, _target: string) => {
setEdgeId(_edgeId);
// We compute the position based on the pill’s bounding box
// but since RouterStartEdge does it inside the <div>, we can replicate:
const pillElement = document.getElementById(_edgeId + '-pill'); // see below how we assign id
if (pillElement) {
const rect = pillElement.getBoundingClientRect();
setSelectorPosition({ x: rect.left, y: rect.bottom });
} else {
// fallback to centering at label coords
setSelectorPosition({ x: labelX, y: labelY });
}
setSelectorType('action');
setShowAppSelector(true);
};

return (
<>
{/* Draw the curved edge path, exactly as in RouterStartEdge */}
<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

  {/* Render the branch label pill + “+” button via a foreignObject */}
  {branchLabel && (
    <foreignObject
      width={100}
      height={40}

      x={labelX - 60}
      y={labelY - 20}
      className="edge-label-foreign-object"
      requiredExtensions="<http://www.w3.org/1999/xhtml>"
    >
      <div
        id={id + '-pill'}
        style={{
          background: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          border: '1px solid #ccc',
          textAlign: 'center',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onClick={() => onAddStep(id, source, target)}
      >
        {/* Branch label text */}
        <span>{branchLabel}</span>

        {/* “+” icon (small) */}
        <button
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'white',
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={12} />
        </button>
      </div>
    </foreignObject>
  )}
</>


);
}

// Conditional End Edge - this handles merging branches back to a targe

export const LINE_WIDTH = 1.5;

export function ConditionalEndEdge(props: any) {
const {
id,
sourceX,
sourceY,
targetX,
targetY,
markerEnd,
style = {},
data,
} = props;

// 1) Extract branchIndex & branchCount from edge.data
const branchIndex: number = data?.branchIndex ?? 0;
const branchCount: number = data?.branchCount ?? 1;

const {
setShowAppSelector,
setSelectorPosition,
setSelectorType,
setEdgeId,
} = useContext(WorkflowContext);

// 2) Corner radius and padding so elbow sits above the End node
const cornerRadius = 15;
const smallPadding = 5;
const midY = targetY - (cornerRadius + smallPadding);

// 3) Decide whether we’re in the “odd” or “even” case
const isOdd = branchCount % 2 !== 0;
let curveRight = false;
let curveLeft = false;
let straightDrop = false;

if (isOdd) {
// If odd, one branch (the exact middle) does a straight drop
const midIndex = Math.floor(branchCount / 2);
if (branchIndex < midIndex) {
curveRight = true;
} else if (branchIndex === midIndex) {
straightDrop = true;
} else {
curveLeft = true;
}
} else {
// If even, no straight‐drop—half go right, half go left
const half = branchCount / 2;
if (branchIndex < half) {
curveRight = true;
} else {
curveLeft = true;
}
}

// 4) Build the SVG path:
let path = `M ${sourceX},${sourceY}`;

// 4a) Drop vertically down to just above midY (for any branch)
path +=  `L ${sourceX},${midY - cornerRadius}`;

if (curveRight) {
// ─── “Curve Right” elbow ────────────────────────────────────────────────
path +=  `Q ${sourceX},${midY} ${sourceX + cornerRadius},${midY}`;
path +=  `L ${targetX - cornerRadius},${midY}`;
path +=  `Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
} else if (curveLeft) {
// ─── “Curve Left” elbow ─────────────────────────────────────────────────
path +=  `Q ${sourceX},${midY} ${sourceX - cornerRadius},${midY}`;
path +=  `L ${targetX + cornerRadius},${midY}`;
path +=  `Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
} else if (straightDrop) {
// ─── “Straight Drop” (no horizontal) ───────────────────────────────────
// Drop from (sourceX, midY - r) → (sourceX, midY + r)
path +=  `L ${sourceX},${midY + cornerRadius}`;
// If sourceX ≠ targetX, step horizontally at midY + r:
if (sourceX !== targetX) {
path +=  `L ${targetX},${midY + cornerRadius}`;
}
}

// 4b) Final vertical drop into End node
path +=  `L ${targetX},${targetY}`;

// 5) “+” button sits centered on the horizontal line (or above the vertical drop)
const arc = 12;                          // radius of the circular button
const offsetAbove = arc + 4;             // 4px above the arrow tip
const buttonX = targetX;
const buttonY = targetY - offsetAbove;   // y = arrow tip Y minus offset

// Place the other “+” slightly above the arrow tip:

const onAddNode = (e: React.MouseEvent) => {
e.stopPropagation();
const rect = (e.target as HTMLElement).getBoundingClientRect();
setSelectorPosition({ x: rect.left, y: rect.bottom });
setEdgeId(id!);
setSelectorType('action');
setShowAppSelector(true);
};

return (
<>
{/* 5a) Draw the curved or straight path */}
<BaseEdge
path={path}
markerEnd={markerEnd}
style={{
...style,
strokeWidth: 1.5,
stroke: '#d1d5db',
}}
/>

  {/* 5b) Render “+” if isNextStepEmpty = false */}
  {!data?.isNextStepEmpty && (
    <foreignObject
      x={sourceX - arc}
      y={sourceY + (arc + 10)}
      width={arc * 2}
      height={arc * 2}
      className="overflow-visible"
    >
      <div
        style={{
          width: arc * 2,
          height: arc * 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          borderRadius: arc,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={onAddNode}
          className="w-5 h-5 z-40 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100"
        >
          <Plus size={12} />
        </button>
      </div>
    </foreignObject>
  )}

  <foreignObject
    x={buttonX - arc}
    y={buttonY - arc + 30}
    width={arc * 2}
    height={arc * 2}
    className="overflow-visible"
    style={{ pointerEvents: 'all' }}
  >
    <div
      style={{
        width: arc * 2,
        height: arc * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderRadius: arc,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
      onClick={onAddNode}
    >
      <button className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100">
        <Plus size={12} />
      </button>
    </div>
  </foreignObject>
</>


);
}

// Custom Edge Component with delete button
function CustomEdge(props: any) {
const {
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
markerEnd,
data, // <-- this is where data.branchLabel will live
} = props;

const { setShowAppSelector, setSelectorPosition, setSelectorType, setEdgeId } = useContext(WorkflowContext);

// getBezierPath already returns [path,direction] or [path,labelX,labelY]
const [edgePath, labelX, labelY] = getBezierPath({
sourceX,
sourceY,
sourcePosition: Position.Bottom,
targetX,
targetY,
targetPosition: Position.Top,
});

// Branch name (if any) is in data.branchLabel
const branchLabel = data?.branchLabel ?? '';

// When “+” is clicked, open your app‐selector (exact same logic as before)
const onAddNode = (e: React.MouseEvent) => {
e.stopPropagation();
const rect = (e.target as HTMLElement).getBoundingClientRect();
setSelectorPosition({ x: rect.left, y: rect.bottom });
setEdgeId(id);
setSelectorType('action');
setShowAppSelector(true);
};

return (
<>
{/* 1) Draw the curved path itself */}
<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

  {/* 2) Render both the branchLabel and the “+” button */}
  <EdgeLabelRenderer>
    <div
      style={{
        position: 'absolute',
        transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
        pointerEvents: 'all',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
      className="no-drag no-pan"
    >
      {/* Branch name box */}
      {branchLabel && (
        <div
          style={{
            background: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            border: '1px solid #ddd',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          {branchLabel}
        </div>
      )}

      {/* The “+” button */}
      <button
        className="w-5 h-5 z-40 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100"
        onClick={onAddNode}
      >
        <Plus size={12} />
      </button>
    </div>
  </EdgeLabelRenderer>
</>


);
}
const TriggerNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
const { app, configured } = data;

const selectedApp = SAMPLE_APPS[app];

if (!configured) {
return (
<div className={`node trigger-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
<div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
<div className="bg-gray-100 py-2 px-3 flex items-center justify-between">
<div className="flex items-center space-x-2">
<div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
⚡
</div>
<span className="font-medium text-gray-700 text-sm">Unknown</span>
</div>
<span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Trigger</span>
</div>

      <div
        className="p-3 cursor-pointer hover:bg-gray-50"

      >
        <h3 className="font-medium text-sm mb-1">{data?.label}</h3>
        <p className="text-xs text-gray-500">{data?.description}</p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}

        className="handle source-handle"
        style={{
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 12,
          height: 12,
          background: '#6366f1',
          borderRadius: '50%',
          border: '2px solid white'
        }}
      />
    </div>
  </div>
);


}
return (

<div className={`node rounded-xl trigger-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
  <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
    <div className={` py-2 px-3 flex items-center justify-between`}>
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
          ⚡
        </div>
        <span className="font-medium text-blue-700 text-sm">{selectedApp?.name}</span>
      </div>
      <span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Trigger</span>
    </div>
    <div className="p-3 flex gap-x-4 gap-4">
      <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${selectedApp?.color || "bg-gray-100"}`}>
        {selectedApp?.icon}
      </div>
      <div className='flex flex-col items-start'>

      <h3 className="font-medium text-sm mb-1">{data?.label}</h3>
      <p className="text-xs text-gray-500 mb-2">{data?.description}</p>
      </div>

    </div>

    <Handle
      type="source"
      position={Position.Bottom}
      className="handle source-handle"
      style={{
        bottom: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 12,
        height: 12,
        background: '#6366f1',
        borderRadius: '50%',
        border: '2px solid white'
      }}
    />
  </div>
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
<span className="font-medium">{branch.branchName}</span>
</div>
))}
</div>
{/* We don't need explicit handles for the branches as they'll be created dynamically */}
<Handle
type="source"
position={Position.Bottom}
id="source"
style={{ background: '#555', visibility: 'hidden' }}
/>
</div>
);
};

const AddButtonNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
return (
<div
className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
>
<Handle
type="target"
position={Position.Top}
style={{ background: '#555' }}
/>
<div className="text-2xl font-bold text-gray-700">+</div>
<Handle
type="source"
position={Position.Bottom}
id="source"
style={{ background: '#555', visibility: 'hidden' }}
/>
</div>
);
};

interface AppSelectorProps {
position: { x: number; y: number };
onSelect: (appId: string) => void;
onClose: () => void;
type: 'trigger' | 'action';
}

const AppSelector: React.FC<AppSelectorProps> = ({ position, onSelect, onClose, type }) => {
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
<button
onClick={onClose}
className="text-gray-500 hover:text-gray-700"
>
✕
</button>
</div>
<div className="p-1">
{filteredApps.map(app => (
<div
key={[app.id](http://app.id/)}
className={`p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center ${app.color}`}
onClick={() => onSelect([app.id](http://app.id/))}
>
<span className="mr-2 text-xl">{app.icon}</span>
<div>
<div className="font-medium">{[app.name](http://app.name/)}</div>
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

const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({ data, onSave, onCancel }) => {
const { apps } = useContext(WorkflowContext);
const [selectedItem, setSelectedItem] = useState<TriggerConfig | ActionConfig | null>(null);
const [configValues, setConfigValues] = useState<Record<string, any>>({});
const [branches, setBranches] = useState<string[]>(['Branch 1', 'Otherwise']);

const app = apps[data.appId];

useEffect(() => {
// Initialize form values
setConfigValues({});

// Handle pre-selected item (for condition nodes on edges)
if (data.selectedItem) {
  setSelectedItem(data.selectedItem);

  // If it's a condition node, initialize branches
  if (data.selectedItem.key === 'condition') {
    setBranches(['Branch1', 'Otherwise']);
  }
} else if (data.type === 'trigger') {
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

// Also make sure handleSave includes this for conditions:

const handleInputChange = (key: string, value: any) => {
setConfigValues({
...configValues,
[key]: value
});
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
const configData = {
...data,
selectedItem,
config: configValues
};

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
<button
onClick={onCancel}
className="text-gray-500 hover:text-gray-700"
>
✕
</button>
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
          <option key={trigger.key} value={trigger.key}>
            {trigger.label}
          </option>
        ))}
        {data.type === 'action' && Object.values(app.actions).map(action => (
          <option key={action.key} value={action.key}>
            {action.label}
          </option>
        ))}
      </select>
    </div>

    {selectedItem && (
      <div>
        <div className="text-sm text-gray-600 mb-4">
          {selectedItem.description}
        </div>

        {/* Configuration Fields */}
        {selectedItem.key === 'condition' ? (
          <div>
            <div className="mb-2 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Branches</label>
              <button
                onClick={addBranch}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Branch
              </button>
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
          selectedItem.config && typeof selectedItem.config === 'object' &&
          Object.entries(selectedItem.config).map(([key, field]: [string, any]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
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
        className={`px-4 py-2 rounded-md ${isValidConfig()
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

const EndNode = ({ data }) => {
console.log('end', { data })
const nodes = useNodes()
const edges = useEdges()

console.log('end nodes', edges?.filter((d) => d.target === [data.id](http://data.id/)))
return (

<div style={{ minWidth: '180px', maxWidth: '250px' }} className="px-6 py-2 mt-4 rounded-full  flex justify-center items-center  font-medium ">
  End
  <Handle
    type="target"
    position={Position.Top}
    style={{
      width: '10px',
      height: '10px',
      top: '-5px',
      borderRadius: '50%',
      background: '#e2e8f0',
      zIndex: 1
    }}
    className='invisible'
  />
  <Handle
    type="source"
    position={Position.Top}
    style={{
      width: '10px',
      height: '10px',
      top: '-5px',
      borderRadius: '50%',
      background: '#e2e8f0',
      zIndex: 1
    }}
    className='invisible'
  />
</div>


);
};

const AddTriggerNode = (props: any) => {
console.log('AddTriggerNode', props)
const { setShowAppSelector, setSelectorPosition, setSelectorType } = useContext(WorkflowContext);

const edge = useEdges()

const currentEdge = edge.find((d: any) => d.source === [props.id](http://props.id/))
console.log('currentEdge', currentEdge)

const handleAddTriggerButton = (e) => {
e.stopPropagation();
const rect = (e.target as HTMLElement).getBoundingClientRect();
setSelectorPosition({ x: rect.left, y: rect.bottom });

setSelectorType('trigger');
setShowAppSelector(true);


}

return (
<div
className="border-2 border-blue-500 bg-blue-100 p-3 rounded-lg border-dashed"
style={{ minWidth: '180px', maxWidth: '250px' }}
>

  <div className="flex items-center gap-x-3 ">
    <Button onClick={handleAddTriggerButton} variant="outline" >
      <Plus size={16} />
    </Button>

    <Label>Add Trigger Node</Label>
  </div>
  <Handle
    type="source"
    position={Position.Bottom}
    id="source"
    style={{ background: '#555' }}
  />
</div>


);
}

const nodeTypes: NodeTypes = {
triggerNode: TriggerNode,
actionNode: ActionNode,
conditionNode: ConditionNode,
addButtonNode: AddButtonNode,
addTriggerNode: AddTriggerNode,
end: EndNode,
};

const edgeTypes: EdgeTypes = {
custom: CustomEdge,
conditionalStart: ConditionalStartEdge,
conditionalEnd: ConditionalEndEdge,
triggerEdge: CustomTriggerEdge
};

const WorkflowBuilder = () => {
const prevStructure = useRef<string>('');
// Initial empty trigger node
const initialNodes: Node[] = [
{
id: 'trigger-1',
type: 'triggerNode',
position: { x: 0, y: 0 },
data: {
label: 'Empty Trigger',
description: 'Click to configure this trigger',
configured: false,
nodeId: 'trigger-1',

  }
},
{

  id: 'end',
  type: 'end',
  position: { x: 0, y: 0 },
  data: {
    label: 'End',
    parentNode: 'trigger-1'
  }

}


];

const initialEdges: Edge[] = [
{

  id: 'end-trigger-1',
  source: 'trigger-1',
  type: 'custom',
  target: 'end',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  data: {
    flowLocationRelativeToParent: FlowLocationRelativeToParent.AFTER,
    triggerIndex: 0,
    triggerCount: 1,
  }

}


];

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// State for app selection dropdown
const [showAppSelector, setShowAppSelector] = useState(false);
const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
const [selectorType, setSelectorType] = useState<'trigger' | 'action'>('trigger');
const [parentNode, setParentNode] = useState<string | null>(null);
const [branchLabel, setBranchLabel] = useState<string | null>(null);
const [edgeId, setEdgeId] = useState<string | null>(null);

// State for configuration sidebar
const [showConfigSidebar, setShowConfigSidebar] = useState(false);
const [configData, setConfigData] = useState<any>(null);

// Handle connection between nodes
const onConnect = useCallback((params: Connection) => {
// Determine if we're connecting from a condition node
const sourceNode = nodes.find(n => [n.id](http://n.id/) === params.source);
const isConditionalSource = sourceNode?.type === 'conditionNode';

// Determine if we're connecting to an end node
const isEndTarget = params.target === 'end';

let edgeType = 'custom'; // default edge type

if (isConditionalSource) {
  edgeType = isEndTarget ? 'conditionalEnd' : 'conditionalStart';
}

setEdges((eds) => addEdge({
  ...params,
  type: edgeType,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  data: isConditionalSource ? { branchLabel: 'Branch' } : {}
}, eds));


}, [setEdges, nodes]);

// Handle node click to show configuration or app selector
const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
if (node.type === 'triggerNode' && !node.data.configured) {
const rect = (event.target as Element).getBoundingClientRect();
setSelectorPosition({
x: rect.left,
y: rect.bottom
});
setCurrentNodeId([node.id](http://node.id/));
setSelectorType('trigger');
setShowAppSelector(true);
} else if (node.type === 'addButtonNode') {
const rect = (event.target as Element).getBoundingClientRect();
setSelectorPosition({
x: rect.left,
y: rect.bottom
});
setCurrentNodeId([node.id](http://node.id/));
setParentNode(node.data.parentNode);
setBranchLabel(node.data.branchLabel);
setSelectorType('action');
setShowAppSelector(true);
}
}, []);

// Handle app selection
const handleAppSelect = (app: string) => {
setShowAppSelector(false);

if (edgeId) {
  // User clicked on an edge plus button
  const clickedEdge = edges.find(e => e.id === edgeId);

  if (clickedEdge) {
    // Get source and target nodes
    const sourceNode = nodes.find(n => n.id === clickedEdge.source);
    const targetNode = nodes.find(n => n.id === clickedEdge.target);

    if (sourceNode) {
      // Store the branch label if exists
      const branchLabel = clickedEdge.data?.branchLabel || null;

      // Check if the selected app is the condition app
      const isConditionApp = app === 'condition';

      // Set configuration data
      setConfigData({
        appId: app,
        type: 'action',
        edgeId: edgeId, // This indicates we're inserting a node on an edge
        sourceNodeId: clickedEdge.source,
        targetNodeId: clickedEdge.target,
        branchLabel: branchLabel,
        // Pre-select the condition action if applicable
        selectedItem: isConditionApp ? SAMPLE_APPS[app].actions.condition : undefined
      });

      setShowConfigSidebar(true);
    }
  }

  // Reset edge ID
  setEdgeId(null);
} else {
  // This is the original node selection case
  setConfigData({
    nodeId: currentNodeId,
    appId: app,
    type: selectorType,
    parentNode: parentNode,
    branchLabel: branchLabel
  });
  setShowConfigSidebar(true);
}


};
// Handle configuration save

// /**
//  * Handles saving configuration for various node types in the workflow editor
//  * Manages edges, nodes, and their connections based on user selections
//  */
// const handleConfigSave = (config: any) => {
//   setShowConfigSidebar(false);

//   const {
//     nodeId,
//     appId,
//     selectedItem,
//     type,
//     parentNode,
//     branchName,
//     edgeId,
//     sourceNodeId,
//     targetNodeId,
//   } = config;

//   const app = SAMPLE_APPS[appId];
//   const timestamp = Date.now();

//   // Helper functions for consistent node/edge creation
//   const createActionNode = (id: string, appId: string, selectedItem: any, configData: any) => ({
//     id,
//     type: 'actionNode',
//     position: { x: 0, y: 0 },
//     data: {
//       label: `${SAMPLE_APPS[appId].name}: ${selectedItem.label}`,
//       app: appId,
//       action: selectedItem.key,
//       configured: true,
//       config: configData || selectedItem.config,
//     },
//   });

//   const createAddTriggerNode=(addTriggerNodeId:string, data:any)=> ({
//     id: addTriggerNodeId,
//     type: 'addTriggerNode',
//     position: { x: 0, y: 0 },
//     data:data ,
//   });

//   const createAddButtonNode = (id: string, parentNodeId: string, branchData = {}) => ({
//     id,
//     type: 'addButtonNode',
//     position: { x: 0, y: 0 },
//     data: {
//       label: '+',
//       parentNode: parentNodeId,
//       ...branchData,
//     },
//   });

//   const createConditionNode = (id: string, branches: any[], configData: any) => ({
//     id,
//     type: 'conditionNode',
//     position: { x: 0, y: 0 },
//     data: {
//       label: 'Condition',
//       branches,
//       configured: true,
//       config: configData,
//     },
//   });

//   const createEdge = (sourceId: string, targetId: string, type = 'custom', edgeData = {}) => ({
//     id: `e-${sourceId}-${targetId}`,
//     source: sourceId,
//     target: targetId,
//     type,
//     markerEnd: { type: MarkerType.ArrowClosed },
//     data: edgeData,
//   });

//   const processBranches = (branchNames: string[]) => {
//     return branchNames.map((b: string, idx: number) => ({
//       branchName: b,
//       branchId: `branch-${timestamp}-${idx}`,
//       branchIndex: idx,
//       branchCount: branchNames.length,
//     }));
//   };

//   // CASE 1: User clicked "+" on an existing edge
//   if (edgeId) {
//     // Get all the edge information before removing it
//     const currentEdge = edges.find((e) => [e.id](http://e.id/) === edgeId);
//     if (!currentEdge) return;

//     const edgeIndex = edges.findIndex((e) => [e.id](http://e.id/) === edgeId);
//     const isConditionalEdge = currentEdge?.data?.flowLocationRelativeToParent === FlowLocationRelativeToParent.INSIDE_BRANCH;
//     const lastNodeCondition = currentEdge?.type === 'conditionalEnd';
//     const branchId = currentEdge?.data?.branchId;
//     const branchIndex = currentEdge?.data?.branchIndex;
//     const branchCount = currentEdge?.data?.branchCount;

//     // Remove the existing edge while preserving order for later insertion
//     const updatedEdges = [...edges];
//     updatedEdges.splice(edgeIndex, 1);

//     // CASE 1A: User selected a condition on an edge
//     if (selectedItem?.key === 'condition') {
//       const newNodeId = `condition-${timestamp}`;
//       const branchesWithIds = processBranches(config.branches || ['Branch 1', 'Otherwise']);

//       // Create the Condition node
//       setNodes((nds) => [
//         ...nds,
//         createConditionNode(newNodeId, branchesWithIds, config),
//       ]);

//       // Connect source → condition
//       const newEdge = createEdge(sourceNodeId, newNodeId, 'custom', {
//         branchName,
//         flowLocationRelativeToParent: isConditionalEdge
//           ? FlowLocationRelativeToParent.INSIDE_BRANCH
//           : undefined,
//         ...(isConditionalEdge ? { branchId, branchIndex, branchCount } : {}),
//       });

//       // Insert the new edge at the same position as the removed edge
//       updatedEdges.splice(edgeIndex, 0, newEdge);
//       setEdges(updatedEdges);

//       // After a short delay, add each branch's "AddButtonNode" and connections
//       setTimeout(() => {
//         branchesWithIds.forEach((branchObj, index) => {
//           const { branchName, branchId } = branchObj;
//           const addButtonId = `add-button-${timestamp}-${index}`;

//           // Add an AddButtonNode for each branch
//           setNodes((nds) => [
//             ...nds,
//             createAddButtonNode(addButtonId, newNodeId, { branchName, branchId }),
//           ]);

//           // Connect condition → addButton (conditionalStart)
//           setEdges((eds) => [
//             ...eds,
//             createEdge(newNodeId, addButtonId, 'conditionalStart', {
//               branchName,
//               branchId,
//               flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH
//             }),
//           ]);

//           // Connect each addButton → target (if targetNodeId exists)
//           if (targetNodeId) {
//             setEdges((eds) => [
//               ...eds,
//               createEdge(addButtonId, targetNodeId, 'conditionalEnd', {
//                 isNextStepEmpty: true,
//                 flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
//                 branchId,
//                 branchIndex: index,
//                 branchCount: branchesWithIds.length,
//               }),
//             ]);
//           }
//         });
//       }, 10);
//     }
//     // CASE 1B: User selected a regular action on an edge
//  else {
//   const newNodeId = `action-${timestamp}`;

//   // 1. Add the new action node to `nodes`.
//   setNodes((nds) => [
//     ...nds,
//     createActionNode(newNodeId, appId, selectedItem, config.config),
//   ]);

//   // 2. Build local copy of edges, removing the old edge at edgeIndex.
//   const updatedEdges = [...edges];
//   updatedEdges.splice(edgeIndex, 1);

//   // 3. Create the new “source → action” edge
//   const firstEdge = createEdge(
//     sourceNodeId,
//     newNodeId,
//     'custom',
//     {
//       branchLabel: branchName,
//       flowLocationRelativeToParent: isConditionalEdge
//         ? FlowLocationRelativeToParent.INSIDE_BRANCH
//         : FlowLocationRelativeToParent.AFTER,
//       ...(isConditionalEdge
//         ? { branchId, branchIndex, branchCount }
//         : {}),
//     }
//   );

//   // 4. If there was a targetNodeId, build the “action → target” edge
//   let secondEdge = null;
//   if (targetNodeId) {
//     secondEdge = createEdge(
//       newNodeId,
//       targetNodeId,
//       lastNodeCondition ? 'conditionalEnd' : 'custom',
//       {
//         ...(isConditionalEdge
//           ? {
//               branchId,
//               branchIndex,
//               branchCount,
//               flowLocationRelativeToParent:
//                 FlowLocationRelativeToParent.INSIDE_BRANCH,
//             }
//           : {}),
//       }
//     );
//   }

//   // 5a. Insert firstEdge exactly at edgeIndex
//   updatedEdges.splice(edgeIndex, 0, firstEdge);

//   // 5b. If secondEdge exists, insert it immediately after firstEdge
//   if (secondEdge) {
//     updatedEdges.splice(edgeIndex + 1, 0, secondEdge);
//   }

//   // 6. Single state update for edges (with both new edges in place)
//   setEdges(updatedEdges);

//   // 7. If no existing target, schedule an AddButton under the action
//   if (!targetNodeId) {
//     const addButtonId = `add-button-${timestamp}`;
//     setTimeout(() => {
//       setNodes((nds) => [
//         ...nds,
//         createAddButtonNode(addButtonId, newNodeId),
//       ]);

//       setEdges((eds) => [
//         ...eds,
//         createEdge(newNodeId, addButtonId, 'smoothstep'),
//       ]);
//     }, 10);
//   }
// }
//     return;
//   }

//   // CASE 2: User clicked directly on a Trigger node
//  if (type === 'trigger') {
//   // 1. Update the existing trigger node with its new configuration:
//   setNodes((nds) =>
//     nds.map((node) => {
//       if ([node.id](http://node.id/) === nodeId) {
//         return {
//           ...node,
//           data: {
//             ...node.data,
//             label: `${app.name}: ${selectedItem.label}`,
//             app: appId,
//             trigger: selectedItem.key,
//             configured: true,
//             config: config.config || selectedItem.config,

//           },
//         };
//       }
//       return node;
//     })
//   );

//   // 2. Create a new AddTriggerNode (so the user can “add another trigger” here).
//   //    We’ll give it a unique ID based on timestamp (or your preferred method).
//   const addTriggerNodeId = `add-trigger-${Date.now()}`;

//   // 3. Insert that new node into the node list immediately:
//   setNodes((nds) => [
//     ...nds,
//     createAddTriggerNode(addTriggerNodeId, {
//       label: '+',
//       parentNode: nodeId,

//     }),
//   ]);

//   // 4. Now rebuild edges in one go so that:
//   //    • Any existing edges that used to go out of `nodeId` get removed.
//   //    • We first attach: nodeId → addTriggerNodeId
//   //    • Then we re‐attach: addTriggerNodeId → originalTarget
//  setEdges((currentEdges) => {
//   // 1. First, update all edges where source === nodeId to have type = 'conditionalEnd'.
//   //    We'll also preserve their existing `id`, `target`, and `data` fields.
//   const updatedOriginalEdges = currentEdges.map((edge) => {
//     if (edge.source === nodeId) {
//       return {
//         ...edge,
//         type: 'triggerEdge',
//         data:{
//           ...edge.data,
//            triggerCount: edge.data.triggerCount+1,
//         }
//       };
//     }
//     return edge;
//   });

//   // 2. Next, collect all originally-outgoing edges from nodeId so we know their targets.
//   const outgoingEdges = updatedOriginalEdges.filter((edge) => edge.source === nodeId);

//   // 3. For each of those targets, create a new "parallel" edge from addTriggerNodeId → same target,
//   //    also with type = 'triggerEdge',' and carrying over any metadata from the original edge.
//   const parallelEdges = outgoingEdges.map((oldEdge) =>
//     createEdge(
//       addTriggerNodeId,
//       oldEdge.target,
//       'triggerEdge',
//       {
//         ...oldEdge.data,
//         flowLocationRelativeToParent: FlowLocationRelativeToParent.AFTER,
//         triggerIndex: oldEdge.data.triggerIndex+1,
//         triggerCount: oldEdge.data.triggerCount,
//       }
//     )
//   );

//   // 4. Finally, return the combined array:
//   //    • All edges where source === nodeId have been switched to 'conditionalEnd'.
//   //    • In addition, we append the new parallel edges from addTriggerNodeId.
//   return [...updatedOriginalEdges, ...parallelEdges];
// });
// }

//   // CASE 3: User clicked on an AddButton under an existing Action
//   if (type === 'action') {
//     const parentNodeObj = nodes.find((n) => [n.id](http://n.id/) === parentNode);
//     if (!parentNodeObj) return;

//     // Find connections to/from the AddButton
//     const incomingEdges = edges.filter((e) => e.target === nodeId);
//     const outgoingEdges = edges.filter((e) => e.source === nodeId);
//     const conditionEdge = incomingEdges.find((e) => e.type === 'conditionalStart');
//     const conditionNodeId = conditionEdge?.source;
//     const branchLabelFromEdge = conditionEdge?.data?.branchName || branchName;
//     const branchId = conditionEdge?.data?.branchId;
//     const branchIndex = conditionEdge?.data?.branchIndex;
//     const branchCount = conditionEdge?.data?.branchCount;
//     const targetNodeIdFromEdge = outgoingEdges.length > 0 ? outgoingEdges[0].target : null;

//     // CASE 3A: User selected a condition for an AddButton
//     if (selectedItem?.key === 'condition') {
//       const newNodeId = `condition-${timestamp}`;

//       // Find any edges connected to the AddButton and their positions
//       const allCurrentEdges = [...edges];
//       const edgesWithPositions = allCurrentEdges.map((edge, index) => ({
//         edge,
//         index
//       }));

//       // Get the edge connecting to the AddButton
//       const incomingEdgeInfo = edgesWithPositions.find(item => item.edge.target === nodeId);
//       const outgoingEdgeInfo = edgesWithPositions.find(item => item.edge.source === nodeId);

//       // Remove the AddButton node and connected edges
//       setNodes((nds) => nds.filter((n) => [n.id](http://n.id/) !== nodeId));

//       // Create the new Condition node
//       setNodes((nds) => [
//         ...nds,
//         createConditionNode(newNodeId, branchesWithIds, config),
//       ]);

//       // Create updated edges array and replace the old edge at the same position
//       const updatedEdges = [...allCurrentEdges];

//        const branchesWithIds = processBranches(config.branches || ['Branch 1', 'Otherwise']);
//       // Remove edges connected to the AddButton
//       if (incomingEdgeInfo) {
//         updatedEdges.splice(incomingEdgeInfo.index, 1);
//       }

//       if (outgoingEdgeInfo && outgoingEdgeInfo.index > incomingEdgeInfo.index) {
//         updatedEdges.splice(outgoingEdgeInfo.index - 1, 1); // Adjust index if it comes after the already removed edge
//       } else if (outgoingEdgeInfo) {
//         updatedEdges.splice(outgoingEdgeInfo.index, 1);
//       }

//       // Create new edge and insert at the same position as the old incoming edge
//       const newEdge = createEdge(parentNode, newNodeId, conditionNodeId ? 'conditionalEnd' : 'smoothstep', {
//         branchLabel: branchLabelFromEdge,
//         flowLocationRelativeToParent: conditionNodeId
//           ? FlowLocationRelativeToParent.INSIDE_BRANCH
//           : FlowLocationRelativeToParent.AFTER,
//         ...(conditionNodeId ? { branchId, branchIndex, branchCount } : {}),
//       });

//       if (incomingEdgeInfo) {
//         updatedEdges.splice(incomingEdgeInfo.index, 0, newEdge);
//       } else {
//         updatedEdges.push(newEdge);
//       }

//       setEdges(updatedEdges);

//       // Add AddButtons for each branch and connect to target (if any)
//       setTimeout(() => {
//         branchesWithIds.forEach((branchObj, index) => {
//           const { branchName, branchId } = branchObj;
//           const addButtonId = `add-button-${timestamp}-${index}`;

//           // Add AddButtonNode
//           setNodes((nds) => [
//             ...nds,
//             createAddButtonNode(addButtonId, newNodeId, { branchName, branchId }),
//           ]);

//           // Connect condition → addButton
//           setEdges((eds) => [
//             ...eds,
//             createEdge(newNodeId, addButtonId, 'conditionalStart', {
//               branchName,
//               branchId
//             }),
//           ]);

//           // Connect to prior target if it existed
//           if (targetNodeIdFromEdge) {
//             setEdges((eds) => [
//               ...eds,
//               createEdge(addButtonId, targetNodeIdFromEdge, 'conditionalEnd', {
//                 isNextStepEmpty: true,
//                 flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
//                 branchId,
//                 branchIndex: index,
//                 branchCount: branchesWithIds.length,
//               }),
//             ]);
//           }
//         });
//       }, 10);
//     }
//     // CASE 3B: User selected a regular action for an AddButton
//     else {
//       const newNodeId = `action-${timestamp}`;
//       const allCurrentEdges = [...edges];
//       const sourceNodeForAction = conditionNodeId || parentNode;

//       // Remove the old AddButton
//       setNodes((nds) => nds.filter((n) => [n.id](http://n.id/) !== nodeId));

//       // Add the new Action node
//       setNodes((nds) => [
//         ...nds,
//         createActionNode(newNodeId, appId, selectedItem, config.config),
//       ]);

//       // Create updated edges array preserving all properties and order
//       // First, find the edges we need to replace
//       const edgeToAction = allCurrentEdges.find(edge => edge.target === nodeId && edge.source === sourceNodeForAction);
//       const edgeFromAction = allCurrentEdges.find(edge => edge.source === nodeId && targetNodeIdFromEdge);

//       // Create the replacement edges with the same properties
//       const newEdgeToAction = edgeToAction ? {
//         ...edgeToAction,
//         id: `e-${sourceNodeForAction}-${newNodeId}`,
//         target: newNodeId,
//         data: {
//           ...edgeToAction.data,
//           branchName: branchLabelFromEdge,
//         }
//       } : null;

//       const newEdgeFromAction = edgeFromAction ? {
//         ...edgeFromAction,
//         id: `e-${newNodeId}-${edgeFromAction.target}`,
//         source: newNodeId,
//         data: {
//           ...edgeFromAction.data,
//           isNextStepEmpty: false
//         }
//       } : null;

//       // Remove the old edges and insert new ones in the same positions
//       // This maintains the edge order within the branch
//       const updatedEdges = [];
//       let insertedToEdge = false;
//       let insertedFromEdge = false;

//       for (const edge of allCurrentEdges) {
//         // Skip the edges we're replacing
//         if (edge.target === nodeId && edge.source === sourceNodeForAction) {
//           updatedEdges.push(newEdgeToAction);
//           insertedToEdge = true;
//           continue;
//         }

//         if (edge.source === nodeId && targetNodeIdFromEdge) {
//           updatedEdges.push(newEdgeFromAction);
//           insertedFromEdge = true;
//           continue;
//         }

//         // Keep any edge not connected to the old AddButton
//         if (edge.source !== nodeId && edge.target !== nodeId) {
//           updatedEdges.push(edge);
//         }
//       }

//       // If we didn't insert the edges yet (they weren't found in the iteration),
//       // add them now
//       if (!insertedToEdge && newEdgeToAction) {
//         updatedEdges.push(newEdgeToAction);
//       }

//       if (!insertedFromEdge && newEdgeFromAction) {
//         updatedEdges.push(newEdgeFromAction);
//       }

//       // Update edges maintaining exact properties
//       setEdges(updatedEdges);

//       // Add new AddButton if no outgoing edge existed
//       if (!targetNodeIdFromEdge) {
//         const addButtonId = `add-button-${timestamp}`;
//         setTimeout(() => {
//           setNodes((nds) => [
//             ...nds,
//             createAddButtonNode(addButtonId, newNodeId, {
//               branchLabel: branchLabelFromEdge,
//               ...(conditionNodeId ? { branchId, branchIndex, branchCount } : {})
//             }),
//           ]);

//           setEdges((eds) => [
//             ...eds,
//             createEdge(newNodeId, addButtonId, conditionNodeId ? 'conditionalEnd' : 'smoothstep',
//               conditionNodeId ? {
//                 isNextStepEmpty: true,
//                 flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
//                 branchId,
//                 branchIndex,
//                 branchCount
//               } : undefined
//             ),
//           ]);
//         }, 10);
//       }
//     }
//   }
// };

/**

- Unified function to handle configuration saves for both triggers and actions
- Handles all scenarios: edge insertion, adding to a trigger node, or adding to an action node
*/
const handleConfigSave = (config: any) => {
setShowConfigSidebar(false);
    
    const {
    nodeId,
    appId,
    selectedItem,
    type,
    parentNode,
    branchName,
    edgeId,
    sourceNodeId,
    targetNodeId,
    } = config;
    
    const app = SAMPLE_APPS[appId];
    const timestamp = Date.now();
    
    // Helper functions for consistent node/edge creation
    const createNode = (id: string, nodeType: string, data: any) => ({
    id,
    type: nodeType,
    position: { x: 0, y: 0 },
    data,
    });
    
    const createActionNode = (id: string, appId: string, selectedItem: any, configData: any) =>
    createNode(id, 'actionNode', {
    label: `${SAMPLE_APPS[appId].name}: ${selectedItem.label}`,
    app: appId,
    action: selectedItem.key,
    configured: true,
    config: configData || selectedItem.config,
    });
    
    const createAddTriggerNode = (id: string, data: any) =>
    createNode(id, 'addTriggerNode', data);
    
    const createAddButtonNode = (id: string, parentNodeId: string, branchData = {}) =>
    createNode(id, 'addButtonNode', {
    label: '+',
    parentNode: parentNodeId,
    ...branchData,
    });
    
    const createConditionNode = (id: string, branches: any[], configData: any) =>
    createNode(id, 'conditionNode', {
    label: 'Condition',
    branches,
    configured: true,
    config: configData,
    });
    
    const createEdge = (sourceId: string, targetId: string, type = 'custom', edgeData = {}) => ({
    id: `e-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type,
    markerEnd: { type: MarkerType.ArrowClosed },
    data: edgeData,
    });
    
    const processBranches = (branchNames: string[]) => {
    return branchNames.map((b: string, idx: number) => ({
    branchName: b,
    branchId: `branch-${timestamp}-${idx}`,
    branchIndex: idx,
    branchCount: branchNames.length,
    }));
    };
    
    // Main handler based on the scenario type
    if (edgeId) {
    // SCENARIO 1: User clicked "+" on an existing edge (insert node in the middle)
    handleEdgeInsertion(edgeId, appId, selectedItem, config, timestamp);
    } else if (type === 'trigger') {
    // SCENARIO 2: User clicked directly on a Trigger node
    handleTriggerNodeAddition(nodeId, appId, selectedItem, config);
    } else if (type === 'action') {
    // SCENARIO 3: User clicked on an AddButton under an existing Action/node
    handleActionNodeAddition(nodeId, parentNode, appId, selectedItem, config, branchName, timestamp);
    }
    
    /**
    
    - Handle inserting a node (action or condition) into an existing edge
    */
    function handleEdgeInsertion(edgeId: string, appId: string, selectedItem: any, config: any, timestamp: number) {
    // Get edge information before removing it
    const currentEdge = edges.find((e) => [e.id](http://e.id/) === edgeId);
    if (!currentEdge) return;
    
    const edgeIndex = edges.findIndex((e) => [e.id](http://e.id/) === edgeId);
    const isConditionalEdge = currentEdge?.data?.flowLocationRelativeToParent === FlowLocationRelativeToParent.INSIDE_BRANCH;
    const lastNodeCondition = currentEdge?.type === 'conditionalEnd';
    const branchId = currentEdge?.data?.branchId;
    const branchIndex = currentEdge?.data?.branchIndex;
    const branchCount = currentEdge?.data?.branchCount;
    
    // Make a copy of edges to modify
    const updatedEdges = [...edges];
    updatedEdges.splice(edgeIndex, 1);
    
    if (selectedItem?.key === 'condition') {
    // Insert a condition node
    const newNodeId = `condition-${timestamp}`;
    const branchesWithIds = processBranches(config.branches || ['Branch 1', 'Otherwise']);
    

     // Create the Condition node
     setNodes((nds) => [
       ...nds,
       createConditionNode(newNodeId, branchesWithIds, config),
     ]);
    
     // Connect source → condition
     const newEdge = createEdge(sourceNodeId, newNodeId, 'custom', {
       branchName,
       flowLocationRelativeToParent: isConditionalEdge
         ? FlowLocationRelativeToParent.INSIDE_BRANCH
         : undefined,
       ...(isConditionalEdge ? { branchId, branchIndex, branchCount } : {}),
     });
    
     // Insert the new edge at the same position as the removed edge
     updatedEdges.splice(edgeIndex, 0, newEdge);
     setEdges(updatedEdges);
    
     // Add each branch's "AddButtonNode" and connections
     setTimeout(() => {
       branchesWithIds.forEach((branchObj, index) => {
         const { branchName, branchId } = branchObj;
         const addButtonId = `add-button-${timestamp}-${index}`;
    
         // Add an AddButtonNode for each branch
         setNodes((nds) => [
           ...nds,
           createAddButtonNode(addButtonId, newNodeId, { branchName, branchId }),
         ]);
    
         // Connect condition → addButton
         setEdges((eds) => [
           ...eds,
           createEdge(newNodeId, addButtonId, 'conditionalStart', {
             branchName,
             branchId,
             flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH
           }),
         ]);
    
         // Connect addButton → target (if there is one)
         if (targetNodeId) {
           setEdges((eds) => [
             ...eds,
             createEdge(addButtonId, targetNodeId, 'conditionalEnd', {
               isNextStepEmpty: true,
               flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
               branchId,
               branchIndex: index,
               branchCount: branchesWithIds.length,
             }),
           ]);
         }
       });
     }, 10);
    

    
    } else {
    // Insert an action node
    const newNodeId = `action-${timestamp}`;
    

     // Add the new action node
     setNodes((nds) => [
       ...nds,
       createActionNode(newNodeId, appId, selectedItem, config.config),
     ]);
    
     // Create the new "source → action" edge
     const firstEdge = createEdge(
       sourceNodeId,
       newNodeId,
       'custom',
       {
         branchLabel: branchName,
         flowLocationRelativeToParent: isConditionalEdge
           ? FlowLocationRelativeToParent.INSIDE_BRANCH
           : FlowLocationRelativeToParent.AFTER,
         ...(isConditionalEdge
           ? { branchId, branchIndex, branchCount }
           : {}),
       }
     );
    
     // If there was a targetNodeId, build the "action → target" edge
     let secondEdge = null;
     if (targetNodeId) {
       secondEdge = createEdge(
         newNodeId,
         targetNodeId,
         lastNodeCondition ? 'conditionalEnd' : 'custom',
         {
           ...(isConditionalEdge
             ? {
               branchId,
               branchIndex,
               branchCount,
               flowLocationRelativeToParent:
                 FlowLocationRelativeToParent.INSIDE_BRANCH,
             }
             : {}),
         }
       );
     }
    
     // Insert edges at proper positions
     updatedEdges.splice(edgeIndex, 0, firstEdge);
     if (secondEdge) {
       updatedEdges.splice(edgeIndex + 1, 0, secondEdge);
     }
     setEdges(updatedEdges);
    
     // If no existing target, schedule an AddButton under the action
     if (!targetNodeId) {
       const addButtonId = `add-button-${timestamp}`;
       setTimeout(() => {
         setNodes((nds) => [
           ...nds,
           createAddButtonNode(addButtonId, newNodeId),
         ]);
    
         setEdges((eds) => [
           ...eds,
           createEdge(newNodeId, addButtonId, 'smoothstep'),
         ]);
       }, 10);
     }
    

    
    }
    }
    
    /**
    
    - Handle adding a trigger to an existing trigger node
    */
    function handleTriggerNodeAddition(nodeId: string, appId: string, selectedItem: any, config: any) {
    // Update the existing trigger node
    setNodes((nds) =>
    nds.map((node) => {
    if ([node.id](http://node.id/) === nodeId) {
    return {
    ...node,
    data: {
    ...node.data,
    label: `${app.name}: ${selectedItem.label}`,
    app: appId,
    trigger: selectedItem.key,
    configured: true,
    config: config.config || selectedItem.config,
    },
    };
    }
    return node;
    })
    );
    
    // Create a new AddTriggerNode
    const addTriggerNodeId = `add-trigger-${timestamp}`;
    setNodes((nds) => [
    ...nds,
    createAddTriggerNode(addTriggerNodeId, {
    label: '+',
    parentNode: nodeId,
    }),
    ]);
    
    // Update edges
    setEdges((currentEdges) => {
    // Update all edges where source === nodeId to have type = 'triggerEdge'
    const updatedOriginalEdges = currentEdges.map((edge) => {
    if (edge.source === nodeId) {
    return {
    ...edge,
    type: 'triggerEdge',
    data: {
    ...edge.data,
    triggerCount: (edge.data?.triggerCount || 0) + 1,
    }
    };
    }
    return edge;
    });
    

     // Find outgoing edges from nodeId
     const outgoingEdges = updatedOriginalEdges.filter((edge) => edge.source === nodeId);
    
     // Create parallel edges from addTriggerNodeId
     const parallelEdges = outgoingEdges.map((oldEdge) =>
       createEdge(
         addTriggerNodeId,
         oldEdge.target,
         'triggerEdge',
         {
           ...oldEdge.data,
           flowLocationRelativeToParent: FlowLocationRelativeToParent.AFTER,
           triggerIndex: (oldEdge.data?.triggerIndex || 0) + 1,
           triggerCount: oldEdge.data?.triggerCount || 1,
         }
       )
     );
    
     return [...updatedOriginalEdges, ...parallelEdges];
    

    
    });
    }
    
    /**
    
    - Handle adding/replacing an action node on an existing AddButton
    */
    function handleActionNodeAddition(nodeId: string, parentNode: string, appId: string, selectedItem: any, config: any, branchName: string, timestamp: number) {
    const parentNodeObj = nodes.find((n) => [n.id](http://n.id/) === parentNode);
    if (!parentNodeObj) return;
    
    // Find connections to/from the AddButton
    const incomingEdges = edges.filter((e) => e.target === nodeId);
    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    const conditionEdge = incomingEdges.find((e) => e.type === 'conditionalStart');
    const conditionNodeId = conditionEdge?.source;
    const branchLabelFromEdge = conditionEdge?.data?.branchName || branchName;
    const branchId = conditionEdge?.data?.branchId;
    const branchIndex = conditionEdge?.data?.branchIndex;
    const branchCount = conditionEdge?.data?.branchCount;
    const targetNodeIdFromEdge = outgoingEdges.length > 0 ? outgoingEdges[0].target : null;
    
    if (selectedItem?.key === 'condition') {
    // Add a condition node replacing the AddButton
    const newNodeId = `condition-${timestamp}`;
    const branchesWithIds = processBranches(config.branches || ['Branch 1', 'Otherwise']);
    

     // Find edges connected to the AddButton
     const allCurrentEdges = [...edges];
     const edgesWithPositions = allCurrentEdges.map((edge, index) => ({
       edge,
       index
     }));
    
     const incomingEdgeInfo = edgesWithPositions.find(item => item.edge.target === nodeId);
     const outgoingEdgeInfo = edgesWithPositions.find(item => item.edge.source === nodeId);
    
     // Remove the AddButton node
     setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    
     // Create the new Condition node
     setNodes((nds) => [
       ...nds,
       createConditionNode(newNodeId, branchesWithIds, config),
     ]);
    
     // Update the edges
     const updatedEdges = [...allCurrentEdges];
    
     // Remove edges connected to the AddButton
     if (incomingEdgeInfo) {
       updatedEdges.splice(incomingEdgeInfo.index, 1);
     }
    
     if (outgoingEdgeInfo && outgoingEdgeInfo.index > incomingEdgeInfo.index) {
       updatedEdges.splice(outgoingEdgeInfo.index - 1, 1);
     } else if (outgoingEdgeInfo) {
       updatedEdges.splice(outgoingEdgeInfo.index, 1);
     }
    
     // Create new edge from parent to condition
     const newEdge = createEdge(parentNode, newNodeId, conditionNodeId ? 'conditionalEnd' : 'smoothstep', {
       branchLabel: branchLabelFromEdge,
       flowLocationRelativeToParent: conditionNodeId
         ? FlowLocationRelativeToParent.INSIDE_BRANCH
         : FlowLocationRelativeToParent.AFTER,
       ...(conditionNodeId ? { branchId, branchIndex, branchCount } : {}),
     });
    
     if (incomingEdgeInfo) {
       updatedEdges.splice(incomingEdgeInfo.index, 0, newEdge);
     } else {
       updatedEdges.push(newEdge);
     }
    
     setEdges(updatedEdges);
    
     // Add branches to the condition
     setTimeout(() => {
       branchesWithIds.forEach((branchObj, index) => {
         const { branchName, branchId } = branchObj;
         const addButtonId = `add-button-${timestamp}-${index}`;
    
         // Add AddButtonNode for each branch
         setNodes((nds) => [
           ...nds,
           createAddButtonNode(addButtonId, newNodeId, { branchName, branchId }),
         ]);
    
         // Connect condition → addButton
         setEdges((eds) => [
           ...eds,
           createEdge(newNodeId, addButtonId, 'conditionalStart', {
             branchName,
             branchId
           }),
         ]);
    
         // Connect to prior target if it existed
         if (targetNodeIdFromEdge) {
           setEdges((eds) => [
             ...eds,
             createEdge(addButtonId, targetNodeIdFromEdge, 'conditionalEnd', {
               isNextStepEmpty: true,
               flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
               branchId,
               branchIndex: index,
               branchCount: branchesWithIds.length,
             }),
           ]);
         }
       });
     }, 10);
    

    
    } else {
    // Add an action node replacing the AddButton
    const newNodeId = `action-${timestamp}`;
    const allCurrentEdges = [...edges];
    const sourceNodeForAction = conditionNodeId || parentNode;
    

     // Remove the old AddButton
     setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    
     // Add the new Action node
     setNodes((nds) => [
       ...nds,
       createActionNode(newNodeId, appId, selectedItem, config.config),
     ]);
    
     // Create updated edges array
     const edgeToAction = allCurrentEdges.find(edge => edge.target === nodeId && edge.source === sourceNodeForAction);
     const edgeFromAction = allCurrentEdges.find(edge => edge.source === nodeId && targetNodeIdFromEdge);
    
     // Create the replacement edges
     const newEdgeToAction = edgeToAction ? {
       ...edgeToAction,
       id: `e-${sourceNodeForAction}-${newNodeId}`,
       target: newNodeId,
       data: {
         ...edgeToAction.data,
         branchName: branchLabelFromEdge,
       }
     } : null;
    
     const newEdgeFromAction = edgeFromAction ? {
       ...edgeFromAction,
       id: `e-${newNodeId}-${edgeFromAction.target}`,
       source: newNodeId,
       data: {
         ...edgeFromAction.data,
         isNextStepEmpty: false
       }
     } : null;
    
     // Maintain edge order by carefully replacing edges
     const updatedEdges = [];
     let insertedToEdge = false;
     let insertedFromEdge = false;
    
     for (const edge of allCurrentEdges) {
       if (edge.target === nodeId && edge.source === sourceNodeForAction) {
         updatedEdges.push(newEdgeToAction);
         insertedToEdge = true;
         continue;
       }
    
       if (edge.source === nodeId && targetNodeIdFromEdge) {
         updatedEdges.push(newEdgeFromAction);
         insertedFromEdge = true;
         continue;
       }
    
       if (edge.source !== nodeId && edge.target !== nodeId) {
         updatedEdges.push(edge);
       }
     }
    
     // Add any edges that weren't inserted
     if (!insertedToEdge && newEdgeToAction) {
       updatedEdges.push(newEdgeToAction);
     }
    
     if (!insertedFromEdge && newEdgeFromAction) {
       updatedEdges.push(newEdgeFromAction);
     }
    
     setEdges(updatedEdges);
    
     // Add new AddButton if no target exists
     if (!targetNodeIdFromEdge) {
       const addButtonId = `add-button-${timestamp}`;
       setTimeout(() => {
         setNodes((nds) => [
           ...nds,
           createAddButtonNode(addButtonId, newNodeId, {
             branchLabel: branchLabelFromEdge,
             ...(conditionNodeId ? { branchId, branchIndex, branchCount } : {})
           }),
         ]);
    
         setEdges((eds) => [
           ...eds,
           createEdge(newNodeId, addButtonId, conditionNodeId ? 'conditionalEnd' : 'smoothstep',
             conditionNodeId ? {
               isNextStepEmpty: true,
               flowLocationRelativeToParent: FlowLocationRelativeToParent.INSIDE_BRANCH,
               branchId,
               branchIndex,
               branchCount
             } : undefined
           ),
         ]);
       }, 10);
     }
    

    
    }
    }
    };
    

// Handle configuration cancel
const handleConfigCancel = () => {
setShowConfigSidebar(false);
};

useEffect(() => {
const currentStructure = JSON.stringify({
nodes: nodes.map(n => ({ id: [n.id](http://n.id/), parentNode: n.data.parentNode })),
edges: edges.map(e => ({ source: e.source, target: e.target }))
});

if (currentStructure !== prevStructure.current) {
  prevStructure.current = currentStructure;
  const layoutedNodes = getLayoutedElements(nodes, edges);
  setNodes(layoutedNodes);
}


}, [nodes, edges, setNodes]);

console.log({ nodes, edges });

return (
<WorkflowContext.Provider
value={{
apps: SAMPLE_APPS,
nodes,
edges,
setNodes,
setEdges,
// Add these values
setShowAppSelector,
setSelectorPosition,
setCurrentNodeId,
setSelectorType,
setParentNode,
setBranchLabel,
setEdgeId
}}

>
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
      fitView
    >
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

export default WorkflowBuilder;