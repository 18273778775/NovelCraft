import { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  MoreHorizontal,
  Wand2,
  BarChart3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AiPolishDialog } from './AiPolishDialog';
import { AiRewriteDialog } from './AiRewriteDialog';
import { AiSuggestionsDialog } from './AiSuggestionsDialog';
import { AiAnalysisDialog } from './AiAnalysisDialog';
import { useAiProviders } from '@/hooks/useAI';

interface AiToolbarProps {
  selectedText?: string;
  onTextReplace?: (newText: string) => void;
  className?: string;
}

export function AiToolbar({ selectedText, onTextReplace, className }: AiToolbarProps) {
  const [polishDialogOpen, setPolishDialogOpen] = useState(false);
  const [rewriteDialogOpen, setRewriteDialogOpen] = useState(false);
  const [suggestionsDialogOpen, setSuggestionsDialogOpen] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  const { data: providers } = useAiProviders();
  const availableProviders = providers?.filter(p => p.available) || [];

  const hasSelectedText = selectedText && selectedText.trim().length > 0;

  const handlePolishComplete = (polishedText: string) => {
    if (onTextReplace) {
      onTextReplace(polishedText);
    }
    setPolishDialogOpen(false);
  };

  const handleRewriteComplete = (rewrittenText: string) => {
    if (onTextReplace) {
      onTextReplace(rewrittenText);
    }
    setRewriteDialogOpen(false);
  };

  return (
    <>
      <div className={`flex items-center space-x-2 p-2 border rounded-lg bg-background ${className}`}>
        <div className="flex items-center space-x-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI助手</span>
          {availableProviders.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {availableProviders.length} 个可用
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPolishDialogOpen(true)}
            disabled={!hasSelectedText}
            title={hasSelectedText ? '润色选中文本' : '请先选择文本'}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            润色
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRewriteDialogOpen(true)}
            disabled={!hasSelectedText}
            title={hasSelectedText ? '改写选中文本' : '请先选择文本'}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            改写
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSuggestionsDialogOpen(true)}
            disabled={!hasSelectedText}
            title={hasSelectedText ? '获取写作建议' : '请先选择文本'}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            建议
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setAnalysisDialogOpen(true)}
                disabled={!hasSelectedText}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                文本分析
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                批量处理（即将推出）
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!hasSelectedText && (
          <div className="text-xs text-muted-foreground ml-auto">
            选择文本以使用AI功能
          </div>
        )}
      </div>

      {/* AI Dialogs */}
      <AiPolishDialog
        open={polishDialogOpen}
        onClose={() => setPolishDialogOpen(false)}
        text={selectedText || ''}
        onComplete={handlePolishComplete}
      />

      <AiRewriteDialog
        open={rewriteDialogOpen}
        onClose={() => setRewriteDialogOpen(false)}
        text={selectedText || ''}
        onComplete={handleRewriteComplete}
      />

      <AiSuggestionsDialog
        open={suggestionsDialogOpen}
        onClose={() => setSuggestionsDialogOpen(false)}
        text={selectedText || ''}
      />

      <AiAnalysisDialog
        open={analysisDialogOpen}
        onClose={() => setAnalysisDialogOpen(false)}
        text={selectedText || ''}
      />
    </>
  );
}
