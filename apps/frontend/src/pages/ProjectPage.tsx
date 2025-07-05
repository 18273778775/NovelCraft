import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChapterList } from '@/components/features/ChapterList';
import { DocumentList } from '@/components/features/DocumentList';
import { ChapterDialog } from '@/components/features/ChapterDialog';
import { DocumentDialog } from '@/components/features/DocumentDialog';
import { useProject, useProjectStats } from '@/hooks/useProjects';
import { ChapterListItem } from '@/lib/chapters-api';
import { DocumentListItem } from '@/lib/documents-api';
import { DocumentType } from '@novel-craft/shared';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterListItem | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentListItem | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | undefined>();

  const { data: project, isLoading: projectLoading } = useProject(projectId!);
  const { data: stats } = useProjectStats(projectId!);

  const handleCreateChapter = () => {
    setEditingChapter(null);
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: ChapterListItem) => {
    setEditingChapter(chapter);
    setIsChapterDialogOpen(true);
  };

  const handleCreateDocument = (type?: DocumentType) => {
    setEditingDocument(null);
    setDocumentType(type);
    setIsDocumentDialogOpen(true);
  };

  const handleEditDocument = (document: DocumentListItem) => {
    setEditingDocument(document);
    setDocumentType(undefined);
    setIsDocumentDialogOpen(true);
  };

  const handleOpenDocument = (documentId: string) => {
    // TODO: Navigate to document editor
    console.log('Open document:', documentId);
  };

  const handleCloseChapterDialog = () => {
    setIsChapterDialogOpen(false);
    setEditingChapter(null);
  };

  const handleCloseDocumentDialog = () => {
    setIsDocumentDialogOpen(false);
    setEditingDocument(null);
    setDocumentType(undefined);
  };

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">项目未找到</h1>
        <p className="text-muted-foreground">请检查项目ID是否正确</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            设置
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            统计
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">章节数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chapterCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总字数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">文档数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documentCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="chapters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chapters">章节管理</TabsTrigger>
          <TabsTrigger value="documents">项目文档</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          <ChapterList
            projectId={projectId!}
            onCreateChapter={handleCreateChapter}
            onEditChapter={handleEditChapter}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentList
            projectId={projectId!}
            onCreateDocument={handleCreateDocument}
            onEditDocument={handleEditDocument}
            onOpenDocument={handleOpenDocument}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ChapterDialog
        open={isChapterDialogOpen}
        onClose={handleCloseChapterDialog}
        projectId={projectId!}
        chapter={editingChapter}
      />

      <DocumentDialog
        open={isDocumentDialogOpen}
        onClose={handleCloseDocumentDialog}
        projectId={projectId!}
        document={editingDocument}
        defaultType={documentType}
      />
    </div>
  );
}
