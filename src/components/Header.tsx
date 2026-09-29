import React from 'react';
import { BookOpen, Sparkles, PlusCircle, Share2, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHandbook: () => void;
  onNewChat: () => void;
  onExportMarkdown: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHandbook,
  onNewChat,
  onExportMarkdown,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-stone-900 sm:text-lg tracking-tight">
                高優計劃機器人：提問設計
              </h1>
              <span className="hidden sm:inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                GoodQuestioner
              </span>
            </div>
            <p className="text-xs text-stone-600">
              滔滔學（ＥＬＡ）與優履團隊（ＵＮＩ）教育研製 · 四層次素養提問設計小幫手
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenHandbook}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-xs hover:bg-stone-50 hover:text-stone-900 transition-colors"
            title="查看學科提問技巧與能力概念知識庫"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden md:inline">提問知識庫與指南</span>
            <span className="md:hidden">指南</span>
          </button>

          {hasMessages && (
            <button
              type="button"
              onClick={onExportMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-xs hover:bg-stone-50 hover:text-stone-900 transition-colors"
              title="匯出目前提問設計為 Markdown 檔案"
            >
              <Share2 className="h-3.5 w-3.5 text-stone-500" />
              <span className="hidden sm:inline">匯出教案</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNewChat}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-stone-800 transition-colors"
            title="開啟新的提問設計對話"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>新提問設計</span>
          </button>
        </div>
      </div>
    </header>
  );
};
