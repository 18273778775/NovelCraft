import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChapterListItem } from '@/lib/chapters-api';
import { useCreateChapter, useUpdateChapter } from '@/hooks/useChapters';
import { useToast } from '@/hooks/use-toast';

const chapterSchema = z.object({
  title: z.string().min(1, '章节标题不能为空').max(100, '章节标题不能超过100字符'),
  order: z.number().min(1, '章节顺序必须大于0').optional(),
});

type ChapterForm = z.infer<typeof chapterSchema>;

interface ChapterDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  chapter?: ChapterListItem | null;
}

export function ChapterDialog({ open, onClose, projectId, chapter }: ChapterDialogProps) {
  const isEditing = !!chapter;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChapterForm>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: '',
      order: undefined,
    },
  });

  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();

  const isLoading = createChapterMutation.isPending || updateChapterMutation.isPending;

  useEffect(() => {
    if (chapter) {
      reset({
        title: chapter.title,
        order: chapter.order,
      });
    } else {
      reset({
        title: '',
        order: undefined,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data: ChapterForm) => {
    try {
      if (isEditing && chapter) {
        await updateChapterMutation.mutateAsync({
          chapterId: chapter.id,
          data,
        });
        toast({
          title: '更新成功',
          description: '章节信息已更新',
        });
      } else {
        await createChapterMutation.mutateAsync({
          projectId,
          data: {
            ...data,
            content: '', // Start with empty content
          },
        });
        toast({
          title: '创建成功',
          description: '新章节已创建',
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: isEditing ? '更新失败' : '创建失败',
        description: error.message || '操作失败，请重试',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '编辑章节' : '创建新章节'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">章节标题</Label>
            <Input
              id="title"
              placeholder="输入章节标题"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">章节顺序（可选）</Label>
            <Input
              id="order"
              type="number"
              min="1"
              placeholder="留空自动排序"
              {...register('order', { valueAsNumber: true })}
              className={errors.order ? 'border-destructive' : ''}
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              留空将自动添加到末尾
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
