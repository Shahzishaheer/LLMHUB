import React from 'react'
import type { JSX } from 'react'
import { marked } from "marked";
import { CheckCheck, Copy, X } from 'lucide-react';

const sanitizeResponse = (response: string): string => {

  try {
    let html = marked.parse(response) as string;
    // Style headings and code blocks for the UI
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
    .filter((r) => r && r.answer && r.modelId === model.id)
    .map((r) => ({ text: r.answer, provider: r.provider, prompt: r.prompt }));

  if (answers.length === 0) return null;

  const latest = answers[answers.length - 1];
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  return (
    <>
    <div
    
      key={model.id}
      className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-gray-700 w-full h-full mx-auto"
    >
      <div className="bg-gray-900/90 text-center py-4 px-6">
      <X className="relative right-1 top-2 cursor-pointer text-gray-400 float-right hover:text-red-600" onClick={onClear} />
        <h3 className="text-white text-lg font-semibold">{model.name}</h3>

        {/* <p className="text-xs text-gray-400 mt-1">{latest.provider ?? model.provider}</p> */}
      </div>

      <div className="p-4 bg-gray-800/60 text-left flex-1 overflow-y-auto max-h-80">
        {answers.map((ans, idx) => (
          <div key={idx} className="mb-6">
            {/* User Prompt */}
            <div className="flex justify-end mb-2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[85%] text-sm">
                {ans.prompt}
              </div>
            </div>

            {/* LLM Response */}
            <article className="prose prose-invert max-w-none text-white bg-gray-700/50 p-3 rounded-xl rounded-tl-none">
            {copiedIndex === idx ? <CheckCheck className='relative  left-2 top-1 cursor-pointer h-5 w-5 text-green-400 float-right' />:<Copy className='relative  left-2 top-1 cursor-pointer h-5 w-5 text-gray-400 float-right' onClick={() => handleCopy(ans.text, idx)}/>}
              <div dangerouslySetInnerHTML={{ __html: sanitizeResponse(ans.text) }} />
            </article>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Llmresponse;
