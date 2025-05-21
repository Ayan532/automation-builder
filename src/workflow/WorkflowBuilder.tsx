
import dagree from 'dagre'

import { CircleAlert, FileWarning, GitBranch, Plus } from 'lucide-react';
import React, {  useCallback, createContext, useEffect, useContext, useRef, memo, useMemo } from 'react';
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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';



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
  },
   core: {
    id: 'core',
    name: 'Core',
    icon: '⚙️',
    color: 'bg-gray-100',
    description: 'Core automation functions',
    actions: {
      human_input: {
        key: 'human_input',
        label: 'Human Input',
        appId: 'core',
        description: 'Human input integration',
        config: {
          label: {
            label: 'Label',
            type: 'input',
            required: true,
            placeholder: 'Enter label'
          }
        }
      },
      schedule: {
        key: 'schedule',
        label: 'Schedule',
        appId: 'core',
        description: 'Schedule tasks',
        config: {
          time: {
            label: 'Time',
            type: 'input',
            required: true,
            placeholder: 'Enter time (e.g., 12:00 PM)'
          }
        }
      },
      webhook: {
        key: 'webhook',
        label: 'Webhook',
        appId: 'core',
        description: 'Webhook integration',
        config: {}
      },
      condition: {
        key: 'condition',
        label: 'Condition',
        appId: 'core',
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
  }
};


// Type definition matching the provided interface
interface AppSelectorProps {
    position: { x: number; y: number };
    onSelect: (appId: string,key:string) => void;
    onClose: () => void;
    type: 'trigger' | 'action';
}

const ADDITIONAL_APPS = {
   core: {
    id: 'core',
    name: 'Core',
    icon: '⚙️',
    color: 'bg-gray-100',
    description: 'Core automation functions',
    actions: {
      human_input: {
        key: 'human_input',
        label: 'Human Input',
        appId: 'core',
        description: 'Human input integration',
        config: {
          label: {
            label: 'Label',
            type: 'input',
            required: true,
            placeholder: 'Enter label'
          }
        }
      },
      schedule: {
        key: 'schedule',
        label: 'Schedule',
        appId: 'core',
        description: 'Schedule tasks',
        config: {
          time: {
            label: 'Time',
            type: 'input',
            required: true,
            placeholder: 'Enter time (e.g., 12:00 PM)'
          }
        }
      },
      webhook: {
        key: 'webhook',
        label: 'Webhook',
        appId: 'core',
        description: 'Webhook integration',
        config: {}
      },
      condition: {
        key: 'condition',
        label: 'Condition',
        appId: 'core',
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
  }
}

// Merge SAMPLE_APPS with ADDITIONAL_APPS
const ALL_APPS = { ...SAMPLE_APPS, ...ADDITIONAL_APPS };

// Icons for the different categories/tabs
const TabIcons = {
    All: null,
    AI: '✨',
    Core: '🔧',
    Apps: '🔗'
};

export  function AppSelector({ position, onSelect, onClose, type }: AppSelectorProps) {
    const [selectedTab, setSelectedTab] = useState('All');
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter apps based on the selected tab and search query
    const filteredApps = Object.values(ALL_APPS).filter(app => {
        // Only show apps that have triggers if type is 'trigger'
        if (type === 'trigger' && Object.keys(app.triggers || {}).length === 0) {
            return false;
        }

        // Only show apps that have actions if type is 'action'
        if (type === 'action' && Object.keys(app.actions || {}).length === 0) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Get triggers or actions for the selected app
    const getAppItems = (appId: string) => {
        const app = ALL_APPS[appId];
        if (!app) return [];

        return type === 'trigger'
            ? Object.values(app.triggers || {})
            : Object.values(app.actions || {});
    };

    // Handle app selection
    const handleAppClick = (appId: string) => {
        setSelectedApp(appId);
    };

    // Handle trigger or action selection
    const handleItemSelect = (appId: string, itemKey: string) => {
        onSelect(appId, itemKey);
     
    };

    // Get app icon
    const getAppIcon = (appId: string) => {
        const app = ALL_APPS[appId];

        return (
            <div className="flex-shrink-0 w-6 h-6">
                <div className="flex items-center justify-center w-6 h-6">
                    <span className="text-xl">{app.icon}</span>
                </div>
            </div>
        );
    };

    const positionStyle = {
        left: `${position.x}px`,
        top: `${position.y}px`,
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl border overflow-hidden w-full max-w-3xl h-[60vh]"
                onClick={(e) => e.stopPropagation()}
                style={positionStyle}
            >
                {/* Search and tabs */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2 mt-3">
                        {Object.keys(TabIcons).map((tab) => (
                            <button
                                key={tab}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedTab === tab ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                    }`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {TabIcons[tab] && <span className="mr-1">{TabIcons[tab]}</span>}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex">
                    {/* Left panel - App list */}
                    <div className="w-2/5 border-r max-h-96 overflow-y-auto">
                        <div className="py-2">
                            <div className="px-4 py-2 text-sm font-medium text-gray-500">
                                Popular
                            </div>
                            <ul>
                                {filteredApps.map((app) => (
                                    <li key={app.id}>
                                        <button
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-100 ${selectedApp === app.id ? 'bg-gray-100' : ''
                                                }`}
                                            onClick={() => handleAppClick(app.id)}
                                        >
                                            {getAppIcon(app.id)}
                                            <span className="ml-3 text-sm font-medium text-gray-900">{app.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right panel - Triggers/Actions */}
                    <div className="w-3/5 max-h-96 overflow-y-auto">
                        {selectedApp ? (
                            <div className="py-2">
                                {getAppItems(selectedApp).length > 0 ? (
                                    <ul>
                                        {getAppItems(selectedApp).map((item) => (
                                            <li key={item.key}>
                                                <button
                                                    className="flex flex-col w-full px-4 py-3 text-left hover:bg-gray-100"
                                                    onClick={() => handleItemSelect(selectedApp, item.key)}
                                                >
                                                    <div className="flex items-center">
                                                        {getAppIcon(selectedApp)}
                                                        <span className="ml-3 text-sm font-medium text-gray-900">{item.label}</span>
                                                    </div>
                                                    {item.description && (
                                                        <p className="ml-9 text-xs text-gray-500 mt-1">{item.description}</p>
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-12">
                                        <div className="text-2xl mb-4">←</div>
                                        <p className="text-sm text-gray-500">Please select a piece first</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12">
                                <div className="text-2xl mb-4">←</div>
                                <p className="text-sm text-gray-500">Please select a piece first</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}




// Property class for field type definitions

const BranchCondition = memo(({ condition, onUpdate, onDelete, isDefaultBranch }) => {
  const [field, setField] = useState(condition.field || '');
  const [operator, setOperator] = useState(condition.operator || 'includes');
  const [value, setValue] = useState(condition.value || '');

  // Update parent when any condition field changes
  useEffect(() => {
    onUpdate({ field, operator, value });
  }, [field, operator, value, onUpdate]);

  // Available operators for conditions
  const operators = [
    { value: 'includes', label: 'Includes' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not equals' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
  ];

  // Available fields for conditions (these would come from your app's data model)
  const fields = [
    { value: 'tags', label: 'Tags' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="flex items-center space-x-2 mt-2">
      {/* Field selector */}
      <div className="relative w-1/3">
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={field}
          onChange={(e) => setField(e.target.value)}
        >
          <option value="">Select field</option>
          {fields.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Operator selector */}
      <div className="relative w-1/3">
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          {operators.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Value input */}
      <div className="relative w-1/3">
        <input
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      
      {/* Delete button */}
      {!isDefaultBranch && (
        <button
          type="button"
          className="p-2 text-red-500 hover:text-red-700"
          onClick={onDelete}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

// Single Branch component
const Branch = memo(({ branch, onUpdate, onDelete, isLast }) => {
  const [name, setName] = useState(branch.name);
  const [conditions, setConditions] = useState(branch.conditions || []);
  const [expanded, setExpanded] = useState(true);
  const isOtherwise = branch.isOtherwise;

  // Update parent when any branch field changes
  useEffect(() => {
    onUpdate({ ...branch, name, conditions });
  }, [name, conditions]);

  // Add new condition to branch
  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: 'includes', value: '' }]);
  };

  // Update specific condition
  const updateCondition = (index, updatedCondition) => {
    const newConditions = [...conditions];
    newConditions[index] = updatedCondition;
    setConditions(newConditions);
  };

  // Remove specific condition
  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Get the logical operator (AND/OR) - currently just using AND
  const getLogicalOperator = () => {
    return { value: 'and', label: 'AND' };
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
      {/* Branch header */}
      <div className="bg-gray-50 flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setExpanded(!expanded)}
          >
            <svg
              className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {isOtherwise ? (
            <span className="font-medium text-gray-700">Otherwise</span>
          ) : (
            <input
              type="text"
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Branch name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          
          <span className="ml-2 text-sm text-gray-500">
            {branch.count || 0}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isOtherwise && !isLast && (
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Branch content */}
      {expanded && (
        <div className="p-4">
          {/* Description for Otherwise branch */}
          {isOtherwise ? (
            <div className="text-sm text-gray-500 mb-4">
              When no condition is met
            </div>
          ) : (
            <>
              {/* Branch conditions */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">
                  The condition will be true if all of the selected rules are met
                </div>
                
                {conditions.map((condition, index) => (
                  <BranchCondition
                    key={index}
                    condition={condition}
                    onUpdate={(updatedCondition) => updateCondition(index, updatedCondition)}
                    onDelete={() => removeCondition(index)}
                    isDefaultBranch={index === 0 && conditions.length === 1}
                  />
                ))}
                
                {/* Show logical operator if multiple conditions */}
                {conditions.length > 0 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="relative">
                      <select
                        className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={getLogicalOperator().value}
                        disabled
                      >
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={addCondition}
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Rule
                    </button>
                  </div>
                )}
                
                {/* Add first condition if none exist */}
                {conditions.length === 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={addCondition}
                  >
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add First Rule
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});

// Main Branches component
const BranchesManager = ({ field, value, onChange }) => {
  // Initialize with default branches if none exist
  const [branches, setBranches] = useState(() => {
    if (value && value.length > 0) {
      return value;
    }
    return [
      { id: 1, name: 'Branch 1', conditions: [], count: 0 },
      { id: 2, name: 'Otherwise', isOtherwise: true, count: 0 }
    ];
  });

  // Update branch at specific index
  const updateBranch = (index, updatedBranch) => {
    const newBranches = [...branches];
    newBranches[index] = { ...newBranches[index], ...updatedBranch };
    setBranches(newBranches);
    onChange(newBranches);
  };

  // Add new branch
  const addBranch = () => {
    // Get the last branch which should be "Otherwise"
    const otherwiseBranch = branches[branches.length - 1];
    // Insert new branch before "Otherwise"
    const newBranches = [
      ...branches.slice(0, branches.length - 1),
      { id: Date.now(), name: `Branch ${branches.length}`, conditions: [], count: 0 },
      otherwiseBranch
    ];
    setBranches(newBranches);
    onChange(newBranches);
  };

  // Remove branch at specific index
  const removeBranch = (index) => {
    const newBranches = branches.filter((_, i) => i !== index);
    setBranches(newBranches);
    onChange(newBranches);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.options.displayName || 'Branches'}
        {field.options.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      
      <div className="space-y-2">
        {branches.map((branch, index) => (
          <Branch
            key={branch.id || index}
            branch={branch}
            onUpdate={(updatedBranch) => updateBranch(index, updatedBranch)}
            onDelete={() => removeBranch(index)}
            isLast={index === branches.length - 1}
          />
        ))}
        
        {/* Add branch button */}
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={addBranch}
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Branch
        </button>
        
        {/* Reorder branches button */}
        <button
          type="button"
          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Reorder Branches
        </button>
      </div>
    </div>
  );
};
class Property {
  static ShortText(options) {
    return {
      type: 'SHORT_TEXT',
      options: {
        ...options,
        defaultValue: options.defaultValue || '',
      },
    };
  }

  static LongText(options) {
    return {
      type: 'LONG_TEXT',
      options: {
        ...options,
        defaultValue: options.defaultValue || '',
      },
    };
  }

  static Number(options) {
    return {
      type: 'NUMBER',
      options: {
        ...options,
        defaultValue: options.defaultValue ?? 0,
      },
    };
  }

  static Checkbox(options) {
    return {
      type: 'CHECKBOX',
      options: {
        ...options,
        defaultValue: options.defaultValue ?? false,
      },
    };
  }

  static StaticDropdown(options) {
    return {
      type: 'STATIC_DROPDOWN',
      options: {
        ...options,
        defaultValue: options.defaultValue || null,
      },
    };
  }

  static Dropdown(options) {
    return {
      type: 'DYNAMIC_DROPDOWN',
      options: {
        ...options,
        defaultValue: options.defaultValue || null,
      },
    };
  }

  static Date(options) {
    return {
      type: 'DATE',
      options: {
        ...options,
        defaultValue: options.defaultValue || '',
      },
    };
  }

  static DateTime(options) {
    return {
      type: 'DATE_TIME',
      options: {
        ...options,
        defaultValue: options.defaultValue || '',
      },
    };
  }

  static FormFields(options) {
    return {
      type: 'FORM_FIELDS',
      options: {
        ...options,
        defaultValue: options.defaultValue || [],
      },
    };
  }

  static DynamicProperties(options) {
    return {
      type: 'DYNAMIC_PROPERTIES',
      options: {
        ...options,
        defaultValue: options.defaultValue || {},
      },
    };
  }

  static Json(options) {
    return {
      type: 'JSON',
      options: {
        ...options,
        defaultValue: options.defaultValue || {},
      },
    };
  }

  static Object(options) {
    return {
      type: 'OBJECT',
      options: {
        ...options,
        defaultValue: options.defaultValue || {},
      },
    };
  }
}





// Configuration form fields mapped to Property types
const fieldMap = {
  'input': Property.ShortText,
  'textarea': Property.LongText,
  'checkbox': Property.Checkbox,
  'dropdown': Property.StaticDropdown,
  'number': Property.Number,
  'date': Property.Date,
  'datetime': Property.DateTime,
  'branches': Property.FormFields,
};

// Helper function to convert app config to Property schema
const convertConfigToProperties = (config) => {
  const properties = {};
  if (!config) return properties;
  
  Object.entries(config).forEach(([key, fieldConfig]) => {
    const fieldType = fieldConfig.type || 'input';
    const propertyFn = fieldMap[fieldType] || Property.ShortText;
    properties[key] = propertyFn({
      displayName: fieldConfig.label,
      description: fieldConfig.placeholder || '',
      required: fieldConfig.required || false,
      key,
      defaultValue: ''
    });
  });
  
  return properties;
};

// Field components for rendering different input types - memoized to prevent re-renders
const ShortTextField = memo(({ field, value, onChange, disabled }) => (
  <input
    type="text"
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder={field.options.placeholder}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  />
));

const LongTextField = memo(({ field, value, onChange, disabled }) => (
  <textarea
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder={field.options.placeholder}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    rows={4}
    disabled={disabled}
  />
));

const NumberField = memo(({ field, value, onChange, disabled }) => (
  <input
    type="number"
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder={field.options.placeholder}
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    disabled={disabled}
  />
));

const CheckboxField = memo(({ field, value, onChange, disabled }) => (
  <input
    type="checkbox"
    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    checked={!!value}
    onChange={(e) => onChange(e.target.checked)}
    disabled={disabled}
  />
));

const StaticDropdownField = memo(({ field, value, onChange, disabled }) => (
  <select
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  >
    {field.options.options?.options?.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
));

const DynamicDropdownField = memo(({ field, value, onChange, disabled }) => (
  <select
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled || true}
  >
    <option>Loading options...</option>
  </select>
));

const DateField = memo(({ field, value, onChange, disabled }) => (
  <input
    type="date"
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  />
));

const DateTimeField = memo(({ field, value, onChange, disabled }) => (
  <input
    type="datetime-local"
    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  />
));

const FormFieldsField = memo(({ field, value, onChange, disabled }) => (
  <div className="space-y-2">
    {(value || []).map((item, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={item || ''}
          onChange={(e) => {
            const newValue = [...value];
            newValue[index] = e.target.value;
            onChange(newValue);
          }}
          disabled={disabled}
        />
        <button
          type="button"
          className="p-2 text-red-500 hover:text-red-700"
          onClick={() => {
            const newValue = value.filter((_, i) => i !== index);
            onChange(newValue);
          }}
          disabled={disabled}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ))}
    <button
      type="button"
      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick={() => onChange([...(value || []), ''])}
      disabled={disabled}
    >
      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
      Add Branch
    </button>
  </div>
));

// Field components mapping
const FieldComponents = {
  SHORT_TEXT: ShortTextField,
  LONG_TEXT: LongTextField,
  NUMBER: NumberField,
  CHECKBOX: CheckboxField,
  STATIC_DROPDOWN: StaticDropdownField,
  DYNAMIC_DROPDOWN: DynamicDropdownField,
  DATE: DateField,
  DATE_TIME: DateTimeField,
  FORM_FIELDS: BranchesManager,
};

// Field renderer based on property type
const FieldRenderer = memo(({ field, value, onChange, disabled }) => {
  const Component = FieldComponents[field.type];
  if (!Component) {
    return <div className="text-sm text-red-500">Unsupported field type: {field.type}</div>;
  }
  return <Component field={field} value={value} onChange={onChange} disabled={disabled} />;
});

// Connection component to prevent re-renders
const ConnectionField = memo(({ isConnected, setIsConnected }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Connection<span className="ml-1 text-red-500">*</span>
    </label>
    <div className="mt-1 relative">
      <button
        type="button"
        className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        onClick={() => setIsConnected(!isConnected)}
      >
        <span className="block truncate text-gray-500">
          {isConnected ? 'Gmail Connection' : 'Select a connection'}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
    </div>
  </div>
));

// Render app icon component
const AppIcon = memo(({ appId }) => {
  if (appId === 'gmail') {
    return (
      <div className="h-10 w-10 flex-shrink-0">
        <div className="rounded-md overflow-hidden">
          <div className="bg-white p-1 border border-gray-200 rounded-md">
            <svg viewBox="0 0 24 24" className="h-8 w-8">
              <path d="M22,5v14h-2V7l-8,5.4L4,7v12H2V5H4l8,5.5L20,5H22z" fill="#EA4335" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-md bg-blue-100">
      <span className="text-2xl">{SAMPLE_APPS[appId]?.icon || '🔌'}</span>
    </div>
  );
});

// Form field component to optimize rendering
const FormField = memo(({ keyName, property, itemConfig, values, handleFieldChange, isConnected }) => {
  const isDisabled = !isConnected;
  const helpText = itemConfig[keyName]?.placeholder || '';
  const required = property.options.required;

  return (
    <div key={keyName}>
      <label className="block text-sm font-medium text-gray-700">
        {property.options.displayName}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <FieldRenderer
          field={property}
          value={values[keyName]}
          onChange={(value) => handleFieldChange(keyName, value)}
          disabled={isDisabled}
        />
      </div>
      {helpText && <p className="mt-2 text-xs text-gray-500">{helpText}</p>}
      
      {keyName === 'label' && isConnected && (
        <div className="mt-2 flex items-center">
          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700" title="Refresh">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="ml-3 flex items-center text-sm text-gray-500 hover:text-gray-700" title="Lookup values">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

// Warning component for connection
const ConnectionWarning = memo(() => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75.133-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-yellow-700">Please select a connection to configure this trigger/action.</p>
      </div>
    </div>
  </div>
));

// Footer component with save and cancel buttons
const SidebarFooter = memo(({ isValid, handleClose, handleSave }) => (
  <div className="border-t border-gray-200 px-4 py-4">
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={handleClose}
      >
        Cancel
      </button>
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
        }`}
        onClick={handleSave}
        disabled={!isValid}
      >
        Save
      </button>
    </div>
  </div>
));

// Main component - optimized with proper hook usage
const ConfigurationSidebar = ({ appId, itemKey, itemType, onCancel, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Get app data - check both SAMPLE_APPS and ADDITIONAL_APPS
  const app = SAMPLE_APPS[appId] || ADDITIONAL_APPS[appId];
  if (!app) return null;
  
  // Get item data (trigger or action)
  const item = itemType === 'trigger' ? app.triggers?.[itemKey] : app.actions?.[itemKey];
  if (!item) return null;
  
  // Convert config to property schema
  const configProperties = convertConfigToProperties(item.config);
  
  // Prepare initial values - do this outside of useState to avoid hooks error
  const getInitialValues = () => {
    const initialValues = {};
    Object.entries(configProperties).forEach(([key, property]) => {
      initialValues[key] = property.options.defaultValue;
    });
    return initialValues;
  };
  
  // Set values state
  const [values, setValues] = useState(getInitialValues);
  
  // Update a specific field value
  const handleFieldChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle form submission
  const handleSave = () => {
    if (onSave) {
      onSave({appId,itemKey,itemType,values});
    }
  };
  
  // Handle closing the sidebar
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onCancel) onCancel();
    }, 300); // Wait for animation to complete
  };
  
  // Determine if the form can be submitted
  const isValid = () => {
    let valid = true;
    Object.entries(configProperties).forEach(([key, property]) => {
      if (property.options.required) {
        const value = values[key];
        if (value === undefined || value === null || value === '') {
          valid = false;
        }
      }
    });
    return valid && isConnected;
  };
  
  // Animation effect - wrapped in useEffect to ensure it only runs once
  useEffect(() => {
    // Open the sidebar with a slight delay to ensure the component is mounted
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden z-40">
      {/* Backdrop with animation */}
      <div 
        className={`fixed inset-0 bg-gray-500 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Sidebar with animation */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div className={`w-screen max-w-md transform transition duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-medium text-gray-900">{item.label}</h2>
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500" title="Edit">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500" onClick={handleClose}>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* App Info */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <AppIcon appId={appId} />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{app.name} ({item.label})</h3>
                 
                </div>
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Connection Field - Required and special */}
                <ConnectionField isConnected={isConnected} setIsConnected={setIsConnected} />
                
                {/* Dynamic Config Fields */}
                {Object.entries(configProperties).map(([key, property]) => (
                  <FormField
                    key={key}
                    keyName={key}
                    property={property}
                    itemConfig={item.config}
                    values={values}
                    handleFieldChange={handleFieldChange}
                    isConnected={isConnected}
                  />
                ))}
                
                {/* Optional help text about connection being required */}
                {!isConnected && <ConnectionWarning />}
              </div>
            </div>
            
            {/* Footer with actions */}
            <SidebarFooter 
              isValid={isValid()} 
              handleClose={handleClose} 
              handleSave={handleSave} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};



// Improved layout function to better handle the condition branches
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  const dagreGraph = new dagree.graphlib.Graph()
    .setDefaultEdgeLabel(() => ({}));

  // 1) Graph configuration: increase ranksep (vertical spacing) to 120
  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 280,    // horizontal separation
    edgesep: 50,    // separation between edges
    ranksep: 120,   // vertical separation between ranks (was 80 → now 120)
  });

  // 2) Add each node to the dagre graph with a dynamic width/height
  nodes.forEach((node) => {
    let width = 280;
    let height = 200;

    switch (node.type) {
      case 'conditionNode':
        // Width depends on number of branches: at least 280px, plus 100px per branch
        width = node.data.branches
          ? Math.max(280, node.data.branches.length * 100)
          : 280;
        // Height grows per branch to fit all labels
        height = 120 + (node.data.branches?.length || 0) * 30;
        break;

      case 'addButtonNode':
        width = 280;
        height = 80;
        break;

      case 'triggerNode':
      case 'actionNode':
        width = 280;
        height = 80;
        break;

      case 'end':
        width = 280;
        height = 40;
        break;

      // Fallback default
      default:
        width = 280;
        height = 80;
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  // 3) Add each edge (only source/target matter for layout)
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 4) Run dagre layout
  dagree.layout(dagreGraph);

  // 5) Read back computed positions and adjust each node’s x/y
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id)!;
    const nodeWidth = dagreNode.width;
    const nodeHeight = dagreNode.height;

    // Dagre returns the center coordinates; shift to top-left
    let x = dagreNode.x - nodeWidth / 2;
    let y = dagreNode.y - nodeHeight / 2;

    return {
      ...node,
      position: { x, y },
    };
  });

  // 6) Special handling for the “end” node: if it has multiple incoming edges, recalc X as the average of all predecessors
  const endNode = layoutedNodes.find((n) => n.id === 'end');
  if (endNode) {
    // Find all edges that point INTO the end node
    const incoming = edges.filter((e) => e.target === 'end');
    if (incoming.length > 1) {
      // For each incoming edge, get the source node’s computed center X
      const sourceCenters = incoming.map((e) => {
        const srcNode = layoutedNodes.find((n) => n.id === e.source)!;
        // centerX = position.x + (width / 2)
        const dagreSrc = dagreGraph.node(e.source)!;
        return dagreSrc.x;
      });
      // Compute average center X
      const avgCenterX = sourceCenters.reduce((sum, cx) => sum + cx, 0) / sourceCenters.length;

      // Shift the end node so its center aligns with avgCenterX
      const dagreEnd = dagreGraph.node('end')!;
      const endWidth = dagreEnd.width;
      endNode.position.x = avgCenterX - endWidth / 2;
      // Y remains whatever dagre computed
    }
  }

  return layoutedNodes;
};


export const NODE_TYPES = {
  TRIGGER: 'triggerNode',
  ACTION: 'actionNode',
  CONDITION: 'conditionNode',
  ADD_BUTTON: 'addButtonNode',
  END: 'end',
} as const;

export const EDGE_TYPES = {
  CUSTOM: 'custom',
  CONDITIONAL_START: 'conditionalStart',
  CONDITIONAL_END: 'conditionalEnd',
  TRIGGER: 'triggerEdge',
} as const;


// Node Factory Class

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
  const isTriggerConfigured: boolean = nodes.find((node) => node.id === source)?.data?.configured ?? false;
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
  path += ` L ${sourceX},${midY - cornerRadius}`;

  if (curveRight) {
    // ─── “Curve Right” elbow ────────────────────────────────────────────────
    path += ` Q ${sourceX},${midY} ${sourceX + cornerRadius},${midY}`;
    path += ` L ${targetX - cornerRadius},${midY}`;
    path += ` Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
  } else if (curveLeft) {
    // ─── “Curve Left” elbow ─────────────────────────────────────────────────
    path += ` Q ${sourceX},${midY} ${sourceX - cornerRadius},${midY}`;
    path += ` L ${targetX + cornerRadius},${midY}`;
    path += ` Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
  } else if (straightDrop) {
    // ─── “Straight Drop” (no horizontal) ───────────────────────────────────
    // Drop from (sourceX, midY - r) → (sourceX, midY + r)
    path += ` L ${sourceX},${midY + cornerRadius}`;
    // If sourceX ≠ targetX, step horizontally at midY + r:
    if (sourceX !== targetX) {
      path += ` L ${targetX},${midY + cornerRadius}`;
    }
  }

  // 4b) Final vertical drop into End node
  path += ` L ${targetX},${targetY}`;

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
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    style = {},
    data,
  } = props;



  // 1) Draw the curved path (unchanged)
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Bottom,
    targetX,
    targetY,
 
    borderRadius: 16,
  });
  // 2) Grab branchLabel/branchIndex/branchCount from data
  //    (must be provided when this edge was created)
  const branchLabel: string = data?.branchLabel ?? '';
  const branchIndex: number = data?.branchIndex ?? 0;
  const branchCount: number = data?.branchCount ?? 1;

  // 3) Compute horizontal center point (targetX) and spread each label around it
  //    We’ll use a fixed pixel spacing—for example, 60px between pills.
  const labelSpacing = 0; 
  // Center‐offset so that if branchCount = 3, indices 0..2 map to
  //   offsets -labelSpacing, 0, +labelSpacing
  const centerOffset = (branchCount - 1) / 2;
  const computedLabelX =
    targetX + (branchIndex - centerOffset) * labelSpacing;

  // 4) Compute vertical position just above the curve’s targetY
  //    We lift the pill by a small verticalOffset so it “hovers” above the curve.
  const verticalOffset = 20;
  const computedLabelY = targetY - verticalOffset;

  // 5) Click handler to show the “+” action selector when the pill is clicked
  const { setShowAppSelector, setSelectorPosition, setSelectorType, setEdgeId } =
    useContext(WorkflowContext);

  const onAddStep = (_edgeId: string) => {
    setEdgeId(_edgeId);
    const pillEl = document.getElementById(_edgeId + '-pill');
    if (pillEl) {
      const rect = pillEl.getBoundingClientRect();
      setSelectorPosition({ x: rect.left, y: rect.bottom });
    } else {
      // fallback to using computed label coords
      setSelectorPosition({ x: computedLabelX, y: computedLabelY });
    }
    setSelectorType('action');
    setShowAppSelector(true);
  };

  return (
    <>
      {/* A) Draw the smooth‐step path */}
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

      {/* B) Render the branch label pill (if it exists) down near the target curve */}
      {branchLabel && (
        <foreignObject
          width={100}
          height={30}
          // Center horizontally by subtracting half the width (50)
          // Center vertically by subtracting half the height (15)
          x={computedLabelX - 50}
          y={computedLabelY - 55}
          className="edge-label-foreign-object"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            id={id + '-pill'}
            className="w-full h-full flex items-center justify-center
                       bg-white border border-gray-300 rounded-full
                       text-xs text-gray-700 cursor-pointer"
            onClick={() => onAddStep(id)}
          >
            {branchLabel}
          </div>
        </foreignObject>
      )}
    </>
  );
}

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

  // Get branch data
  const branchIndex: number = data?.branchIndex ?? 0;
  const branchCount: number = data?.branchCount ?? 1;
  const branchLabel: string = data?.branchLabel ?? '';

  const { 
    setShowAppSelector, 
    setSelectorPosition, 
    setSelectorType, 
    setEdgeId,
    onConditionalEndPlusClick
  } = useContext(WorkflowContext);

  // Calculate path geometry
  const cornerRadius = 15;
  const smallPadding = 5;
  const midY = targetY - (cornerRadius + smallPadding);

  // Determine branch positioning
  const isOdd = branchCount % 2 !== 0;
  const half = branchCount / 2;
  const midIndex = Math.floor(branchCount / 2);

  // Determine branch direction
  const curveFromRight = isOdd ? branchIndex < midIndex : branchIndex < half;
  const curveFromLeft = isOdd ? branchIndex > midIndex : branchIndex >= half;

  // Build the SVG path
  let path = `M ${sourceX},${sourceY}`;

  // Drop straight down
  path += ` L ${sourceX},${midY - cornerRadius}`;

  // Handle curve based on branch position
  if (isOdd && branchIndex === midIndex) {
    // Straight-down case for middle branch
    path += ` L ${targetX},${midY + cornerRadius}`;
  } else if (curveFromRight) {
    // Curve from right-side branch
    path += ` Q ${sourceX},${midY} ${sourceX + cornerRadius},${midY}`;
    path += ` L ${targetX - cornerRadius},${midY}`;
    path += ` Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
  } else if (curveFromLeft) {
    // Curve from left-side branch
    path += ` Q ${sourceX},${midY} ${sourceX - cornerRadius},${midY}`;
    path += ` L ${targetX + cornerRadius},${midY}`;
    path += ` Q ${targetX},${midY} ${targetX},${midY + cornerRadius}`;
  }

  // Final vertical drop to target
  path += ` L ${targetX},${targetY}`;

  const arc = 12;

  // Handle click for adding a node inside the branch
  const handleBranchPlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Show app selector for adding a node inside this branch
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom });
    setSelectorType('action');
    
    // Set context for adding action inside a branch
    // This will be used in the WorkflowActionManager's addActionAtBranchEnd method
    onConditionalEndPlusClick(branchIndex, e);
  };

  // Handle click for adding a node at the merge point
  const handleMergePointPlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Show app selector for adding a node at merge point
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom });
    setEdgeId(id);
    setSelectorType('action');
    setShowAppSelector(true);
  };

  return (
    <>
      <BaseEdge
        path={path}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 1.5,
          stroke: '#d1d5db',
        }}
      />

      {/* Plus button inside the branch (only shown if isNextStepEmpty is true) */}
      {data?.isNextStepEmpty && (
        <foreignObject
          x={sourceX - arc}
          y={sourceY + arc + 20}
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
            onClick={handleBranchPlusClick}
          >
            <button className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-100">
              <Plus size={12} />
            </button>
          </div>
        </foreignObject>
      )}

      {/* Plus button at the merge point (always shown) */}
      <foreignObject
        x={targetX - arc}
        y={targetY - arc - 30}
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
          onClick={handleMergePointPlusClick}
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
    // e.stopPropagation();
    // const rect = (e.target as HTMLElement).getBoundingClientRect();
    // setSelectorPosition({ x: rect.left, y: rect.bottom });
    // setEdgeId(id);
    // setSelectorType('action');
    // setShowAppSelector(true);
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


  return (

    <div className={`node rounded-xl trigger-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className={` py-2 px-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
              ⚡
            </div>
            <span className="font-medium text-blue-700 text-sm">{selectedApp?.name ?? 'Unknown'}</span>
          </div>
          <span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Trigger</span>
        </div>
        <div className="p-3 flex gap-x-4 gap-4 w-full">
          {selectedApp?.icon && <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${selectedApp?.color || "bg-gray-100"}`}>
            {selectedApp?.icon}
          </div>}
          <div className='w-full flex flex-col items-start'>

            <h3 className="font-medium text-sm mb-1">{data?.label}</h3>

            <p className="text-muted-foreground   text-justify text-xs">{data?.description}</p>
            {!configured && <p className='w-full flex justify-end'>
              <CircleAlert size={15} className='text-yellow-300' />
            </p>}
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
const ActionNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  const { app, configured } = data;

  const selectedApp = SAMPLE_APPS[app];



  return (
    <div className={`node rounded-xl action-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className={`py-2 px-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
              ⚙️
            </div>
            <span className="font-medium text-green-700 text-sm">{selectedApp?.name}</span>
          </div>
          <span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Action</span>
        </div>
        <div className="p-3 flex gap-x-4 gap-4">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-lg ${selectedApp?.color || "bg-gray-100"}`}>
            {selectedApp?.icon}
          </div>
          <div className='flex flex-col items-start'>
            <h3 className="font-medium text-sm mb-1">{data?.label}</h3>
            <p className="text-muted-foreground   text-justify text-xs">{data?.description}</p>
            {!configured && <p className='w-full flex justify-end'>

              <CircleAlert size={15} className='text-yellow-300' />
            </p>}
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="handle target-handle"
          style={{
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />

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


const ConditionNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  const { branches = [], configured } = data;

  return (
    <div className={`node rounded-xl condition-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className={`py-2 px-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
              🔀
            </div>
            <span className="font-medium text-amber-600 text-sm">Condition</span>
          </div>
          <span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Logic</span>
        </div>
        <div className="p-3 flex gap-x-4 gap-4">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-lg bg-amber-100`}>
            <GitBranch size={20} className="text-amber-600" />
          </div>
          <div className='flex flex-col items-start'>
            <h3 className="font-medium text-sm mb-1">{data?.label || "Condition"}</h3>
            <p className="text-muted-foreground text-justify text-xs">{data?.description || "Route workflow based on conditions"}</p>
            {!configured && <p className='w-full flex justify-end'>
              <CircleAlert size={15} className='text-yellow-300' />
            </p>}
           
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="handle target-handle"
          style={{
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />

        {/* Create a dynamic source handle for each branch */}
        {/* {branches && branches.map((branch, index) => {
          const numberOfBranches = branches.length;
          const segmentWidth = 1 / numberOfBranches;
          const position = segmentWidth * (index + 0.5);
          
          return (
            <Handle
              key={index}
              type="source"
              position={Position.Bottom}
              id={`branch-${index}`}
              style={{
                bottom: -6,
                left: `${position * 100}%`,
                width: 12,
                height: 12,
                background: '#f59e0b', // amber color for condition branches
                borderRadius: '50%',
                border: '2px solid white'
              }}
            />
          );
        })} */}

        {/* If no branches defined, show a default source handle */}
      
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
              background: '#f59e0b',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          />
      
      </div>
    </div>
  );
}

const AddButtonNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div
      className=" w-[280px]  rounded-full bg-transparent flex items-center justify-center cursor-pointer "
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div className="">
        <Button>
          +
        </Button>
        </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ background: '#555', visibility: 'hidden' }}
      />
    </div>
  );
};

const EndNode = ({ data }) => {
  console.log('end', { data })
  const nodes = useNodes()
  const edges = useEdges()

  console.log('end nodes', edges?.filter((d) => d.target === data.id))
  return (

    <div  className="w-[280px] px-6 py-2 mt-4 rounded-full  flex justify-center items-center  font-medium ">
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

  const currentEdge = edge.find((d: any) => d.source === props.id)
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


class NodeFactory {
  static createNode(id: string, type: keyof typeof NODE_TYPES, data: Partial<NodeData> = {}): Node {
    return {
      id,
      type: NODE_TYPES[type],
      position: { x: 0, y: 0 },
      data: {
        label: '',
        configured: false,
        ...data,
        nodeId: id,
      },
    };
  }

  static createTriggerNode(id: string, data: Partial<NodeData> = {}): Node {
    return this.createNode(id, 'TRIGGER', {
      label: 'Empty Trigger',
      description: 'Click to configure this trigger',
      ...data,
    });
  }

  static createActionNode(id: string, appData: AppData, actionKey: string, data: Partial<NodeData> = {}): Node {
    const action = appData.actions[actionKey];
    return this.createNode(id, 'ACTION', {
      app: appData.id,
      action: actionKey,
      label: action.label,
      description: action.description,
      ...data,
    });
  }

  static createConditionNode(id: string, appData: AppData, actionKey: string, branches: BranchData[]): Node {
    const action = appData.actions[actionKey];
    return this.createNode(id, 'CONDITION', {
      app: appData.id,
      action: actionKey,
      label: action.label,
      description: action.description,
      branches,
    });
  }

  static createAddButtonNode(id: string, parentNodeId: string, branchData: Partial<BranchData> = {}): Node {
    return this.createNode(id, 'ADD_BUTTON', {
      label: '+',
      parentNode: parentNodeId,
      ...branchData,
    });
  }

  static createEndNode(id: string = 'end'): Node {
    return this.createNode(id, 'END', {
      label: 'End',
    });
  }
}

// Edge Factory Class
class EdgeFactory {
  static createEdge(
    sourceId: string,
    targetId: string,
    type= 'custom',
    data: EdgeData = {}
  ): Edge {
    return {
      id: `e-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: EDGE_TYPES[type],
      markerEnd: { type: MarkerType.ArrowClosed },
      data,
    };
  }

  static createConditionalStartEdge(sourceId: string, targetId: string, branchData: BranchData): Edge {
    return this.createEdge(sourceId, targetId, EDGE_TYPES.CONDITIONAL_START, {
      branchLabel: branchData.branchName,
      branchIndex: branchData.branchIndex,
      branchCount: branchData.branchCount,
    });
  }

  static createConditionalEndEdge(sourceId: string, targetId: string, branchData: BranchData): Edge {
    return this.createEdge(sourceId, targetId, EDGE_TYPES.CONDITIONAL_END, {
      branchLabel: branchData.branchName,
      branchIndex: branchData.branchIndex,
      branchCount: branchData.branchCount,
    });
  }
}

// Branch Manager Class
class BranchManager {
  static createBranches(branchNames: string[] = ['Yes', 'No']): BranchData[] {
    const timestamp = Date.now();
    return branchNames.map((name, index) => ({
      branchName: name,
      branchId: `branch-${timestamp}-${index}`,
      branchIndex: index,
      branchCount: branchNames.length,
    }));
  }

  static createBranchStructure(
    conditionNodeId: string,
    branches: BranchData[],
    targetNodeId?: string
  ): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    branches.forEach((branch) => {
      const addButtonId = `addButton-${branch.branchIndex}-${Date.now()}`;
      const addButtonNode = NodeFactory.createAddButtonNode(addButtonId, conditionNodeId, branch);
      nodes.push(addButtonNode);

      // Condition to AddButton edge
      const conditionToAddButtonEdge = EdgeFactory.createConditionalStartEdge(
        conditionNodeId,
        addButtonId,
        branch
      );
      edges.push(conditionToAddButtonEdge);

      // AddButton to target edge (if target exists)
      if (targetNodeId) {
        const addButtonToTargetEdge = EdgeFactory.createConditionalEndEdge(
          addButtonId,
          targetNodeId,
          branch
        );
        edges.push(addButtonToTargetEdge);
      }
    });

    return { nodes, edges };
  }
}

// Workflow Actions Manager
class WorkflowActionManager {
  private setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  private setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  private apps: Record<string, AppData>;

  constructor(
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    apps: Record<string, AppData>
  ) {
    this.setNodes = setNodes;
    this.setEdges = setEdges;
    this.apps = apps;
  }

  // Generate unique node ID
  private generateNodeId(type: string): string {
    return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Update existing trigger node
  updateTriggerNode(nodeId: string, appId: string, triggerKey: string): void {
    const app = this.apps[appId];
    const trigger = app.triggers[triggerKey];
    
    this.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                app: appId,
                trigger: triggerKey,
                label: trigger.label,
                description: trigger.description,
                configured: false, // Will be configured in sidebar
              },
            }
          : node
      )
    );
  }

  // Create action node by replacing edge
  createActionOnEdge(
    edgeId: string,
    appId: string,
    actionKey: string,
    allNodes: Node[],
    allEdges: Edge[]
  ): void {
    const targetEdge = allEdges.find((e) => e.id === edgeId);
    if (!targetEdge) return;

    const app = this.apps[appId];
    const isCondition = actionKey === 'condition';
    const newNodeId = this.generateNodeId(isCondition ? 'condition' : 'action');

    if (isCondition) {
      this.createConditionNodeOnEdge(targetEdge, app, actionKey, newNodeId);
    } else {
      this.createActionNodeOnEdge(targetEdge, app, actionKey, newNodeId);
    }
  }

  private createActionNodeOnEdge(
    targetEdge: Edge,
    app: AppData,
    actionKey: string,
    newNodeId: string
  ): void {
    const newActionNode = NodeFactory.createActionNode(newNodeId, app, actionKey);
    
    this.setNodes((nodes) => [...nodes, newActionNode]);
    
    this.setEdges((edges) => {
      const filteredEdges = edges.filter((e) => e.id !== targetEdge.id);
      const newEdges = [
        EdgeFactory.createEdge(targetEdge.source, newNodeId),
        EdgeFactory.createEdge(newNodeId, targetEdge.target),
      ];
      return [...filteredEdges, ...newEdges];
    });
  }

  private createConditionNodeOnEdge(
    targetEdge: Edge,
    app: AppData,
    actionKey: string,
    newNodeId: string
  ): void {
    const branches = BranchManager.createBranches();
    const newConditionNode = NodeFactory.createConditionNode(
      newNodeId,
      app,
      actionKey,
      branches
    );
    
    const { nodes: branchNodes, edges: branchEdges } = BranchManager.createBranchStructure(
      newNodeId,
      branches,
      targetEdge.target
    );
    
    this.setNodes((nodes) => [...nodes, newConditionNode, ...branchNodes]);
    
    this.setEdges((edges) => {
      const filteredEdges = edges.filter((e) => e.id !== targetEdge.id);
      const sourceToConditionEdge = EdgeFactory.createEdge(
        targetEdge.source,
        newNodeId
      );
      return [...filteredEdges, sourceToConditionEdge, ...branchEdges];
    });
  }

  // Replace add button node with action
  replaceAddButtonWithAction(
    nodeId: string,
    appId: string,
    actionKey: string,
    allNodes: Node[],
    allEdges: Edge[]
  ): void {
    const addButtonNode = allNodes.find((n) => n.id === nodeId);
    if (!addButtonNode) return;

    const app = this.apps[appId];
    const isCondition = actionKey === 'condition';
    const newNodeId = this.generateNodeId(isCondition ? 'condition' : 'action');

    // Get connected edges
    const incomingEdge = allEdges.find((e) => e.target === nodeId);
    const outgoingEdge = allEdges.find((e) => e.source === nodeId);

    if (isCondition) {
      this.replaceAddButtonWithCondition(
        addButtonNode,
        app,
        actionKey,
        newNodeId,
        incomingEdge,
        outgoingEdge
      );
    } else {
      this.replaceAddButtonWithActionNode(
        addButtonNode,
        app,
        actionKey,
        newNodeId,
        incomingEdge,
        outgoingEdge
      );
    }
  }

  private replaceAddButtonWithActionNode(
    addButtonNode: Node,
    app: AppData,
    actionKey: string,
    newNodeId: string,
    incomingEdge?: Edge,
    outgoingEdge?: Edge
  ): void {
    const newActionNode = NodeFactory.createActionNode(newNodeId, app, actionKey, {
      parentNode: addButtonNode.data.parentNode,
      branchLabel: addButtonNode.data.branchLabel,
    });
    
    this.setNodes((nodes) => [
      ...nodes.filter((n) => n.id !== addButtonNode.id),
      newActionNode,
    ]);
    
    this.setEdges((edges) => {
      const filteredEdges = edges.filter(
        (e) => e.source !== addButtonNode.id && e.target !== addButtonNode.id
      );
      const newEdges = [];
      
      if (incomingEdge) {
        const newIncomingEdge = EdgeFactory.createEdge(
          incomingEdge.source,
          newNodeId,
          incomingEdge.type === EDGE_TYPES.CONDITIONAL_START ? EDGE_TYPES.CONDITIONAL_START : EDGE_TYPES.CUSTOM,
          incomingEdge.data
        );
        newEdges.push(newIncomingEdge);
      }
      
      if (outgoingEdge) {
        const newOutgoingEdge = EdgeFactory.createEdge(
          newNodeId,
          outgoingEdge.target,
          outgoingEdge.type === EDGE_TYPES.CONDITIONAL_END ? EDGE_TYPES.CONDITIONAL_END : EDGE_TYPES.CUSTOM,
          outgoingEdge.data
        );
        newEdges.push(newOutgoingEdge);
      }
      
      return [...filteredEdges, ...newEdges];
    });
  }

  private replaceAddButtonWithCondition(
    addButtonNode: Node,
    app: AppData,
    actionKey: string,
    newNodeId: string,
    incomingEdge?: Edge,
    outgoingEdge?: Edge
  ): void {
    const branches = BranchManager.createBranches();
    const newConditionNode = NodeFactory.createConditionNode(
      newNodeId,
      app,
      actionKey,
      branches
    );
    
    const { nodes: branchNodes, edges: branchEdges } = BranchManager.createBranchStructure(
      newNodeId,
      branches,
      outgoingEdge?.target
    );
    
    this.setNodes((nodes) => [
      ...nodes.filter((n) => n.id !== addButtonNode.id),
      newConditionNode,
      ...branchNodes,
    ]);
    
    this.setEdges((edges) => {
      const filteredEdges = edges.filter(
        (e) => e.source !== addButtonNode.id && e.target !== addButtonNode.id
      );
      const newEdges = [];
      
      if (incomingEdge) {
        const sourceToConditionEdge = EdgeFactory.createEdge(
          incomingEdge.source,
          newNodeId,
          incomingEdge.type === EDGE_TYPES.CONDITIONAL_START ? EDGE_TYPES.CONDITIONAL_START : EDGE_TYPES.CUSTOM,
          incomingEdge.data
        );
        newEdges.push(sourceToConditionEdge);
      }
      
      return [...filteredEdges, ...newEdges, ...branchEdges];
    });
  }

  // Add action at the end of a conditional branch
  addActionAtBranchEnd(
    branchIndex: number,
    appId: string,
    actionKey: string,
    allNodes: Node[],
    allEdges: Edge[]
  ): void {
    const app = this.apps[appId];
    const isCondition = actionKey === 'condition';
    const newNodeId = this.generateNodeId(isCondition ? 'condition' : 'action');

    // Find all conditional end edges for this branch
    const branchEndEdges = allEdges.filter(
      (e) => 
        e.type === EDGE_TYPES.CONDITIONAL_END && 
        e.data?.branchIndex === branchIndex
    );
    
    if (branchEndEdges.length === 0) return;

    // Get target node (usually 'end')
    const targetNodeId = branchEndEdges[0].target;
    const branchData = branchEndEdges[0].data;

    // Create the appropriate node type
    if (isCondition) {
      // Create condition node with its own branches
      const branches = BranchManager.createBranches();
      const newConditionNode = NodeFactory.createConditionNode(
        newNodeId,
        app,
        actionKey,
        branches
      );
      
      const { nodes: branchNodes, edges: newBranchEdges } = BranchManager.createBranchStructure(
        newNodeId,
        branches,
        targetNodeId
      );
      
      this.setNodes((nodes) => [...nodes, newConditionNode, ...branchNodes]);
      
      // Update edges - connect all branch sources to new condition node
      this.setEdges((edges) => {
        const filteredEdges = edges.filter((e) => !branchEndEdges.includes(e));
        const newEdges = [];
        
        // Create edges from all branch sources to new node
        branchEndEdges.forEach((edge) => {
          const sourceToNewNodeEdge = EdgeFactory.createEdge(
            edge.source,
            newNodeId,
            EDGE_TYPES.CONDITIONAL_END,
            {
              ...edge.data,
              isNextStepEmpty: false, // Mark that this branch now has a node
            }
          );
          newEdges.push(sourceToNewNodeEdge);
        });
        
        return [...filteredEdges, ...newEdges, ...newBranchEdges];
      });
    } else {
      // Create action node
      const newActionNode = NodeFactory.createActionNode(newNodeId, app, actionKey, {
        branchLabel: branchData?.branchLabel,
      });
      
      this.setNodes((nodes) => [...nodes, newActionNode]);
      
      // Update edges
      this.setEdges((edges) => {
        const filteredEdges = edges.filter((e) => !branchEndEdges.includes(e));
        const newEdges = [];
        
        // Create edges from all branch sources to new node
        branchEndEdges.forEach((edge) => {
          const sourceToNewNodeEdge = EdgeFactory.createEdge(
            edge.source,
            newNodeId,
            EDGE_TYPES.CONDITIONAL_END,
            {
              ...edge.data,
              isNextStepEmpty: false, // Mark that this branch now has a node
            }
          );
          newEdges.push(sourceToNewNodeEdge);
        });
        
        // Create edge from new node to target
        const newNodeToTargetEdge = EdgeFactory.createEdge(
          newNodeId,
          targetNodeId,
         EDGE_TYPES.CONDITIONAL_END,
          {
            branchLabel: branchData?.branchLabel,
            branchIndex: branchData?.branchIndex,
            branchCount: branchData?.branchCount
          }
        );
        newEdges.push(newNodeToTargetEdge);
        
        return [...filteredEdges, ...newEdges];
      });
    }
  }

  // Add an action at the merge point (where all branches converge)
  addActionAtMergePoint(
    edgeId: string,
    appId: string,
    actionKey: string,
    allNodes: Node[],
    allEdges: Edge[]
  ): void {
    const edge = allEdges.find(e => e.id === edgeId);
    if (!edge || edge.type !== EDGE_TYPES.CONDITIONAL_END) return;
    
    // Find the parent condition node
    const branchIndex = edge.data?.branchIndex;
    const branchCount = edge.data?.branchCount;
    
    if (branchIndex === undefined || branchCount === undefined) return;
    
    const app = this.apps[appId];
    const isCondition = actionKey === 'condition';
    const newNodeId = this.generateNodeId(isCondition ? 'condition' : 'action');
    
    // Find all edges from the same condition (all branches)
    // We need all branches that are part of the same condition group
    const relatedEdges = allEdges.filter(e => 
      e.type === EDGE_TYPES.CONDITIONAL_END && 
      e.data?.branchCount === branchCount &&
      // Same target node (they all end at the same place)
      e.target === edge.target
    );
    
    // The target node where all branches converge
    const targetNodeId = edge.target;
    
    if (isCondition) {
      // Create a new condition node
      const branches = BranchManager.createBranches();
      const newConditionNode = NodeFactory.createConditionNode(
        newNodeId,
        app, 
        actionKey,
        branches
      );
      
      const { nodes: branchNodes, edges: branchEdges } = BranchManager.createBranchStructure(
        newNodeId,
        branches,
        targetNodeId
      );
      
      this.setNodes(nodes => [...nodes, newConditionNode, ...branchNodes]);
      
      // Update edges
      this.setEdges(edges => {
        // Keep all edges except the original branch-to-target edges
        const filteredEdges = edges.filter(e => !relatedEdges.includes(e));
        const newEdges = [];
        
        // For each original branch
        relatedEdges.forEach(branchEdge => {
          // Create a new edge from branch to new condition node
          const sourceToConditionEdge = EdgeFactory.createEdge(
            branchEdge.source,
            newNodeId,
            'CUSTOM',
            {
              // Preserve original branch data except for target info
              branchLabel: branchEdge.data?.branchLabel,
            }
          );
          newEdges.push(sourceToConditionEdge);
        });
        
        // Return all edges: filtered + new branch-to-condition + condition branch structure
        return [...filteredEdges, ...newEdges, ...branchEdges];
      });
    } else {
      // Create a new action node
      const newActionNode = NodeFactory.createActionNode(
        newNodeId,
        app,
        actionKey
      );
      
      this.setNodes(nodes => [...nodes, newActionNode]);
      
      // Update edges
      this.setEdges(edges => {
        // Keep all edges except the original branch-to-target edges
        const filteredEdges = edges.filter(e => !relatedEdges.includes(e));
        const newEdges = [];
        
        // For each original branch
        relatedEdges.forEach(branchEdge => {
          // Create a new edge from branch to new action node
          const sourceToActionEdge = EdgeFactory.createEdge(
            branchEdge.source,
            newNodeId,
            EDGE_TYPES.CUSTOM,
            {
              // Preserve original branch data except for target info
              branchLabel: branchEdge.data?.branchLabel,
            }
          );
          newEdges.push(sourceToActionEdge);
        });
        
        // Create edge from new action node to original target
        const actionToTargetEdge = EdgeFactory.createEdge(
          newNodeId,
          targetNodeId
        );
        newEdges.push(actionToTargetEdge);
        
        // Return all edges: filtered + new connections
        return [...filteredEdges, ...newEdges];
      });
    }
  }
}

// Hook for workflow management
export const useWorkflowActions = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  apps: Record<string, AppData>
) => {
  const actionManager = useMemo(
    () => new WorkflowActionManager(setNodes, setEdges, apps),
    [setNodes, setEdges, apps]
  );
  return actionManager;
};
const WorkflowBuilder = () => {
 // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([
    NodeFactory.createTriggerNode('trigger-1'),
    NodeFactory.createEndNode(),
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    EdgeFactory.createEdge('trigger-1', 'end'),
  ]);

  // UI state
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });
  const [selectorType, setSelectorType] = useState<'trigger' | 'action'>('trigger');
  const [currentContext, setCurrentContext] = useState<{
    nodeId?: string;
    edgeId?: string;
    branchIndex?: number;
    action: 'UPDATE_TRIGGER' | 'CREATE_ON_EDGE' | 'REPLACE_ADD_BUTTON' | 'ADD_AT_BRANCH_END' | 'ADD_AT_MERGE_POINT';
  } | null>(null);

  // Configuration state
  const [showConfigSidebar, setShowConfigSidebar] = useState(false);
  const [configData, setConfigData] = useState<any>(null);

  // Get workflow actions manager
  const workflowActions = useWorkflowActions(setNodes, setEdges, SAMPLE_APPS);

  // Handle app selection
  const handleAppSelect = (appId: string, itemKey: string) => {
    if (!currentContext) return;
    setShowAppSelector(false);
    
    switch (currentContext.action) {
      case 'UPDATE_TRIGGER':
        if (currentContext.nodeId) {
          workflowActions.updateTriggerNode(currentContext.nodeId, appId, itemKey);
          setConfigData({
            nodeId: currentContext.nodeId,
            appId,
            key: itemKey,
            type: 'trigger',
          });
          setShowConfigSidebar(true);
        }
        break;
        
      case 'CREATE_ON_EDGE':
        if (currentContext.edgeId) {
          workflowActions.createActionOnEdge(currentContext.edgeId, appId, itemKey, nodes, edges);
          // Set config for the new node (will be handled in effect)
        }
        break;
        
      case 'REPLACE_ADD_BUTTON':
        if (currentContext.nodeId) {
          workflowActions.replaceAddButtonWithAction(currentContext.nodeId, appId, itemKey, nodes, edges);
        }
        break;
        
      case 'ADD_AT_BRANCH_END':
        if (currentContext.branchIndex !== undefined) {
          workflowActions.addActionAtBranchEnd(currentContext.branchIndex, appId, itemKey, nodes, edges);
        }
        break;
        
      case 'ADD_AT_MERGE_POINT':
        if (currentContext.edgeId) {
          workflowActions.addActionAtMergePoint(currentContext.edgeId, appId, itemKey, nodes, edges);
        }
        break;
    }
    
    setCurrentContext(null);
  };

  // Handle node clicks
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === NODE_TYPES.TRIGGER && !node.data.configured) {
      const rect = (event.target as Element).getBoundingClientRect();
      setSelectorPosition({ x: rect.left, y: rect.bottom });
      setSelectorType('trigger');
      setCurrentContext({
        nodeId: node.id,
        action: 'UPDATE_TRIGGER',
      });
      setShowAppSelector(true);
    } else if (node.type === NODE_TYPES.ADD_BUTTON) {
      const rect = (event.target as Element).getBoundingClientRect();
      setSelectorPosition({ x: rect.left, y: rect.bottom });
      setSelectorType('action');
      setCurrentContext({
        nodeId: node.id,
        action: 'REPLACE_ADD_BUTTON',
      });
      setShowAppSelector(true);
    }
  }, []);

  // Handle edge clicks
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const rect = (event.target as Element).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom });
    setSelectorType('action');
    setCurrentContext({
      edgeId: edge.id,
      action: 'CREATE_ON_EDGE',
    });
    setShowAppSelector(true);
  }, []);

  // Handle plus button clicks on conditional end edges
  const handleConditionalEndPlusClick = useCallback((branchIndex: number, event: React.MouseEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom });
    setSelectorType('action');
    setCurrentContext({
      branchIndex,
      action: 'ADD_AT_BRANCH_END',
    });
    setShowAppSelector(true);
  }, []);

  // Handle plus button clicks at merge point
  const handleMergePointPlusClick = useCallback((edgeId: string, event: React.MouseEvent) => {
    const rect = (event.target as Element).getBoundingClientRect();
    setSelectorPosition({ x: rect.left, y: rect.bottom });
    setSelectorType('action');
    setCurrentContext({
      edgeId,
      action: 'ADD_AT_MERGE_POINT',
    });
    setShowAppSelector(true);
  }, []);

  // Layout effect
  useEffect(() => {
    const layoutedNodes = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
  }, [nodes.length, edges.length]);


  return (
    <WorkflowContext.Provider
      value={{
        apps: SAMPLE_APPS,
        nodes,
        edges,
        setNodes,
        setEdges,
        setShowAppSelector,
        setSelectorPosition,
        setSelectorType,
        setCurrentNodeId: () => {},
        setParentNode: () => {},
        setBranchLabel: () => {},
        setEdgeId: () => {},
        onConditionalEndPlusClick: handleConditionalEndPlusClick,
      }}
    >
      <div className="h-screen w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
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
            appId={configData.appId}
            itemKey={configData.key}
            itemType={configData.type}
            onSave={(config) => {
              setShowConfigSidebar(false);
              // Handle configuration save
            }}
            onCancel={() => setShowConfigSidebar(false)}
          />
        )}
      </div>
    </WorkflowContext.Provider>
  );
};

export default WorkflowBuilder;