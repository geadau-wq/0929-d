import React, { useState } from 'react';
import { X, BookMarked, Calculator, BookOpen, Globe2, Sparkles, Award } from 'lucide-react';
import { PEDAGOGICAL_GUIDES } from '../data/pedagogicalData';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'math' | 'chinese' | 'english' | 'native' | '6c'>('math');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-stone-200 flex flex-col max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <BookMarked className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">教學提問知識庫與學科指引</h2>
              <p className="text-xs text-stone-600">滔滔學與優履團隊研製 · 涵蓋各科素養提問法與能力概念</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-white px-6 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('math')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'math'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            數學提問技巧 (#109)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chinese')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'chinese'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            國語文文本能力概念
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('english')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'english'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            英語文能力概念 (ELA)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('native')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'native'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            本土語與台式拼音規範
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('6c')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === '6c'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            6C 深度學習關鍵能力
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-800">
          {activeTab === 'math' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold">#109 透過口語提問觸發素養培養與評量：</span>
                所有數學提問環繞在數學元素、思維、系統、多元表徵、結構、關係、解題與技能。每個提問均附有激發思考性的陳述 (Provocative Statement)。
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {PEDAGOGICAL_GUIDES.math.items.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                    <h3 className="text-sm font-bold text-amber-900 mb-1.5 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">
                        {idx + 1}
                      </span>
                      {item.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-stone-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chinese' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold">國語文專注於文本分析與能力概念：</span>
                依據記敘、抒情、說明、議論、應用及新詩等文本類型，提問必須深度扣合該文本的核心能力概念。
                <span className="font-semibold text-rose-700 ml-1">第一層級提問必須包含至少兩個能力概念問題</span>。
              </div>
              <div className="space-y-3">
                {PEDAGOGICAL_GUIDES.mandarin.genres.map((g, idx) => (
                  <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-stone-900">{g.type}</h3>
                      <span className="text-[11px] text-stone-500 font-medium">內容範圍：{g.scope}</span>
                    </div>
                    <div className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200/70 leading-relaxed">
                      <span className="font-semibold text-amber-800">能力概念：</span>
                      {g.concepts}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'english' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold">English Language Arts (ELA) 規範：</span>
                提供「文本依賴性問題 (Text-dependent questions)」與「與能力概念 (Concepts in competency) 相關問題」。
                以中英雙語對照呈現，並依照學生年段/ESL等級調適字彙範圍。
              </div>
              <ul className="space-y-2.5">
                {PEDAGOGICAL_GUIDES.english.concepts.map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rounded-lg border border-stone-200 bg-stone-50/60 p-3 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-100 font-bold text-amber-800">
                      {idx + 1}
                    </span>
                    <span className="text-stone-700 leading-relaxed">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'native' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold">本土語文（閩南語、客語、原住民族語、閩東語）原則：</span>
                著重聽、說、讀的語言學習能力，以及主題單元內容涉及的文化、認同、族群價值觀與俚語。
              </div>
              <div className="space-y-3">
                {PEDAGOGICAL_GUIDES.native.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50/60 p-3.5 text-xs text-stone-700 leading-relaxed">
                    <span className="h-2 w-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === '6c' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-3.5 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold">6C 全球深度學習能力指標：</span>
                當使用者追問「加入 6C 能力」時，提問機器人將這些關鍵指標具體融入原始提問之中，促進高層次思維。
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {PEDAGOGICAL_GUIDES.sixC.items.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/50 p-4">
                    <h3 className="text-sm font-bold text-amber-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            了解並返回
          </button>
        </div>
      </div>
    </div>
  );
};
