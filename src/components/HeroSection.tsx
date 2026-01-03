import { useState, useCallback } from 'react';
import ModelSelector from './ModelSelector';
import Llmresponse from './Llmresponse';
import {  LoaderCircle, MoveRight } from 'lucide-react';
import { BounceLoader } from 'react-spinners';
// import { Send, Sparkles, Zap } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  
}

 
const HeroSection = () => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
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
              return;
            }

            const data = await response.json();
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: data.provider ?? model.provider, answer: data.answer, prompt }]);
          } else {
            // For other providers (e.g., Gemini), fetch API key from localStorage and send to backend
            const apikey = localStorage.getItem(model.id);
            if (!apikey) {
              clearTimeout(timeoutId);
              setLlmResponses((prev) => [...prev, { modelId: model.id, provider: model.provider, answer: 'API key not found in localStorage', prompt }]);
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
              return;
            }

            const data = await response.json();
            // Backend should return { answer, provider }
            setLlmResponses((prev) => [...prev, { modelId: model.id, provider: data.provider ?? model.provider, answer: data.answer, prompt }]);
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
    <div className="min-h-[100vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-5xl w-full space-y-12">
        {/* Hero Title */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight  mt-2">
            <span className="bg-blue-500 bg-clip-text text-transparent ">
              LLMHUB
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the next generation of AI assistance. 
            <span className="block mt-2 text-gray-500 dark:text-gray-400">
              Fast, accurate, and intelligent responses at your fingertips.
            </span>
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Model Selector */}
          <div className="flex items-center mb-4 px-2">
            <ModelSelector 
              multiSelect={true}
              onSelectionChange={handleModelSelectionChange}
            />
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <div className={`relative flex items-center transition-all duration-300 ${
              isFocused ? 'scale-[1.02]' : 'scale-100'
            }`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What would you like to know?"
                className="w-full px-8 py-5 pr-16 text-lg border-2 border-gray-200 rounded-2xl 
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                         dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:focus:border-blue-400
                         dark:focus:ring-blue-900/50 backdrop-blur-sm
                         transition-all duration-300 shadow-xl hover:shadow-2xl
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="absolute right-3 p-3.5 bg-blue-600 text-white rounded-xl
                         hover:bg-blue-700 disabled:cursor-not-allowed
                         transition-all duration-200 hover:scale-110 active:scale-95
                         disabled:hover:scale-100 shadow-lg hover:shadow-xl
                         disabled:opacity-50 group"
                aria-label="Send message"
              >
                {loading ? <LoaderCircle />: <MoveRight /> }
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-8 space-y-3">
            <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              Try asking about:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { text: 'Explain quantum computing',  },
                { text: 'Write Python code',  },
                { text: 'Creative writing tips',  },
                { text: 'Latest tech trends',  }
              ].map((suggestion) => (
                <button
                  key={suggestion.text}
                  onClick={() => setMessage(suggestion.text)}
                  className="group px-5 py-2.5 text-sm bg-white dark:bg-gray-800/50 text-gray-700 
                           dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/50
                           transition-all duration-200 border border-gray-200 dark:border-gray-700
                           hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md
                           flex items-center gap-2 backdrop-blur-sm"
                >
                   
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container grid grid-cols-2 md:grid-cols-2 gap-8 mt-16">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <BounceLoader color='#3b82f6' size={30} />
            </div>
          ) : (
            <>
              {selectedModels.map((model) => (
                <Llmresponse 
                  key={model.id}
                  model={model} 
                  llmResponses={llmResponses} 
                  onClear={() => handleClearResponse(model.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
