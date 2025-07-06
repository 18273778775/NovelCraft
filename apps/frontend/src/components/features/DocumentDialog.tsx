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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentListItem } from '@/lib/documents-api';
import { useCreateDocument, useUpdateDocument } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { DocumentType, DocumentTypeValue } from '@novel-craft/shared';

const documentSchema = z.object({
  title: z.string().min(1, '文档标题不能为空').max(100, '文档标题不能超过100字符'),
  type: z.enum(['OUTLINE', 'CHARACTERS', 'WORLDBUILDING', 'OTHER'] as const),
});

type DocumentForm = z.infer<typeof documentSchema>;

interface DocumentDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  document?: DocumentListItem | null;
  defaultType?: DocumentTypeValue;
}

const documentTypeOptions = [
  { value: DocumentType.OUTLINE, label: '故事大纲' },
  { value: DocumentType.CHARACTERS, label: '人物设定' },
  { value: DocumentType.WORLDBUILDING, label: '世界观设定' },
  { value: DocumentType.OTHER, label: '其他文档' },
];

export function DocumentDialog({ 
  open, 
  onClose, 
  projectId, 
  document, 
  defaultType 
}: DocumentDialogProps) {
  const isEditing = !!document;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      type: (defaultType || DocumentType.OTHER) as DocumentForm['type'],
    },
  });

  const createDocumentMutation = useCreateDocument();
  const updateDocumentMutation = useUpdateDocument();

  const isLoading = createDocumentMutation.isPending || updateDocumentMutation.isPending;
  const selectedType = watch('type');

  useEffect(() => {
    if (document) {
      reset({
        title: document.title,
        type: document.type as any,
      });
    } else {
      reset({
        title: '',
        type: (defaultType || DocumentType.OTHER) as DocumentForm['type'],
      });
    }
  }, [document, defaultType, reset]);

  const onSubmit = async (data: DocumentForm) => {
    try {
      if (isEditing && document) {
        await updateDocumentMutation.mutateAsync({
          documentId: document.id,
          data,
        });
        toast({
          title: '更新成功',
          description: '文档信息已更新',
        });
      } else {
        await createDocumentMutation.mutateAsync({
          projectId,
          data: {
            ...data,
            content: '', // Start with empty content
          },
        });
        toast({
          title: '创建成功',
          description: '新文档已创建',
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
            {isEditing ? '编辑文档' : '创建新文档'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">文档标题</Label>
            <Input
              id="title"
              placeholder="输入文档标题"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">文档类型</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as DocumentForm['type'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择文档类型" />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
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
