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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProjectWithStats } from '@/lib/projects-api';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  title: z.string().min(1, '项目标题不能为空').max(100, '项目标题不能超过100字符'),
  description: z.string().max(500, '项目描述不能超过500字符').optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: ProjectWithStats | null;
}

export function ProjectDialog({ open, onClose, project }: ProjectDialogProps) {
  const isEditing = !!project;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending;

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
      });
    } else {
      reset({
        title: '',
        description: '',
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectForm) => {
    try {
      if (isEditing && project) {
        await updateProjectMutation.mutateAsync({
          id: project.id,
          data,
        });
        toast({
          title: '更新成功',
          description: '项目信息已更新',
        });
      } else {
        await createProjectMutation.mutateAsync(data);
        toast({
          title: '创建成功',
          description: '新项目已创建',
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
            {isEditing ? '编辑项目' : '创建新项目'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">项目标题</Label>
            <Input
              id="title"
              placeholder="输入项目标题"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">项目描述（可选）</Label>
            <Textarea
              id="description"
              placeholder="简要描述您的项目..."
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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
