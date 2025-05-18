import React from 'react';
import { Search, X } from 'lucide-react';

type AddAppModalProps = {
  onClose: () => void;
};

const AddAppModal = ({ onClose }: AddAppModalProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const apps = [
    { id: 'dropbox', name: 'Dropbox', icon: '🗂️', color: 'bg-blue-100' },
    { id: 'stripe', name: 'Stripe', icon: '💵', color: 'bg-green-100' },
    { id: 'notion', name: 'Notion', icon: '📝', color: 'bg-yellow-100' },
    { id: 'teams', name: 'Teams', icon: '🔔', color: 'bg-indigo-100' },
    { id: 'hubspot', name: 'HubSpot', icon: '📈', color: 'bg-pink-100' }
  ];

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Connect a New App</h3>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search available apps..." 
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {filteredApps.map(app => (
                      <div 
                        key={app.id}
                        className="app-item border border-gray-200 rounded-md p-3 text-center hover:border-primary-500 cursor-pointer"
                      >
                        <div className={`w-12 h-12 mx-auto rounded-md flex items-center justify-center ${app.color} text-${app.id}-700 mb-2`}>
                          <span className="text-xl">{app.icon}</span>
                        </div>
                        <div className="text-sm font-medium">{app.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button 
                type="button" 
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Connect
              </button>
              <button 
                type="button" 
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppModal;
