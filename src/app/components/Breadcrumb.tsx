import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      {/* 首页图标 */}
      <Home className="w-4 h-4 text-[#8C8C8C]" />

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-[#BFBFBF]" />
            {item.onClick && !isLast ? (
              <button
                onClick={item.onClick}
                className="text-[#595959] hover:text-[#1890FF] transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-[#262626] font-medium' : 'text-[#595959]'}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
