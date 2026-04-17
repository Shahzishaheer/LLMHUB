import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Cpu, Sparkles, Check, Lock, Globe, Command } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  icon?: React.ReactNode;
}

interface ModelSelectorProps {
  multiSelect?: boolean;
  onSelectionChange: (selectedModels: Model[]) => void;
}

const AVAILABLE_MODELS: Model[] = [
  { id: 'Nvidia', name: 'Nvidia', provider: 'OpenRouter', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'SiliconFlow', name: 'Deepseek', provider: 'OpenRouter', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'gemini', name: 'Gemini', provider: 'Google', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  multiSelect = true, 
  onSelectionChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
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

  useMemo(() => {
    if (selectedModels.length === 0) {
      const defaultModels = AVAILABLE_MODELS.filter((m) => m.id === 'Nvidia' || m.id === 'SiliconFlow');
      if (defaultModels.length > 0) {
        setSelectedModels(defaultModels);
        onSelectionChange(defaultModels);
      }
    }
  }, []);

  const handleModelToggle = (model: Model) => {
    let newSelection: Model[];
    if (multiSelect) {
      const isSelected = selectedModels.some(m => m.id === model.id);
      if (isSelected) {
        newSelection = selectedModels.filter(m => m.id !== model.id);
      } else {
        newSelection = [...selectedModels, model];
      }
    } else {
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
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button - Refined Minimalist */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-500 ${
          isOpen ? 'bg-white/5 border-cobalt shadow-[0_0_25px_rgba(0,71,255,0.15)]' : 'bg-transparent border-white/5 hover:border-white/10'
        }`}
      >
        <div className="p-1.5 rounded-lg bg-cobalt/10 text-cobalt">
          <Command className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-silver">
          {selectedModels.length === 1 
            ? selectedModels[0].name 
            : `${selectedModels.length} Cores Active`}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate/50 transition-transform duration-500 ${isOpen ? 'rotate-180 text-cobalt' : ''}`} />
      </button>

      {/* Dropdown Menu - Luxury Utility Style */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-72 glass-dark border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-reveal origin-top-left">
          {/* Header */}
          <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate uppercase tracking-[0.3em]">Processing Grid</span>
            <div className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse" />
          </div>

          {/* Model List */}
          <div className="max-h-80 overflow-y-auto">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = isModelSelected(model.id);
              const isApiKeyAvailable = !!localStorage.getItem(`${model.id}`) || model.id === 'Nvidia' || model.id === 'SiliconFlow';

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => isApiKeyAvailable && handleModelToggle(model)}
                  className={`w-full px-5 py-4 flex items-center justify-between transition-all duration-300 ${
                    isSelected ? 'bg-cobalt/[0.08]' : 'hover:bg-white/[0.03]'
                  } ${!isApiKeyAvailable ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                  disabled={!isApiKeyAvailable}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isSelected ? 'bg-cobalt text-white shadow-[0_0_15px_rgba(0,71,255,0.4)]' : 'bg-white/5 text-slate'
                    }`}>
                      {model.icon}
                    </div>
                    <div className="text-left">
                      <p className={`text-[13px] font-bold tracking-tight transition-colors ${isSelected ? 'text-silver' : 'text-slate'}`}>
                        {model.name}
                      </p>
                      <p className="text-[9px] font-bold text-slate/40 uppercase tracking-tighter">
                        {model.provider}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-cobalt drop-shadow-[0_0_5px_rgba(0,71,255,0.5)]" />}
                  {!isApiKeyAvailable && <Lock className="w-3.5 h-3.5 text-slate/30" />}
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="px-5 py-3 bg-black/40 border-t border-white/5">
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cobalt" />
                <span className="text-[9px] font-bold text-slate/60 uppercase tracking-widest">Encrypted Endpoint</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
