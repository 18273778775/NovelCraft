import { useState } from 'react';
import { Plus } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/features/ProjectCard';
import { ProjectDialog } from '@/components/features/ProjectDialog';
import { ProjectWithStats } from '@/lib/projects-api';

export function DashboardPage() {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithStats | null>(null);

  const { data: projectsData, isLoading } = useProjects({ limit: 6 });
  const projects = projectsData?.data || [];

  const totalProjects = projectsData?.total || 0;
  const totalChapters = projects.reduce((sum, p) => sum + p._count.chapters, 0);

  const handleEditProject = (project: ProjectWithStats) => {
    setEditingProject(project);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">欢迎回来，{user?.username}！</h1>
          <p className="text-muted-foreground">
            这里是您的小说创作工作台
          </p>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建项目
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">我的项目</h3>
          <p className="text-2xl font-bold text-primary">{totalProjects}</p>
          <p className="text-sm text-muted-foreground">个项目</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">总章节数</h3>
          <p className="text-2xl font-bold text-primary">{totalChapters}</p>
          <p className="text-sm text-muted-foreground">个章节</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">总字数</h3>
          <p className="text-2xl font-bold text-primary">0</p>
          <p className="text-sm text-muted-foreground">字</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">最近项目</h2>
          {totalProjects > 6 && (
            <Button variant="outline" size="sm">
              查看全部
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg border animate-pulse bg-muted" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
            <p className="text-muted-foreground mb-4">
              创建您的第一个小说项目开始写作之旅
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建项目
            </Button>
          </div>
        )}
      </div>

      <ProjectDialog
        open={isCreateDialogOpen || !!editingProject}
        onClose={handleCloseDialog}
        project={editingProject}
      />
    </div>
  );
}
