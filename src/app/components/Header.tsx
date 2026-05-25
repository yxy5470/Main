import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [showDropdown, setShowDropdown] = useState(true);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">首页</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-medium">
            吴
          </div>
          <span className="font-medium text-foreground">吴嘉乐</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
            <button className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3">
              <span className="text-xl">🖥️</span>
              <span className="text-base">回到大屏</span>
            </button>
            <button className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-red-600">
              <span className="text-xl">🚪</span>
              <span className="text-base">退出登录</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
