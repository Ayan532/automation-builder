import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from 'reactflow';

import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { SAMPLE_APPS } from '../workflow-data';

interface ActionConfig {
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

const ActionNode = ({ data, selected }: NodeProps) => {
  const app = data.appId ? SAMPLE_APPS[data.appId as keyof typeof SAMPLE_APPS] : null;
  let action: ActionConfig | null = null;
  
  if (app?.actions && data.type) {
    action = app.actions[data.type as keyof typeof app.actions] as ActionConfig;
  }
  
  const appColor = app?.color || 'bg-gray-100';
  const appIcon = app?.icon || '⚡';

  // If no app data is available, show a placeholder
  if (!app || !action) {
    return (
      <div className={`node action-node ${selected ? 'selected' : ''}`}>
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 py-2 px-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-white text-gray-500">
                ⚡
              </div>
              <span className="font-medium text-gray-700 text-sm">Unknown</span>
            </div>
            <span className="text-xs font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded">Action</span>
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm mb-1">Empty Action</h3>
            <p className="text-xs text-gray-500">Configure this action node</p>
          </div>
          <Handle
            type="target"
            position={Position.Top}
            id="target"
            className="handle target-handle"
            style={{ 
              top: -6, 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: 12,
              height: 12,
              background: '#9ca3af',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="source"
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
    <div className={`node action-node ${selected ? 'selected' : ''}`}>
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      
        <div className={`${appColor} py-2 px-3 flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white">
              <span className="text-xs">{appIcon}</span>
            </div>
            <span className="font-medium text-sm">{app.name}</span>
          </div>
          <span className="text-xs font-medium bg-white px-1.5 py-0.5 rounded">Action</span>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm mb-1">{action.label}</h3>
          <p className="text-xs text-gray-500 mb-2">{action.description}</p>
          
          {action.config?.fields && (
            <>
              <div className="text-xs text-gray-500 mb-1">Configuration</div>
              <div className="space-y-2">
                {action.config.fields.slice(0, 2).map((field) => (
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
        <Handle
          type="target"
          position={Position.Top}
          id="target"
          className="handle target-handle"
          style={{ 
            top: -6, 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: 12,
            height: 12,
            background: '#9ca3af',
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="source"
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

export default memo(ActionNode);
