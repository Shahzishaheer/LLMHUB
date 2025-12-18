import React from 'react'
import type { JSX } from 'react'
import { marked } from "marked";

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
  llmResponses?: { modelId: string; provider?: string; answer: string }[];
}

const Llmresponse: React.FC<LlmResponseProps> = (props): JSX.Element | null => {
  const { model, llmResponses } = props;
  const answers = (llmResponses || [])
    .filter((r) => r && r.answer && r.modelId === model.id)
    .map((r) => ({ text: r.answer, provider: r.provider }));

  if (answers.length === 0) return null;

  const latest = answers[answers.length - 1];

  return (
    <div
      key={model.id}
      className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-gray-700 w-full max-w-md mx-auto"
    >
      <div className="bg-gray-900/90 text-center py-4 px-6">
        <h3 className="text-white text-lg font-semibold">{model.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{latest.provider ?? model.provider}</p>
      </div>

      <div className="p-4 bg-gray-800/60 text-left flex-1 overflow-y-auto max-h-80">
        {answers.map((ans, idx) => (
          <article key={idx} className="mb-4 prose prose-invert max-w-none text-white">
            <div dangerouslySetInnerHTML={{ __html: sanitizeResponse(ans.text) }} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default Llmresponse;
