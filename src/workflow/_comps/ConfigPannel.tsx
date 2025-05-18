
import { X, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWorkflow } from '../context/workflowContext';
import { SAMPLE_APPS } from '../workflow-data';
import { toast } from 'sonner';


interface FieldConfig {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
}

interface ConfigType {
  fields: FieldConfig[];
}

interface TriggerOrActionConfig {
  key: string;
  label: string;
  description: string;
  appId: string;
  config: ConfigType;
}

interface ConfigPanelProps {
  onConfigSave?: (config: Record<string, any>) => void;
}

const ConfigPanel = ({ onConfigSave }: ConfigPanelProps) => {
  const { nodes, selectedNode, updateNodeData, selectNode } = useWorkflow();
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  
  // Reset config values when selected node changes
  useEffect(() => {
    if (!selectedNode) return;
    
    const node = nodes.find(n => n.id === selectedNode);
    if (node && node.data && node.data.config) {
      setConfigValues(node.data.config);
    } else {
      setConfigValues({});
    }
  }, [selectedNode, nodes]);
  
  if (!selectedNode) return null;

  const node = nodes.find(n => n.id === selectedNode);
  if (!node) return null;

  const nodeData = node.data;
  const nodeType = node.type as string;
  
  // Find app and trigger/action details
  const app = nodeData.appId ? SAMPLE_APPS[nodeData.appId as keyof typeof SAMPLE_APPS] : null;
  
  let actionOrTrigger: TriggerOrActionConfig | null = null;
  
  if (app && nodeData.type) {
    if (nodeType === 'trigger' && app.triggers) {
      actionOrTrigger = app.triggers[nodeData.type as keyof typeof app.triggers] as TriggerOrActionConfig;
    } else if (app && app.actions) {
      actionOrTrigger = app.actions[nodeData.type as keyof typeof app.actions] as TriggerOrActionConfig;
    }
  }

  const handleClosePanel = () => {
    selectNode(null);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfigValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = () => {
    // If we have an external save handler, use it
    if (onConfigSave) {
      onConfigSave(configValues);
    } else {
      // Otherwise update node data directly with new config values
      updateNodeData(selectedNode, {
        ...nodeData,
        config: {
          ...nodeData.config,
          ...configValues
        }
      });
      
      toast.success('Configuration saved');
    }
  };

  const handleTestNode = () => {
    toast.info('Testing node...');
    // In a real app, this would send a test request to the server
  };

  // Render different content based on node type
  if (nodeType === 'default') {
    return (
      <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full z-10 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Configuration</h2>
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Close Panel"
            onClick={handleClosePanel}
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="mb-4">
            <h3 className="font-medium">End Node</h3>
            <p className="text-xs text-gray-500 mt-1">This node represents the end of the workflow.</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full z-10 shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Configuration</h2>
        <button 
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="Close Panel"
          onClick={handleClosePanel}
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {app && actionOrTrigger ? (
          <div className="mb-4">
            <div className="flex items-center mb-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${app.color} text-${app.id}-500 mr-2`}>
                <span className="text-lg">{app.icon}</span>
              </div>
              <div>
                <h3 className="font-medium">{app.name}: {actionOrTrigger.label}</h3>
                <p className="text-xs text-gray-500">{actionOrTrigger.description}</p>
              </div>
            </div>

            {app.id === 'gmail' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  This trigger needs to be authenticated. <a href="#" className="text-primary-600 hover:text-primary-700 underline">Connect Gmail</a>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {actionOrTrigger.config?.fields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text" 
                      placeholder={field.placeholder} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      defaultValue={configValues[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    />
                  )}

                  {field.type === 'select' && (
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      defaultValue={configValues[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'textarea' && (
                    <textarea 
                      placeholder={field.placeholder} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      defaultValue={configValues[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        defaultChecked={configValues[field.key] || false}
                        onChange={(e) => handleConfigChange(field.key, e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                    </label>
                  )}

                  {field.description && (
                    <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </div>

            {nodeType === 'trigger' && (
              <div className="border-t border-gray-200 pt-4 mt-4 mb-4">
                <h3 className="font-medium text-sm mb-2">Test Output</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="text-xs font-mono overflow-x-auto">
                    <pre>{JSON.stringify({
                      from: "sender@example.com",
                      to: "me@gmail.com",
                      subject: "Weekly Report",
                      body: "Please find attached...",
                      attachments: [],
                      date: "2023-05-15T09:30:00Z"
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            No configuration options available for this node.
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <button 
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button 
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleTestNode}
          >
            Test
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ConfigPanel;
