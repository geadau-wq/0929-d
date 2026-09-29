/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { InputArea } from './components/InputArea';
import { PresetScenarios } from './components/PresetScenarios';
import { HandbookModal } from './components/HandbookModal';
import { BOT_GREETING, PresetScenario } from './data/pedagogicalData';
import { Attachment, GradeLevel, Message, SubjectDomain } from './types';
import { Sparkles, AlertCircle, Info, Heart } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting-msg',
      role: 'model',
      content: BOT_GREETING,
      timestamp: Date.now(),
      modeDetected: 'greeting',
    },
  ]);

  const [input, setInput] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('unspecified');
  const [subject, setSubject] = useState<SubjectDomain>('auto');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim() && !attachment) return;

    setErrorMessage(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      attachment: attachment || undefined,
      grade: grade !== 'unspecified' ? grade : undefined,
      subject: subject !== 'auto' ? subject : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    const currentAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentInput: textToSend,
          attachment: currentAttachment
            ? {
                data: currentAttachment.data,
                mimeType: currentAttachment.mimeType,
              }
            : undefined,
          grade: grade !== 'unspecified' ? grade : undefined,
          subject: subject !== 'auto' ? subject : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `伺服器回應錯誤 (${response.status})`);
      }

      const data = await response.json();
      const botResponseText = data.text || '已處理您的請求。';

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: botResponseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Send error:', err);
      setErrorMessage(err.message || '連線時發生錯誤，請稍後重試。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenario: PresetScenario) => {
    setInput(scenario.prompt);
    if (scenario.grade) {
      setGrade(scenario.grade as GradeLevel);
    }
  };

  const handleUsePrompt = (promptText: string, autoSend: boolean = false) => {
    if (autoSend) {
      handleSend(promptText);
    } else {
      setInput(promptText);
    }
  };

  const handleNewChat = () => {
    if (confirm('確定要開啟新的提問設計對話嗎？目前的內容將會清空。')) {
      setMessages([
        {
          id: `greeting-${Date.now()}`,
          role: 'model',
          content: BOT_GREETING,
          timestamp: Date.now(),
          modeDetected: 'greeting',
        },
      ]);
      setInput('');
      setAttachment(null);
      setErrorMessage(null);
    }
  };

  const handleExportMarkdown = () => {
    const title = '高優計劃提問設計教案紀錄';
    const dateStr = new Date().toLocaleDateString('zh-TW');

    let markdown = `# ${title}\n\n`;
    markdown += `> 生成日期：${dateStr}\n`;
    markdown += `> 研製來源：滔滔學（ＥＬＡ）與優履團隊（ＵＮＩ）設計之 AI 機器人小幫手 GoodQuestioner\n\n---\n\n`;

    messages.forEach((msg, idx) => {
      const roleName = msg.role === 'model' ? '🤖 高優提問設計機器人 (GoodQuestioner)' : '👤 教師 / 使用者';
      markdown += `### ${idx + 1}. ${roleName}\n\n`;
      if (msg.grade) markdown += `* **適用年級**：${msg.grade}\n`;
      if (msg.subject) markdown += `* **領域**：${msg.subject}\n`;
      if (msg.attachment) markdown += `* **附件教材**：${msg.attachment.name}\n`;
      markdown += `\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `提問設計教案_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Top Header */}
      <Header
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onNewChat={handleNewChat}
        onExportMarkdown={handleExportMarkdown}
        hasMessages={messages.length > 1}
      />

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Banner Credit Info */}
          <div className="rounded-xl border border-amber-200/70 bg-gradient-to-r from-amber-50/80 via-white to-orange-50/70 p-3 sm:p-4 text-xs shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold text-amber-950">高優計劃機器人：提問設計 (GoodQuestioner)</span>
                  <span className="text-[11px] rounded bg-amber-200/80 px-1.5 py-0.2 font-medium text-amber-900">
                    四層次提問 · 跨科素養法 · 利害關係人思辨
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  本機器人由一群熱忱教育的教師開發，免費提供所有教育使用者。公開介紹或產出發表時，請引註來源：
                  <span className="font-semibold text-stone-800">優履與滔滔學教育學社設計ＡＩ機器人小幫手GoodQuestioner</span>。
                </p>
              </div>
            </div>
          </div>

          {/* Preset Scenarios (Shown when user has only seen greeting) */}
          {messages.length === 1 && (
            <div className="animate-in fade-in duration-300">
              <PresetScenarios onSelectScenario={handleSelectScenario} />
            </div>
          )}

          {/* Messages Stream */}
          <div className="space-y-4 divide-y divide-stone-200/60">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onUsePrompt={handleUsePrompt}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 py-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white animate-pulse">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-2xs text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-800">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-600 animate-ping" />
                    正在分析教學素材與學科核心概念...
                  </div>
                  <p className="text-stone-500 text-[11px]">
                    進行知識與技能節點拆解、融合素養提問法並建構四個認知層次提問...
                  </p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">生成發生問題</p>
                  <p className="text-stone-700">{errorMessage}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <InputArea
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        grade={grade}
        setGrade={setGrade}
        subject={subject}
        setSubject={setSubject}
        attachment={attachment}
        setAttachment={setAttachment}
      />

      {/* Pedagogical Handbook Dialog */}
      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />
    </div>
  );
}
