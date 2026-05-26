import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, X, Check } from 'lucide-react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  data: TreeNode[];
}

export function TreeSelect({ value, onChange, placeholder = "请选择", data }: TreeSelectProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedId, setSelectedId] = useState(value);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']));

  const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedPath = () => {
    if (!selectedId) return placeholder;
    const node = findNodeById(data, selectedId);
    if (!node) return placeholder;

    const path: string[] = [];
    const buildPath = (nodes: TreeNode[], targetId: string, currentPath: string[] = []): boolean => {
      for (const n of nodes) {
        const newPath = [...currentPath, n.label];
        if (n.id === targetId) {
          path.push(...newPath);
          return true;
        }
        if (n.children && buildPath(n.children, targetId, newPath)) {
          return true;
        }
      }
      return false;
    };
    buildPath(data, selectedId);

    const pathString = path.join(' / ');
    if (pathString.length > 16) {
      return pathString.substring(0, 16) + '…';
    }
    return pathString;
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(undefined);
    onChange?.('');
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;
    const isHovered = hoveredId === node.id;

    return (
      <div key={node.id}>
        <div
          className="flex items-center h-8 px-3 cursor-pointer hover:bg-[#F0F7FF] transition-colors"
          style={{
            paddingLeft: `${level * 24 + 12}px`,
            backgroundColor: isHovered && isSelected ? '#F0F7FF' : isHovered ? '#F9FAFB' : 'transparent'
          }}
          onClick={() => {
            if (!hasChildren) {
              handleSelect(node.id);
            }
          }}
          onMouseEnter={() => setHoveredId(node.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="w-4 h-4 flex items-center justify-center mr-1 text-[#6B7280] hover:text-[#374151]"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <span className={`flex-1 text-sm ${hasChildren ? 'text-[#374151] font-medium' : 'text-[#4B5563]'}`}>
            {node.label}
          </span>

          {isSelected && (
            <Check className="w-4 h-4 text-[#1D4ED8] ml-2" strokeWidth={2.5} />
          )}
        </div>

        {hasChildren && isExpanded && node.children?.map(child => renderTreeNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="inline-block relative">
      <div
        className="w-60 h-9 border-2 border-[#3B82F6] rounded bg-white px-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-[#374151] truncate">{getSelectedPath()}</span>
        <div className="flex items-center gap-1 ml-2">
          {selectedId && (
            <button
              onClick={handleClear}
              className="w-4 h-4 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="text-[#6B7280]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-60 bg-white border border-[#E5E7EB] rounded shadow-lg z-50 max-h-64 overflow-y-auto py-1">
          {data.map(node => renderTreeNode(node))}
        </div>
      )}
    </div>
  );
}
