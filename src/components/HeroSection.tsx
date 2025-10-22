import { useState } from 'react';
import ModelSelector from './ModelSelector';
// import { Send, Sparkles, Zap } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  icon: string;
}

const HeroSection = () => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Message submitted:', message);
      console.log('Selected model:', selectedModels[0]);
      // Handle message submission here
      setMessage('');
    }
  };

  const handleModelSelectionChange = (models: Model[]) => {
    setSelectedModels(models);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
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
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
              multiSelect={false}
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
                         hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-all duration-200 hover:scale-110 active:scale-95
                         disabled:hover:scale-100 shadow-lg hover:shadow-xl
                         disabled:opacity-50 group"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
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
                { text: 'Explain quantum computing', icon: '🔬' },
                { text: 'Write Python code', icon: '💻' },
                { text: 'Creative writing tips', icon: '✍️' },
                { text: 'Latest tech trends', icon: '🚀' }
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
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {suggestion.icon}
                  </span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-blue-50/80 
                        dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-900/50 
                        border border-blue-100 dark:border-gray-700/50 backdrop-blur-sm
                        hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get instant, real-time responses powered by state-of-the-art AI technology
            </p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-purple-50/80 
                        dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-900/50
                        border border-purple-100 dark:border-gray-700/50 backdrop-blur-sm
                        hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Highly Accurate</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Precision-tuned responses tailored specifically to your questions
            </p>
          </div>
          
          <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50/80 via-emerald-50/50 to-green-50/80 
                        dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-900/50
                        border border-green-100 dark:border-gray-700/50 backdrop-blur-sm
                        hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Enterprise Security</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Bank-level encryption keeps your data private and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
