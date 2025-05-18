

import { Save, HelpCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkflow } from '../context/workflowContext';

const HeaderBar = () => {
  const { resetWorkflow, saveWorkflow } = useWorkflow();

  const handleNewWorkflow = () => {
    if (window.confirm('Are you sure you want to create a new workflow? Any unsaved changes will be lost.')) {
      resetWorkflow();
      toast.success('New workflow created');
    }
  };

  const handleOpenWorkflow = () => {
    // In a real app, this would open a workflow selection dialog
    toast.info('Open workflow functionality would be implemented here');
  };

  const handleSaveWorkflow = () => {
    saveWorkflow();
    toast.success('Workflow saved successfully');
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 h-14 z-10">
      <div className="flex items-center space-x-4">
        <div className="text-primary-600 font-semibold text-lg">Workflow Builder</div>
        <div className="flex space-x-1">
          <button 
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            onClick={handleNewWorkflow}
          >
            New
          </button>
          <button 
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            onClick={handleOpenWorkflow}
          >
            Open
          </button>
          <button 
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"
            onClick={handleSaveWorkflow}
          >
            <Save size={16} className="text-gray-500" />
            Save
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" title="Help">
          <HelpCircle size={18} className="text-gray-500" />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" title="Settings">
          <Settings size={18} className="text-gray-500" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
          JS
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;