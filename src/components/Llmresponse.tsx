import React from 'react'
import type { JSX } from 'react'
import { marked } from "marked";
import { CheckCheck, Copy, X, Zap, Cpu, Sparkles } from 'lucide-react';

const sanitizeResponse = (response: string): string => {
  try {
    let html = marked.parse(response) as string;
    // Style headings and code blocks using the global CSS classes
    html = html.replace(/<(h[1-3])>(.*?)<\/\1>/gi, '<h2 class="llm-heading">$2</h2>');
    html = html.replace(/<pre>/g, '<pre class="llm-code">');
    return html;
  } catch (error) {
    console.error("Error sanitizing response:", error);
    return response;
  }
};

interface LlmResponseProps {
  model: { id: string; name: string; provider?: string };
  llmResponses?: { modelId: string; provider?: string; answer: string; prompt: string }[];
  onClear: () => void;
}

const Llmresponse: React.FC<LlmResponseProps> = (props): JSX.Element | null => {
  const { model, llmResponses, onClear } = props;
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const answers = (llmResponses || [])
    .filter((r) => r && r.modelId === model.id)
    .map((r) => ({ text: r.answer, provider: r.provider, prompt: r.prompt }));

  if (answers.length === 0) return null;

  const latest = answers[answers.length - 1];
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden glass border-white/10 w-full h-full mx-auto relative group shadow-2xl transition-all duration-300 hover:border-white/20">
      {/* Decorative Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cobalt/50 to-transparent opacity-50" />
      
      {/* Card Header */}
      <div className="bg-white/[0.03] border-b border-white/[0.08] py-3.5 px-5 flex items-center justify-between backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-cobalt/10 border border-cobalt/20 flex items-center justify-center text-cobalt shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            {model.id.toLowerCase().includes('gpt') ? <Zap className="w-4.5 h-4.5" /> : 
             model.id.toLowerCase().includes('claude') ? <Sparkles className="w-4.5 h-4.5" /> : 
             <Cpu className="w-4.5 h-4.5" />}
          </div>
          <div className="flex flex-col">
            <h3 className="text-silver/90 text-sm font-semibold tracking-wide whitespace-nowrap">{model.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <p className="text-[10px] text-slate/80 font-medium uppercase tracking-[0.05em]">
                {latest.provider ?? model.provider}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-white/10 rounded-lg text-slate hover:text-white transition-all duration-200"
          title="Dismiss Neural Stream"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6 bg-[#09090B]/40 flex-1 overflow-y-auto max-h-[450px] scrollbar-thin relative z-0">
        {answers.map((ans, idx) => (
          <div key={idx} className="mb-10 last:mb-0 space-y-6 animate-slideIn" style={{ animationDelay: `${idx * 100}ms` }}>
            {/* User Prompt */}
            <div className="flex justify-end">
              <div className="bg-gradient-to-br from-cobalt/20 to-cobalt/5 border border-cobalt/20 text-silver/90 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-[13px] font-medium leading-relaxed shadow-lg shadow-cobalt/5">
                {ans.prompt}
              </div>
            </div>

            {/* LLM Response */}
            <div className="flex justify-start relative">
              <article className="glass-dark border-[0.5px] border-white/10 px-6 py-5 rounded-2xl rounded-tl-sm w-[95%] relative shadow-xl">
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {copiedIndex === idx ? (
                    <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-md border border-emerald-500/20">
                      <CheckCheck className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleCopy(ans.text, idx)}
                      className="bg-white/5 hover:bg-white/10 text-slate hover:text-silver p-1.5 rounded-md border border-white/10 transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                {(!ans.text || ans.text === 'Thinking...' || ans.text.toLowerCase().includes('request timed out')) ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cobalt-light animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cobalt animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cobalt-light animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-widest text-slate uppercase bg-gradient-to-r from-silver to-slate bg-clip-text text-transparent">Synthesizing...</span>
                  </div>
                ) : (
                  <div 
                    className="prose prose-invert max-w-none text-silver/80 leading-relaxed font-normal text-[14px]"
                    dangerouslySetInnerHTML={{ __html: sanitizeResponse(ans.text) }} 
                  />
                )}
              </article>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Llmresponse;

