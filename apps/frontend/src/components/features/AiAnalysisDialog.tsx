import { useState } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyzeText, useAiProviders } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResponse } from '@/lib/ai-api';

interface AiAnalysisDialogProps {
  open: boolean;
  onClose: () => void;
  text: string;
}

export function AiAnalysisDialog({ open, onClose, text }: AiAnalysisDialogProps) {
  const [provider, setProvider] = useState('deepseek');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const { data: providers } = useAiProviders();
  const analysisMutation = useAnalyzeText();
  const { toast } = useToast();

  const availableProviders = providers?.filter(p => p.available) || [];

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: '错误',
        description: '请提供要分析的文本',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await analysisMutation.mutateAsync({
        text,
        context: context || undefined,
        provider,
      });

      setResult(response);
      toast({
        title: '分析完成',
        description: `使用 ${response.provider} 成功分析文本`,
      });
    } catch (error: any) {
      toast({
        title: '分析失败',
        description: error.message || '分析过程中出现错误',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            AI文本分析
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>字数统计</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                {text.length} 字符
              </div>
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
            onClick={handleAnalyze}
            disabled={analysisMutation.isPending || !text.trim()}
            className="w-full"
          >
            {analysisMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            开始分析
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">语法建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {result.suggestions.grammar ? '已生成' : '暂无建议'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">文体建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {result.suggestions.style ? '已生成' : '暂无建议'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">情节建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {result.suggestions.plot ? '已生成' : '暂无建议'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.suggestions.grammar && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">语法建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap">
                      {result.suggestions.grammar.suggestions}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.suggestions.style && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">文体建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap">
                      {result.suggestions.style.suggestions}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.suggestions.plot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">情节建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap">
                      {result.suggestions.plot.suggestions}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
