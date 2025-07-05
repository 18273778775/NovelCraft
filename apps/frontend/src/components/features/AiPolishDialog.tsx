import { useState } from 'react';
import { Loader2, Copy, Check, Wand2 } from 'lucide-react';

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
import { usePolishText, useAiProviders } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface AiPolishDialogProps {
  open: boolean;
  onClose: () => void;
  text: string;
  onComplete: (polishedText: string) => void;
}

const styleOptions = [
  { value: 'literary', label: '文学风格' },
  { value: 'formal', label: '正式风格' },
  { value: 'casual', label: '轻松风格' },
  { value: 'modern', label: '现代风格' },
];

const focusOptions = [
  { value: 'all', label: '全面优化' },
  { value: 'grammar', label: '语法修正' },
  { value: 'style', label: '文体改进' },
  { value: 'flow', label: '流畅性' },
];

export function AiPolishDialog({ open, onClose, text, onComplete }: AiPolishDialogProps) {
  const [style, setStyle] = useState('literary');
  const [focus, setFocus] = useState('all');
  const [provider, setProvider] = useState('deepseek');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { data: providers } = useAiProviders();
  const polishMutation = usePolishText();
  const { toast } = useToast();

  const availableProviders = providers?.filter(p => p.available) || [];

  const handlePolish = async () => {
    if (!text.trim()) {
      toast({
        title: '错误',
        description: '请提供要润色的文本',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await polishMutation.mutateAsync({
        text,
        style: style as any,
        focus: focus as any,
        context: context || undefined,
        provider,
      });

      setResult(response.polishedText);
      toast({
        title: '润色完成',
        description: `使用 ${response.provider} 成功润色文本`,
      });
    } catch (error: any) {
      toast({
        title: '润色失败',
        description: error.message || '润色过程中出现错误',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: '已复制',
        description: '润色后的文本已复制到剪贴板',
      });
    }
  };

  const handleApply = () => {
    if (result) {
      onComplete(result);
    }
  };

  const handleClose = () => {
    setResult('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5" />
            AI文本润色
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>润色风格</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>重点关注</Label>
              <Select value={focus} onValueChange={setFocus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {focusOptions.map((option) => (
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

            <div className="space-y-2">
              <Label>上下文信息（可选）</Label>
              <Textarea
                placeholder="提供额外的背景信息以获得更好的润色效果..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handlePolish}
              disabled={polishMutation.isPending || !text.trim()}
              className="w-full"
            >
              {polishMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              开始润色
            </Button>
          </div>

          {/* Text Comparison Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>原文</Label>
              <Textarea
                value={text}
                readOnly
                className="min-h-[150px] bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>润色结果</Label>
              <Textarea
                value={result}
                readOnly
                placeholder="润色结果将在这里显示..."
                className="min-h-[150px]"
              />
            </div>

            {result && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1"
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? '已复制' : '复制'}
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  应用到编辑器
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
