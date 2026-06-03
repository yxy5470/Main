import { X } from 'lucide-react';

export interface Tab {
  key: string;
  label: string;
  closable: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeKey: string;
  onTabClick: (key: string) => void;
  onTabClose: (key: string) => void;
}

export function TabBar({ tabs, activeKey, onTabClick, onTabClose }: TabBarProps) {
  return (
    <div className="h-10 bg-white border-b border-slate-200 px-6 flex items-center gap-1 flex-shrink-0 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <div
            key={tab.key}
            className={`
              h-8 px-3 rounded-t flex items-center gap-2 cursor-pointer transition-colors flex-shrink-0
              ${isActive
                ? 'bg-[#E6F7FF] text-[#1890FF] border-t-2 border-[#1890FF]'
                : 'bg-transparent text-[#595959] hover:bg-slate-50 border-t-2 border-transparent'
              }
            `}
            onClick={() => onTabClick(tab.key)}
          >
            <span className="text-sm whitespace-nowrap select-none">{tab.label}</span>
            {tab.closable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.key);
                }}
                className={`
                  w-4 h-4 rounded flex items-center justify-center transition-colors
                  ${isActive
                    ? 'hover:bg-[#91D5FF] text-[#1890FF]'
                    : 'hover:bg-slate-200 text-[#8C8C8C]'
                  }
                `}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
