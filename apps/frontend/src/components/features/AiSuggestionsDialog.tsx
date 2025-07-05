import { useState } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateSuggestions, useAiProviders } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface AiSuggestionsDialogProps {
  open: boolean;
  onClose: () => void;
  text: string;
}

const suggestionTypes = [
  { value: 'plot', label: '情节发展' },
  { value: 'character', label: '人物塑造' },
  { value: 'dialogue', label: '对话优化' },
  { value: 'description', label: '场景描写' },
];

export function AiSuggestionsDialog({ open, onClose, text }: AiSuggestionsDialogProps) {
  const [type, setType] = useState('plot');
  const [provider, setProvider] = useState('doubao');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<string>('');

  const { data: providers } = useAiProviders();
  const suggestionsMutation = useGenerateSuggestions();
  const { toast } = useToast();

  const availableProviders = providers?.filter(p => p.available) || [];

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: '错误',
        description: '请提供要分析的文本',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await suggestionsMutation.mutateAsync({
        text,
        type: type as any,
        context: context || undefined,
        provider,
      });

      setResult(response.suggestions);
      toast({
        title: '建议生成完成',
        description: `使用 ${response.provider} 成功生成建议`,
      });
    } catch (error: any) {
      toast({
        title: '生成失败',
        description: error.message || '生成建议时出现错误',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setResult('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            AI写作建议
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>建议类型</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suggestionTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI提供商</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.map((p) => (
                    <SelectItem key={p.type} value={p.type}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>上下文信息（可选）</Label>
            <Textarea
              placeholder="提供额外的背景信息..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>分析文本</Label>
            <Textarea
              value={text}
              readOnly
              className="min-h-[100px] bg-muted"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={suggestionsMutation.isPending || !text.trim()}
            className="w-full"
          >
            {suggestionsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            生成建议
          </Button>

          {result && (
            <div className="space-y-2">
              <Label>AI建议</Label>
              <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
