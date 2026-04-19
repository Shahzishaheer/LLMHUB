import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ModelSelector from './ModelSelector';
import Llmresponse from './Llmresponse';
import { Loader2, Brain, MessageSquare, Cpu, Globe, ArrowUpRight, AlertTriangle, X } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
}

const HeroSection = () => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  type ModelResponse = { modelId: string; provider?: string; answer: string; prompt: string };
  const [llmResponses, setLlmResponses] = useState<ModelResponse[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      handlellmrequest(message);
      setLoading(true);
      setMessage('');
    }
  };

  const { getToken } = useAuth();

  const handlellmrequest = async (prompt: string): Promise<void> => {
    if (!prompt.trim()) return;

    const modelsToCall = selectedModels.length ? selectedModels : [
      { id: 'Nvidia', name: 'Nvidia', provider: 'OpenRouter' },
      { id: "SiliconFlow", name: "Deepseek", provider: "OpenRouter" }
    ];

    setLoadingModels(new Set(modelsToCall.map(m => m.id)));

    setLlmResponses((prev) => [
      ...prev,
      ...modelsToCall.map(m => ({ modelId: m.id, provider: m.provider, answer: '', prompt }))
    ]);

    const promises = modelsToCall.map(async (model) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const updateResponse = (answerText: string, updatedProvider?: string) => {
        setLlmResponses((prev) => {
          const next = [...prev];
          let idx = -1;
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].modelId === model.id && next[i].prompt === prompt && next[i].answer === '') {
              idx = i;
              break;
            }
          }
          if (idx !== -1) {
            next[idx] = { ...next[idx], answer: answerText, provider: updatedProvider ?? model.provider };
          }
          return next;
        });
        setLoadingModels((prev) => {
          const next = new Set(prev);
          next.delete(model.id);
          return next;
        });
      };

      try {
        const token = await getToken();
        if (!token) {
          setAuthError("Your secure session has expired. Please refresh the page or sign in again to continue using the Neural Stream.");
          updateResponse('**Request Blocked:** Authentication required.');
          return;
        }

        if (model.provider === 'OpenRouter') {
          let endpoint = '';
          if (model.id === 'SiliconFlow' || model.id === 'GLM') {
            endpoint = `${import.meta.env.VITE_API_URL}llm/glm`;
          } else {
            endpoint = `${import.meta.env.VITE_API_URL}llm/openrouter`;
          }
          console.log("endpoint", endpoint)
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.status === 401) {
            setAuthError("Your secure session has expired. Please refresh the page or sign in again to continue using the Neural Stream.");
            updateResponse('**Request Blocked:** Authentication required.');
            return;
          }
          if (!response.ok) {
            const data = await response.json();
            const errorMsg = data.message || data.error || `Error ${response.status}`;
            updateResponse(`**Error:** ${errorMsg}`);
            return;
          }

          const data = await response.json();
          updateResponse(data.answer, data.provider);
        } else {
          const apikey = localStorage.getItem(model.id);
          if (!apikey) {
            clearTimeout(timeoutId);
            updateResponse('API key not found in storage.');
            return;
          }
          console.log("llm", import.meta.env.VITE_API_URL)
          const response = await fetch(`${import.meta.env.VITE_API_URL}llm/customllm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt, apikey, modelId: model.id }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.status === 401) {
            setAuthError("Your secure session has expired. Please refresh the page or sign in again to continue using the Neural Stream.");
            updateResponse('**Request Blocked:** Authentication required.');
            return;
          }
          if (!response.ok) {
            const data = await response.json();
            const errorMsg = data.message || data.details || `Provider Error ${response.status}`;
            updateResponse(`**${errorMsg}**`);
            return;
          }

          const data = await response.json();
          updateResponse(data.answer, data.provider);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        updateResponse(`Request failed: Network error or timeout.`);
      }
    });

    await Promise.allSettled(promises);
    setLoading(false);
  };

  const handleModelSelectionChange = (models: Model[]) => {
    setSelectedModels(models);
  };

  const handleClearResponse = useCallback((modelId: string) => {
    setLlmResponses((prev) => prev.filter((r) => r.modelId !== modelId));
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian selection:bg-cobalt/30 overflow-x-hidden font-sans">
      
      {/* Auth Error Modal */}
      {authError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-ink/90 border border-rose-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(225,29,72,0.15)] glow-rose overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
            <button 
              onClick={() => setAuthError(null)}
              className="absolute top-4 right-4 p-1.5 text-slate/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">Authentication Required</h3>
                <p className="text-slate/80 text-sm leading-relaxed mb-6">
                  {authError}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                  >
                    Refresh Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-End Atmospherics */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-cobalt/10 via-amethyst/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-cobalt/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-amethyst/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40">

        {/* Modern Minimalist Header */}
        <div className="text-center space-y-8 mb-24 animate-reveal">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.08] shadow-[0_0_30px_rgba(255,255,255,0.02)] backdrop-blur-md mb-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-silver/80">Intelligence Hub V1.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 leading-tight py-2 drop-shadow-sm">
            LLM<span className="text-transparent bg-clip-text bg-gradient-to-br from-cobalt via-cobalt-light to-blue-200">HUB</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-slate max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
            Advanced multi-model synthesis for modern technical teams. <br className="hidden md:block" /> Compare global intelligence streams in a single unified workspace.
          </p>
        </div>

        {/* Command Center Input Area */}
        <div className="max-w-4xl mx-auto space-y-12">

          <div className="glass p-2 rounded-[36px] shadow-2xl relative group transition-all duration-500 hover:shadow-cobalt/10">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none"></div>
            <div className="bg-ink/80 rounded-[30px] p-6 md:p-8 backdrop-blur-xl relative z-10 border border-white/[0.02]">

              {/* Context Menu Bar */}
              <div className="flex items-center justify-between mb-8">
                <ModelSelector
                  multiSelect={true}
                  onSelectionChange={handleModelSelectionChange}
                />

                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold text-slate uppercase tracking-widest">Logic Cores</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <Globe className="w-4 h-4 text-cobalt-light" />
                    <span className="text-[11px] font-bold text-slate uppercase tracking-widest">Neural Net</span>
                  </div>
                </div>
              </div>

              {/* Command Bar */}
              <form onSubmit={handleSubmit} className="relative group/form">
                <div className={`relative transition-all duration-500 rounded-2xl border ${isFocused ? 'border-cobalt/50 bg-white/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.15)] glow-cobalt' : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
                  }`}>
                  <MessageSquare className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-500 ${isFocused ? 'text-cobalt' : 'text-slate/40'
                    }`} />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter command sequence or prompt..."
                    className="w-full pl-14 pr-20 py-5 text-base bg-transparent border-none focus:ring-0 text-silver placeholder:text-slate/30 font-medium tracking-tight"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-cobalt to-cobalt-light text-white rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.05] active:scale-95 disabled:opacity-20 disabled:hover:scale-100 disabled:hover:shadow-none transition-all shadow-lg border border-white/10"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>

              {/* Prompt Snippets */}
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { text: 'Market Analysis', icon: <TrendingUp className="w-3.5 h-3.5" /> },
                  { text: 'Code Debug', icon: <Cpu className="w-3.5 h-3.5" /> },
                  { text: 'Strategy Flow', icon: <Brain className="w-3.5 h-3.5" /> }
                ].map((s) => (
                  <button
                    key={s.text}
                    onClick={() => setMessage(s.text)}
                    className="px-4 py-2 bg-white/[0.02] hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10 rounded-xl text-[11px] font-semibold tracking-wide text-slate hover:text-white transition-all flex items-center gap-2 group/btn"
                  >
                    <span className="text-slate/50 group-hover/btn:text-cobalt-light transition-colors">{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Stream */}
          {(llmResponses.length > 0 || loadingModels.size > 0) && (
            <div className="space-y-10 animate-reveal">
              <div className="flex items-center gap-4 px-4">
                <div className="h-[1px] flex-1 bg-white/5" />
                <span className="text-[9px] font-black text-slate/40 uppercase tracking-[0.5em]">Active Neural Stream</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {Array.from(new Set(llmResponses.map(r => r.modelId))).map((modelId) => {
                  const modelResponses = llmResponses.filter(r => r.modelId === modelId);
                  const lastResponse = modelResponses[modelResponses.length - 1];
                  const fallbackProvider = lastResponse?.provider || 'Unknown';

                  const model = selectedModels.find(m => m.id === modelId) ||
                    { id: modelId, name: modelId, provider: fallbackProvider };

                  return (
                    <Llmresponse
                      key={modelId}
                      model={model as Model}
                      llmResponses={llmResponses}
                      onClear={() => handleClearResponse(modelId)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Internal icon for suggestions
const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default HeroSection;
