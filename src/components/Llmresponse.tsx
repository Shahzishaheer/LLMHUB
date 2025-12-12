import React from 'react'
import type { JSX } from 'react'
import { marked } from "marked";
const sanitizeResponse = (response: string): string => {
    try {
      let html = marked.parse(response) as string;
      html = html.replace(/<(h[1-3])>(.*?)<\/\1>/i, '<h1 class="main-heading">$2</h1>');
      return html;
    } catch (error) {
      console.error("Error sanitizing response:", error);
      return response;
    }
  };
interface LlmResponseProps {
  model: { id: string; name: string; provider?: string };
  llmResponses?: string[];
}

const Llmresponse: React.FC<LlmResponseProps> = (props): JSX.Element | null => {
    const { model , llmResponses } = props;
    const filteredResponses = (llmResponses || []).filter((response: string) => response && response.trim().length > 0);
    if (filteredResponses.length === 0) return null;
  return (
   <>

    <div  key={model.id}
      className="text-white group text-center p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700/50 backdrop-blur-sm flex flex-col max-h-96"
            >
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{model.name}</h4>
              <hr className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{model.provider}</p>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left flex-1 overflow-y-auto max-h-72">
                   {filteredResponses.map((response: string, index: number) => (
                         <p
                           key={index}
                           className="mb-2 text-gray-800 dark:text-gray-200 line-hight-relaxed"
                           dangerouslySetInnerHTML={{ __html: sanitizeResponse(response) }}
                         />
                   ))}
                </div>
            </div>
   </>
  )
}

export default Llmresponse;
