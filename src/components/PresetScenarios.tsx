import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Calculator, Globe, Atom, Users, MessageSquare } from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../data/pedagogicalData';

interface PresetScenariosProps {
  onSelectScenario: (scenario: PresetScenario) => void;
}

export const PresetScenarios: React.FC<PresetScenariosProps> = ({ onSelectScenario }) => {
  const getIcon = (subject: string) => {
    switch (subject) {
      case '數學':
        return <Calculator className="h-4 w-4 text-emerald-600" />;
      case '國語文':
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case '英語文':
        return <Globe className="h-4 w-4 text-blue-600" />;
      case '自然科學':
        return <Atom className="h-4 w-4 text-purple-600" />;
      case '教育議題':
        return <Users className="h-4 w-4 text-rose-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          推薦教學提問設計範例（點選立即體驗）
        </h3>
        <span className="text-[11px] text-stone-400">涵蓋各學科素養規範</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PRESET_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelectScenario(scenario)}
            className="group flex flex-col justify-between text-left rounded-xl border border-stone-200/90 bg-white p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-xs hover:bg-stone-50/50 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-100 group-hover:bg-amber-100 transition-colors">
                    {getIcon(scenario.subject)}
                  </div>
                  <span className="text-xs font-semibold text-stone-700">{scenario.subject}</span>
                </div>
                <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                  {scenario.grade}
                </span>
              </div>

              <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                {scenario.title}
              </h4>
              <p className="mt-1 text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                {scenario.prompt}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
              <span className="font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {scenario.badge}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-stone-600 group-hover:text-amber-700 transition-colors">
                套用範例
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
