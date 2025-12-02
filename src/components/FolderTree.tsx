import { useState } from 'react';
import { FolderNode } from '@/data/stackTemplates';
import { cn } from '@/lib/utils';
import { ChevronRight, Folder, FolderOpen, FileText } from 'lucide-react';

interface FolderTreeProps {
  node: FolderNode;
  level?: number;
}

const TreeNode = ({ node, level = 0 }: FolderTreeProps) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200 group",
          "hover:bg-accent/50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        )}
        {!hasChildren && node.type === 'folder' && <span className="w-4" />}
        
        {node.type === 'folder' ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-primary" />
          ) : (
            <Folder className="w-4 h-4 text-primary" />
          )
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        
        <span className={cn(
          "font-mono text-sm",
          node.type === 'folder' ? "text-foreground" : "text-muted-foreground"
        )}>
          {node.name}
        </span>
        
        {node.description && (
          <span className="text-xs text-muted-foreground/60 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.description}
          </span>
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {node.children!.map((child, index) => (
            <TreeNode key={`${child.name}-${index}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree = ({ node }: FolderTreeProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">folder-structure</span>
      </div>
      <TreeNode node={node} />
    </div>
  );
};
