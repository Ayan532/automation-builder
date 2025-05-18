import { memo, useCallback, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SAMPLE_APPS } from '../workflow-data';
import { useWorkflow } from '../context/workflowContext';
import { PlusCircle } from 'lucide-react';


interface TriggerConfig {
  key: string;
  label: string;
  description: string;
  appId: string;
  config: {
    fields: Array<{
      key: string;
      label: string;
      type: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
    }>;
  };
}

const TriggerNode = ({ id, data, selected }: NodeProps) => {
  const { updateNodeData, addTriggerNode } = useWorkflow();
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [showTriggerMenu, setShowTriggerMenu] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  
  const handleAddNewTrigger = useCallback(() => {
    // Use a fixed position offset from the current node
    // This ensures the position doesn't depend on the node's position prop
    addTriggerNode({ x: 550, y: 100 });
  }, [addTriggerNode]);
  
  const app = data.appId ? SAMPLE_APPS[data.appId as keyof typeof SAMPLE_APPS] : null;
  let trigger: TriggerConfig | null = null;
  
  if (app?.triggers && data.type) {
    trigger = app.triggers[data.type as keyof typeof app.triggers] as TriggerConfig;
  }
  
  const appColor = app?.color || 'bg-gray-100';
  const appIcon = app?.icon || '⚡';
  
  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
    setShowAppMenu(false);
    setShowTriggerMenu(true);
  };
  
  const handleTriggerSelect = (appId: string, triggerKey: string) => {
    const app = SAMPLE_APPS[appId as keyof typeof SAMPLE_APPS];
    if (!app || !app.triggers) return;
    
    const triggerData = (app.triggers as Record<string, any>)[triggerKey];
    if (!triggerData) return;
    
    updateNodeData(id, {
      appId: appId,
      type: triggerKey,
      name: triggerData.label,
      description: triggerData.description,
      config: {},
      isEmpty: false
    });
    
    setShowTriggerMenu(false);
    setSelectedApp(null);
  };
  
  // If no app data is available, show a placeholder with app selection
  if (!app || !trigger) {
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
            onClick={() => setShowAppMenu(true)}
          >
            <h3 className="font-medium text-sm mb-1">Empty Trigger</h3>
            <p className="text-xs text-gray-500">Click to configure this trigger</p>
          </div>
          
          {/* App selection dropdown */}
          {showAppMenu && (
            <div 
              className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
              style={{ minWidth: '220px' }}
            >
              <div className="p-2 border-b border-gray-200 font-medium text-sm">
                Select App
              </div>
              <div className="max-h-60 overflow-y-auto">
                {Object.values(SAMPLE_APPS).map((app) => (
                  app.triggers && Object.keys(app.triggers).length > 0 && (
                    <div 
                      key={app.id}
                      className="p-2 hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => handleAppSelect(app.id)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${app.color}`}>
                        <span>{app.icon}</span>
                      </div>
                      <span className="text-sm">{app.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {/* Trigger selection dropdown */}
          {showTriggerMenu && selectedApp && (
            <div 
              className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
              style={{ minWidth: '220px' }}
            >
              <div className="p-2 border-b border-gray-200 font-medium text-sm">
                Select Trigger
              </div>
              <div className="max-h-60 overflow-y-auto">
                {Object.entries((SAMPLE_APPS[selectedApp as keyof typeof SAMPLE_APPS]?.triggers || {}) as Record<string, any>).map(([key, trigger]) => (
                  <div 
                    key={key}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleTriggerSelect(selectedApp, key)}
                  >
                    <div className="font-medium text-sm">{trigger.label}</div>
                    <div className="text-xs text-gray-500">{trigger.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Handle
            type="source"
            position={Position.Bottom}
            id="a"
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
    <div className={`node trigger-node ${selected ? 'selected' : ''}`} style={{ position: 'relative' }}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className={`${appColor} py-2 px-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-blue-500">
              <span className="text-xs">{appIcon}</span>
            </div>
            <span className="font-medium text-blue-700 text-sm">{app.name}</span>
          </div>
          <span className="text-xs font-medium bg-white text-blue-600 px-1.5 py-0.5 rounded">Trigger</span>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm mb-1">{trigger.label}</h3>
          <p className="text-xs text-gray-500 mb-2">{trigger.description}</p>
          
          {trigger.config?.fields && (
            <>
              <div className="text-xs text-gray-500 mb-1">Configuration</div>
              <div className="space-y-2">
                {trigger.config.fields.slice(0, 2).map((field) => (
                  <div key={field.key} className="flex items-center">
                    <label className="w-1/3 text-xs text-gray-600">{field.label}:</label>
                    <input 
                      type="text" 
                      readOnly
                      value={data.config?.[field.key] || ''}
                      placeholder={field.placeholder} 
                      className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Add Trigger Button */}
        <div className="absolute right-0 top-1/2 translate-x-10 -translate-y-1/2" title="Add New Trigger">
          <button 
            className="flex items-center space-x-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md cursor-pointer transition-colors"
            onClick={handleAddNewTrigger}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Add Trigger</span>
          </button>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
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

export default memo(TriggerNode);
