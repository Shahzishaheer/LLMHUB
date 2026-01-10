import { useState, useCallback } from 'react';
import ModelSelector from './ModelSelector';
import Llmresponse from './Llmresponse';
import { Loader2, MoveRight, Sparkles, Zap, Brain, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react';
import { BounceLoader } from 'react-spinners';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      handlellmrequest(message);
      setLoading(true);
      setMessage('');
    }
  };

  const handlellmrequest = async (prompt: string): Promise<void> => {

    if (!prompt.trim()) return;

    const modelsToCall = selectedModels.length ? selectedModels : [{ id: 'Nvidia', name: 'Nvidia', provider: 'OpenRouter' },{id:"SiliconFlow", name: "Deepseek", provider: "OpenRouter"}];

    console.log('Models to call:', modelsToCall);
    
    // Set all models as loading
    setLoadingModels(new Set(modelsToCall.map(m => m.id)));
    
    // Call all models in parallel
    const promises = modelsToCall.map(async (model) => {
        console.log('Processing model:', model.id, model.name);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 seconds timeout

        try {
          if (model.provider === 'OpenRouter') {
            // Determine the endpoint based on model id
            let endpoint = '';

            if (model.id === 'SiliconFlow' || model.id === 'GLM') {
              endpoint = `${import.meta.env.VITE_API_URL}llm/glm`;
              console.log('Calling GLM endpoint:', endpoint);
            } else {
              endpoint = `${import.meta.env.VITE_API_URL}llm/openrouter`;
              console.log('Calling OpenRouter endpoint:', endpoint);
            }
            console.log("Endpoint", endpoint);
            
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorText = await response.text();
              setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: `Error ${response.status} - ${errorText}`, prompt }]);
              setLoadingModels((prev) => {
                const next = new Set(prev);
                next.delete(model.id);
                return next;
              });
              return;
            }

            const data = await response.json();
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: data.provider ?? model.provider, answer: data.answer, prompt }]);
            setLoadingModels((prev) => {
              const next = new Set(prev);
              next.delete(model.id);
              return next;
            });
          } else {
            // For other providers (e.g., Gemini), fetch API key from localStorage and send to backend
            const apikey = localStorage.getItem(model.id);
            if (!apikey) {
              clearTimeout(timeoutId);
              setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: 'API key not found in localStorage', prompt }]);
              setLoadingModels((prev) => {
                const next = new Set(prev);
                next.delete(model.id);
                return next;
              });
              return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}llm/customllm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, apikey, modelId: model.id }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorText = await response.text();
              setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: `Error ${response.status} - ${errorText}`, prompt }]);
              setLoadingModels((prev) => {
                const next = new Set(prev);
                next.delete(model.id);
                return next;
              });
              return;
            }

            const data = await response.json();
            // Backend should return { answer, provider }
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: data.provider ?? model.provider, answer: data.answer, prompt }]);
            setLoadingModels((prev) => {
              const next = new Set(prev);
              next.delete(model.id);
              return next;
            });
          }
        } catch (err) {
          clearTimeout(timeoutId);
          if (err instanceof Error && err.name === 'AbortError') {
            console.error(`Request to ${model.name} timed out`);
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: `${model.name}: Request timed out`, prompt }]);
          } else {
            console.error(`Error calling model ${model.name}:`, err);
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: `${model.name}: Network error`, prompt }]);
          }
          setLoadingModels((prev) => {
            const next = new Set(prev);
            next.delete(model.id);
            return next;
          });
        }
    });

    // Wait for all API calls to complete
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
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        
        {/* Hero Title Section */}
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 border border-blue-200 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">AI-Powered Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="text-blue-600 dark:text-blue-400">
              LLMHUB
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Compare responses from multiple AI models simultaneously
            <span className="block mt-2 text-base text-gray-500 dark:text-gray-400">
              Get diverse perspectives and choose the best answer for your needs
            </span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">Fast</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Responses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Availability</div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Input Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 backdrop-blur-sm">
            
            {/* Model Selector Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Select AI Models
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedModels.length} selected
                </span>
              </div>
              <ModelSelector 
                multiSelect={true}
                onSelectionChange={handleModelSelectionChange}
              />
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                  Ask your question
                </span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className={`relative transition-all duration-300 ${
                isFocused ? 'scale-[1.01]' : 'scale-100'
              }`}>
                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ask me anything... What would you like to know?"
                  className="w-full pl-14 pr-16 py-5 text-base border-2 border-gray-200 rounded-2xl 
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400
                           dark:focus:ring-blue-900/50
                           transition-all duration-300 shadow-sm hover:shadow-md
                           placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 
                           bg-blue-600 text-white rounded-xl
                           hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover:scale-105 active:scale-95
                           disabled:hover:scale-100 shadow-lg hover:shadow-xl
                           flex items-center justify-center"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MoveRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>

            {/* Quick Suggestions */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Popular questions:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'Explain quantum computing', icon: '⚛️' },
                  { text: 'Write Python code', icon: '💻' },
                  { text: 'Creative writing tips', icon: '✍️' },
                  { text: 'Latest tech trends', icon: '📱' },
                  { text: 'Solve math problems', icon: '🔢' },
                  { text: 'Learn a new language', icon: '🌍' }
                ].map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => setMessage(suggestion.text)}
                    className="group px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-700 
                             dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20
                             transition-all duration-200 border border-gray-200 dark:border-gray-600
                             hover:border-blue-300 dark:hover:border-blue-700 
                             flex items-center gap-2"
                  >
                    <span>{suggestion.icon}</span>
                    <span className="text-xs">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          {llmResponses.length === 0 && loadingModels.size === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Multiple Models</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Compare responses from different AI models to get diverse perspectives</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Get instant responses powered by state-of-the-art AI technology</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Best Results</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Choose the most accurate answer from multiple AI perspectives</p>
              </div>
            </div>
          )}

          {/* Responses Grid */}
          {(llmResponses.length > 0 || loadingModels.size > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-6 px-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Responses
                </h2>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {llmResponses.length} of {selectedModels.length} completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Show loading cards for models being queried */}
                {Array.from(loadingModels).map((modelId) => {
                  const model = selectedModels.find(m => m.id === modelId) || 
                               { id: modelId, name: modelId, provider: 'Loading' };
                  return (
                    <div
                      key={`loading-${modelId}`}
                      className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full animate-pulse-slow"
                    >
                      <div className="bg-blue-600 text-center py-4 px-6">
                        <h3 className="text-white text-lg font-bold">{model.name}</h3>
                        <p className="text-xs text-blue-100 mt-1">{model.provider}</p>
                      </div>
                      <div className="p-8 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-center min-h-[250px]">
                        <div className="text-center space-y-4">
                          <BounceLoader color='#2563eb' size={50} />
                          <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Thinking...</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Generating response</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Show responses for completed models */}
                {selectedModels.map((model) => {
                  if (loadingModels.has(model.id)) return null;
                  
                  return (
                    <Llmresponse 
                      key={model.id}
                      model={model} 
                      llmResponses={llmResponses} 
                      onClear={() => handleClearResponse(model.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {llmResponses.length === 0 && loadingModels.size === 0 && (
          <div className="text-center mt-16 space-y-4">
            <p className="text-gray-500 dark:text-gray-400">
              Powered by cutting-edge AI technology
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                All systems operational
              </span>
              <span>•</span>
              <span>Fast & Reliable</span>
              <span>•</span>
              <span>Free to use</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
