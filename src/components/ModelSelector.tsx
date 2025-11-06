import { useState, useRef, useEffect } from 'react';

interface Model {
  id: string;
  name: string;
  provider: string;
  
}

interface ModelSelectorProps {
  multiSelect?: boolean;
  onSelectionChange: (selectedModels: Model[]) => void;
}

const AVAILABLE_MODELS: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI'},
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI'},
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', },
  { id: 'llama-2', name: 'Llama 2', provider: 'Meta' },
  { id: 'mistral', name: 'Mistral', provider: 'Mistral AI' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  multiSelect = true, 
  onSelectionChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Model[]>([AVAILABLE_MODELS[0]]);
 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelToggle = (model: Model) => {
    let newSelection: Model[];
    
    if (multiSelect) {
      // Multi-select mode
      const isSelected = selectedModels.some(m => m.id === model.id);
      if (isSelected) {
        // Don't allow deselecting if it's the only one
        if (selectedModels.length === 1) return;
        newSelection = selectedModels.filter(m => m.id !== model.id);
      } else {
        newSelection = [...selectedModels, model];
      }
    } else {
      // Single-select mode
      newSelection = [model];
      setIsOpen(false);
    }
    
    setSelectedModels(newSelection);
    onSelectionChange(newSelection);
  };

  const isModelSelected = (modelId: string) => {
    return selectedModels.some(m => m.id === modelId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 
                 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                 hover:border-blue-400 dark:hover:border-blue-600 
                 transition-all duration-200 shadow-md hover:shadow-lg
                 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {/* <span className="text-base">{selectedModels[0].icon}</span> */}
        <span className="hidden sm:inline">
          {selectedModels.length === 1 
            ? selectedModels[0].name 
            : `${selectedModels.length} Models`}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 
                      border-2 border-gray-200 dark:border-gray-700 rounded-xl 
                      shadow-2xl z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {multiSelect ? 'Select Models (Multi)' : 'Select Model'}
            </p>
          </div>

          {/* Model List */}
          <div className="max-h-80 overflow-y-auto">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = isModelSelected(model.id);
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleModelToggle(model)}
                  className={`w-full px-4 py-3 flex items-center gap-3 
                           hover:bg-blue-50 dark:hover:bg-gray-700/50 
                           transition-all duration-150 border-b border-gray-100 dark:border-gray-700/50
                           ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  {/* Radio Button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${isSelected 
                                  ? 'border-blue-600' 
                                  : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>

                  {/* Icon */}
                  {/* <span className="text-2xl">{model.icon}</span> */}
                  
                  {/* Model Name Only */}
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {model.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
