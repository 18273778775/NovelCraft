import { useState } from 'react';
import { Loader2, Copy, Check, RefreshCw } from 'lucide-react';

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
import { useRewriteText, useAiProviders } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface AiRewriteDialogProps {
  open: boolean;
  onClose: () => void;
  text: string;
  onComplete: (rewrittenText: string) => void;
}

const toneOptions = [
  { value: 'serious', label: '严肃' },
  { value: 'humorous', label: '幽默' },
  { value: 'dramatic', label: '戏剧性' },
  { value: 'romantic', label: '浪漫' },
];

const lengthOptions = [
  { value: 'same', label: '保持长度' },
  { value: 'shorter', label: '更简洁' },
  { value: 'longer', label: '更详细' },
];

const perspectiveOptions = [
  { value: '', label: '保持原视角' },
  { value: 'first', label: '第一人称' },
  { value: 'third', label: '第三人称' },
];

export function AiRewriteDialog({ open, onClose, text, onComplete }: AiRewriteDialogProps) {
  const [tone, setTone] = useState('serious');
  const [length, setLength] = useState('same');
  const [perspective, setPerspective] = useState('');
  const [provider, setProvider] = useState('doubao');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { data: providers } = useAiProviders();
  const rewriteMutation = useRewriteText();
  const { toast } = useToast();

  const availableProviders = providers?.filter(p => p.available) || [];

  const handleRewrite = async () => {
    if (!text.trim()) {
      toast({
        title: '错误',
        description: '请提供要改写的文本',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await rewriteMutation.mutateAsync({
        text,
        tone: tone as any,
        length: length as any,
        perspective: perspective as any || undefined,
        context: context || undefined,
        provider,
      });

      setResult(response.rewrittenText);
      toast({
        title: '改写完成',
        description: `使用 ${response.provider} 成功改写文本`,
      });
    } catch (error: any) {
      toast({
        title: '改写失败',
        description: error.message || '改写过程中出现错误',
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
        description: '改写后的文本已复制到剪贴板',
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
            <RefreshCw className="mr-2 h-5 w-5" />
            AI文本改写
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>语调风格</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>长度要求</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lengthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>视角调整</Label>
              <Select value={perspective} onValueChange={setPerspective}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {perspectiveOptions.map((option) => (
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
                placeholder="提供额外的背景信息..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleRewrite}
              disabled={rewriteMutation.isPending || !text.trim()}
              className="w-full"
            >
              {rewriteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              开始改写
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
              <Label>改写结果</Label>
              <Textarea
                value={result}
                readOnly
                placeholder="改写结果将在这里显示..."
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
