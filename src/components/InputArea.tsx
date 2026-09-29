import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, X, Image as ImageIcon, FileText, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { Attachment, GradeLevel, SubjectDomain } from '../types';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (customText?: string) => void;
  isLoading: boolean;
  grade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  subject: SubjectDomain;
  setSubject: (subject: SubjectDomain) => void;
  attachment: Attachment | null;
  setAttachment: (att: Attachment | null) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  grade,
  setGrade,
  subject,
  setSubject,
  attachment,
  setAttachment,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (input.trim() || attachment)) {
        onSend();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || result;
      setAttachment({
        name: file.name,
        type: file.type,
        data: base64Data,
        mimeType: file.type || 'text/plain',
        previewUrl: file.type.startsWith('image/') ? result : undefined,
      });
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      // For text or documents, read as text or base64
      reader.readAsDataURL(file);
    }
  };

  // Detect mode preview based on input
  const isStakeholderMode = 
    input.includes('我要進入類型🅱️') || 
    (input.trim().endsWith('？') || input.trim().endsWith('?')) && input.trim().length < 60;

  return (
    <div className="sticky bottom-0 z-20 border-t border-stone-200 bg-white/95 backdrop-blur-sm p-3 sm:p-4">
      <div className="mx-auto max-w-4xl space-y-2.5">
        {/* Controls Bar: Grade, Subject, Mode hint */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">學生年段：</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-800 shadow-2xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="unspecified">自動或由課文判定</option>
                <option value="國小一～二年級">國小一～二年級 (低年級)</option>
                <option value="國小三～四年級">國小三～四年級 (中年級)</option>
                <option value="國小五～六年級">國小五～六年級 (高年級)</option>
                <option value="國中七年級">國中七年級 (國一)</option>
                <option value="國中八年級">國中八年級 (國二)</option>
                <option value="國中九年級">國中九年級 (國三)</option>
                <option value="高中十年級（高一）">高中十年級 (高一)</option>
                <option value="高中十一年級（高二）">高中十一年級 (高二)</option>
                <option value="高中十二年級（高三）">高中十二年級 (高三)</option>
                <option value="大專院校/成人教育">大專院校 / 成人教育</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">領域學科：</span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectDomain)}
                className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-800 shadow-2xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="auto">自動判斷領域</option>
                <option value="chinese">國語文 (文本能力概念)</option>
                <option value="english">英語文 (ELA 雙語)</option>
                <option value="math">數學科 (#109提問技巧)</option>
                <option value="science">自然科學 (物理/化學/生物/地科)</option>
                <option value="native">本土語 (閩南語/客語/原民/閩東)</option>
                <option value="social">社會跨領域 / 其他科</option>
              </select>
            </div>
          </div>

          {/* Mode Indicator Badge */}
          <div className="flex items-center gap-1.5">
            {isStakeholderMode ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                類型🅱️ 利害關係人模擬模式
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                <Sparkles className="h-3 w-3" />
                類型🅰️ 四層次素養提問設計
              </span>
            )}
          </div>
        </div>

        {/* Attachment preview if selected */}
        {attachment && (
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs text-amber-900">
            <div className="flex items-center gap-2 truncate">
              {attachment.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 text-amber-700 shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-amber-700 shrink-0" />
              )}
              <span className="font-medium truncate">{attachment.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="rounded p-1 text-amber-700 hover:bg-amber-100 hover:text-amber-950 transition-colors"
              title="移除附件"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Main Input Box */}
        <div className="relative flex items-end gap-2 rounded-2xl border border-stone-300 bg-white p-2 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
            title="上傳課文教材文字檔、圖片或講義"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,text/plain,.md,.csv,.txt"
            className="hidden"
          />

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="請輸入欲設計提問的教學素材、主題、課文，或直接提出問題（例如：請幫我設計八年級數學「一次函數」提問...）"
            className="max-h-44 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => onSend()}
            disabled={isLoading || (!input.trim() && !attachment)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
              isLoading || (!input.trim() && !attachment)
                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                : 'bg-amber-600 text-white shadow-xs hover:bg-amber-700 active:scale-95'
            }`}
            title="送出 (Enter)"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
          <span className="font-semibold text-stone-600">快速追問指引：</span>
          <button
            type="button"
            onClick={() => {
              setInput('上面你提供的初始問題，請都幫我加入"6C批判性思維與協作指標"，促進學生可以達到深度思辨與小組探究的學習目標，請重新提問。');
            }}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors"
          >
            🌸 加入 6C 能力
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('上面你提供的初始問題，請都幫我加入"當前聯合國SDGs永續發展或當代社會爭議面向"，促進學生可以達到關懷公眾問題的學習目標，請重新提問。');
            }}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors"
          >
            🌸 加入議題角度
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('上面你提供的初始問題，請都幫我加入"多元角色人物的衝突立場"，促進學生可以達到同理與跨立場批判的學習目標，請重新提問。');
            }}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors"
          >
            🌸 加入人物觀點
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('我要進入類型🅱️請模擬回答這個問題："在這個情境下，究竟該以效率優先還是公平優先？"');
            }}
            className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800 transition-colors"
          >
            😀 進入類型🅱️ 利害關係人模擬
          </button>
        </div>
      </div>
    </div>
  );
};
