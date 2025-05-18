import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { SAMPLE_APPS } from '../workflow-data';


type AppsSidebarProps = {
  onShowAddAppModal: () => void;
};

const AppsSidebar = ({ onShowAddAppModal }: AppsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({
    gmail: true,
    sheets: true,
    slack: false,
    contacts: false
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleAppSection = (appId: string) => {
    setExpandedApps({
      ...expandedApps,
      [appId]: !expandedApps[appId]
    });
  };

  const filteredApps = Object.values(SAMPLE_APPS).filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, appId: string, type: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/app', appId);
    event.dataTransfer.setData('application/reactflow/nodetype', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full z-10 transition-all duration-300">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search apps..." 
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-thin flex-1">
        <div className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Triggers & Actions
        </div>

        {filteredApps.map(app => (
          <div key={app.id} className="app-card mb-2 mx-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div 
              className="p-3 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleAppSection(app.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center ${app.color} text-${app.id}-500`}>
                  <span className="text-lg">{app.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{app.name}</h3>
                </div>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transform transition-transform ${expandedApps[app.id] ? '' : 'rotate-180'}`} 
              />
            </div>
            <div className={`app-content px-3 py-2 text-sm ${expandedApps[app.id] ? '' : 'hidden'}`}>
              {Object.keys(app.triggers).length > 0 && (
                <>
                  <div className="font-medium text-xs text-gray-500 mb-1">TRIGGERS</div>
                  {Object.values(app.triggers).map(trigger => (
                    <div 
                      key={trigger.key} 
                      className="trigger-item p-2 hover:bg-gray-50 rounded cursor-move flex items-center space-x-2"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'trigger', app.id, trigger.key)}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center bg-${app.id}-50 text-${app.id}-500`}>
                        <span className="text-xs">{app.icon}</span>
                      </div>
                      <span>{trigger.label}</span>
                    </div>
                  ))}
                </>
              )}
              
              {Object.keys(app.actions).length > 0 && (
                <>
                  <div className="font-medium text-xs text-gray-500 mb-1 mt-3">ACTIONS</div>
                  {Object.values(app.actions).map(action => (
                    <div 
                      key={action.key} 
                      className="action-item p-2 hover:bg-gray-50 rounded cursor-move flex items-center space-x-2"
                      draggable
                      onDragStart={(e) => onDragStart(e, 'action', app.id, action.key)}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center bg-${app.id}-50 text-${app.id}-500`}>
                        <span className="text-xs">{app.icon}</span>
                      </div>
                      <span>{action.label}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-3">
        <button 
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={onShowAddAppModal}
        >
          <span className="mr-1">+</span> Add App
        </button>
      </div>
    </aside>
  );
};

export default AppsSidebar;