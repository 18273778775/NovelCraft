import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Edit, Trash2, FileText, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectWithStats } from '@/lib/projects-api';
import { formatDate, truncateText } from '@/lib/utils';
import { useDeleteProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface ProjectCardProps {
  project: ProjectWithStats;
  onEdit: (project: ProjectWithStats) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteProjectMutation = useDeleteProject();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`确定要删除项目"${project.title}"吗？此操作不可撤销。`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast({
        title: '删除成功',
        description: `项目"${project.title}"已被删除`,
      });
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message || '删除项目时出现错误',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            <Link
              to={`/projects/${project.id}`}
              className="hover:text-primary transition-colors"
            >
              {project.title}
            </Link>
          </CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground">
            {truncateText(project.description, 100)}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="mr-1 h-4 w-4" />
            {project._count.chapters} 章节
          </div>
          <div className="flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            {project._count.documents} 文档
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <Badge variant="secondary" className="text-xs">
            {formatDate(project.updatedAt)}
          </Badge>
          
          <Link to={`/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              打开项目
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
