import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Sparkles, User, ArrowRight, CornerDownLeft, FileText, Image as ImageIcon, Send } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onUsePrompt: (promptText: string, autoSend?: boolean) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onUsePrompt }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const isBot = message.role === 'model' || message.role === 'system';

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleCopyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (e) {
      console.error('Failed to copy prompt', e);
    }
  };

  // Helper to extract prompt clues from bot responses
  const parseContentWithClues = (text: string) => {
    // If it's a user message, just return standard markdown
    if (!isBot) return null;

    // Check if the text contains clue sections like "😀您希望" or "🌸加入" or "➡️上面你提供"
    const clueSplitIndex = text.search(/😀\s*您希望|🌸\s*加入/);
    if (clueSplitIndex === -1) return null;

    const mainBody = text.substring(0, clueSplitIndex).trim();
    const clueSection = text.substring(clueSplitIndex).trim();

    // Extract clue blocks
    const lines = clueSection.split('\n');
    const clueCards: Array<{
      id: string;
      title: string;
      description?: string;
      promptText: string;
    }> = [];

    let currentTitle = '';
    let currentDesc = '';
    let currentPrompt = '';

    const pushCard = () => {
      if (currentPrompt.trim()) {
        clueCards.push({
          id: `clue-${clueCards.length}-${Date.now()}`,
          title: currentTitle || '追問線索 Prompt',
          description: currentDesc.trim(),
          promptText: currentPrompt.trim().replace(/^➡️\s*/, ''),
        });
      }
      currentTitle = '';
      currentDesc = '';
      currentPrompt = '';
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('我要進入類型🅱️請模擬回答這個問題')) {
        // Stakeholder simulation prompt
        const match = line.match(/我要進入類型🅱️請模擬回答這個問題[:：]\s*["“]?([^"”]+)["”]?/);
        const promptToRun = match ? `我要進入類型🅱️請模擬回答這個問題："${match[1]}"` : line.trim();
        clueCards.push({
          id: `stakeholder-${i}`,
          title: '😀 模擬不同立場回答（類型🅱️）',
          description: '轉換為利害關係人思維辯證模式，提供深度回答與四方立場觀點',
          promptText: promptToRun,
        });
        continue;
      }

      if (line.startsWith('🌸') || line.includes('😀您希望')) {
        pushCard();
        currentTitle = line.trim();
      } else if (line.includes('建議與說明') || line.includes('建議：')) {
        currentDesc += (currentDesc ? '\n' : '') + line.trim();
      } else if (line.trim().startsWith('➡️') || line.trim().startsWith('上面你提供的初始問題') || line.trim().startsWith('上面的問題')) {
        currentPrompt = line.trim();
        pushCard();
      } else if (currentPrompt) {
        currentPrompt += ' ' + line.trim();
      } else if (currentTitle) {
        currentDesc += (currentDesc ? '\n' : '') + line.trim();
      }
    }
    pushCard();

    return {
      mainBody,
      clueSection,
      clueCards,
    };
  };

  const parsed = parseContentWithClues(message.content);

  return (
    <div className={`flex w-full gap-3.5 py-4 ${isBot ? 'bg-transparent' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs ${
          isBot
            ? 'bg-amber-600 text-white ring-2 ring-amber-500/20'
            : 'bg-stone-800 text-white ring-2 ring-stone-700/20'
        }`}
      >
        {isBot ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Message Box */}
      <div className={`flex flex-col max-w-[88%] sm:max-w-[82%] space-y-2 ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Author Label & Tags */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-stone-700">
            {isBot ? '高優提問設計機器人 (GoodQuestioner)' : '教學教師 / 使用者'}
          </span>
          {message.grade && (
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600">
              {message.grade}
            </span>
          )}
          {message.subject && (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
              {message.subject}
            </span>
          )}
          <span className="text-[10px] text-stone-400">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Attachment preview if user uploaded one */}
        {message.attachment && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white p-2 text-xs shadow-2xs">
            {message.attachment.type.startsWith('image/') ? (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-stone-700">{message.attachment.name}</span>
                {message.attachment.previewUrl && (
                  <img
                    src={message.attachment.previewUrl}
                    alt={message.attachment.name}
                    className="h-10 w-10 rounded object-cover border border-stone-200"
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-stone-500" />
                <span className="font-medium text-stone-700">{message.attachment.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Message Content Card */}
        <div
          className={`rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 text-sm leading-relaxed shadow-2xs break-words w-full ${
            isBot
              ? 'border border-stone-200/80 bg-white text-stone-800'
              : 'bg-stone-900 text-stone-50 rounded-tr-xs'
          }`}
        >
          {/* Main Body Markdown */}
          <div className="markdown-content space-y-3 prose prose-stone max-w-none text-stone-800">
            <Markdown>{parsed ? parsed.mainBody : message.content}</Markdown>
          </div>

          {/* Clue Prompts Section for Bot Responses */}
          {parsed && parsed.clueCards.length > 0 && (
            <div className="mt-6 border-t border-stone-200/80 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="text-xs font-bold text-stone-900 tracking-tight">
                    建議追問線索 Prompt（已預先套用您的教學脈絡，點選直接進行深入提問）
                  </h4>
                </div>
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  符合載具寬度 · 支援一鍵複製與送出
                </span>
              </div>

              <div className="space-y-3">
                {parsed.clueCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-xl border border-stone-200/90 bg-stone-50/70 p-3.5 transition-all hover:border-amber-400 hover:bg-stone-50"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        {card.title}
                      </h5>
                    </div>

                    {card.description && (
                      <p className="text-[11px] text-stone-600 mb-2 leading-relaxed whitespace-pre-wrap">
                        {card.description}
                      </p>
                    )}

                    {/* Prompt Box with responsive wrap */}
                    <div className="relative rounded-lg border border-stone-200 bg-white p-2.5 text-xs font-mono text-stone-800 overflow-x-hidden break-words whitespace-pre-wrap">
                      <span className="text-amber-700 font-bold mr-1">➡️</span>
                      {card.promptText}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-2.5 flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(card.promptText, card.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                        title="複製這段 Prompt"
                      >
                        {copiedPromptId === card.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">已複製</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-stone-500" />
                            <span>複製 Prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onUsePrompt(card.promptText, false)}
                        className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                        title="將此 Prompt 填入下方輸入框"
                      >
                        <CornerDownLeft className="h-3 w-3 text-stone-500" />
                        <span>帶入輸入框</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onUsePrompt(card.promptText, true)}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-amber-700 transition-colors"
                        title="立即送出這段 Prompt 執行追問"
                      >
                        <Send className="h-3 w-3" />
                        <span>立即送出</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions for Bot Message */}
        {isBot && (
          <div className="flex items-center gap-2 pt-1 text-xs text-stone-400">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-stone-200/60 hover:text-stone-700 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">已複製完整內容</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>複製全文</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
