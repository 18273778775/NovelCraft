import { useState } from 'react';
import { Plus, MoreHorizontal, Edit, Trash2, FileText, Clock, Lightbulb, Users, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentListItem } from '@/lib/documents-api';
import { useGroupedDocuments, useDeleteDocument, useCreateDefaultDocuments } from '@/hooks/useDocuments';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { DocumentType } from '@novel-craft/shared';

interface DocumentListProps {
  projectId: string;
  onCreateDocument: (type?: DocumentType) => void;
  onEditDocument: (document: DocumentListItem) => void;
  onOpenDocument: (documentId: string) => void;
}

const documentTypeConfig = {
  [DocumentType.OUTLINE]: {
    label: '大纲',
    icon: Lightbulb,
    color: 'bg-blue-100 text-blue-800',
  },
  [DocumentType.CHARACTERS]: {
    label: '人设',
    icon: Users,
    color: 'bg-green-100 text-green-800',
  },
  [DocumentType.WORLDBUILDING]: {
    label: '世界观',
    icon: Globe,
    color: 'bg-purple-100 text-purple-800',
  },
  [DocumentType.OTHER]: {
    label: '其他',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
  },
};

export function DocumentList({ 
  projectId, 
  onCreateDocument, 
  onEditDocument, 
  onOpenDocument 
}: DocumentListProps) {
  const [activeTab, setActiveTab] = useState('all');
  const { data: groupedDocuments, isLoading } = useGroupedDocuments(projectId);
  const deleteDocumentMutation = useDeleteDocument();
  const createDefaultsMutation = useCreateDefaultDocuments();
  const { toast } = useToast();

  const allDocuments = groupedDocuments ? [
    ...groupedDocuments.outline,
    ...groupedDocuments.characters,
    ...groupedDocuments.worldbuilding,
    ...groupedDocuments.other,
  ] : [];

  const handleDelete = async (document: DocumentListItem) => {
    if (!confirm(`确定要删除文档"${document.title}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      await deleteDocumentMutation.mutateAsync(document.id);
      toast({
        title: '删除成功',
        description: `文档"${document.title}"已被删除`,
      });
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message || '删除文档时出现错误',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDefaults = async () => {
    try {
      await createDefaultsMutation.mutateAsync(projectId);
      toast({
        title: '创建成功',
        description: '默认文档已创建',
      });
    } catch (error: any) {
      toast({
        title: '创建失败',
        description: error.message || '创建默认文档时出现错误',
        variant: 'destructive',
      });
    }
  };

  const renderDocumentCard = (document: any) => {
    const config = documentTypeConfig[document.type as DocumentType];
    const Icon = config.icon;

    return (
      <Card key={document.id} className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle 
                className="text-lg hover:text-primary transition-colors"
                onClick={() => onOpenDocument(document.id)}
              >
                {document.title}
              </CardTitle>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditDocument(document)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(document)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={config.color}>
              {config.label}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {formatDate(document.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-lg border animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">项目文档</h3>
        <div className="flex items-center space-x-2">
          {allDocuments.length === 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateDefaults}
              disabled={createDefaultsMutation.isPending}
            >
              创建默认文档
            </Button>
          )}
          <Button onClick={() => onCreateDocument()} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新建文档
          </Button>
        </div>
      </div>

      {allDocuments.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold mb-2">还没有文档</h4>
          <p className="text-muted-foreground mb-4">
            创建文档来管理您的故事大纲、人物设定等
          </p>
          <div className="flex justify-center space-x-2">
            <Button onClick={handleCreateDefaults} variant="outline">
              创建默认文档
            </Button>
            <Button onClick={() => onCreateDocument()}>
              <Plus className="mr-2 h-4 w-4" />
              新建文档
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部 ({allDocuments.length})</TabsTrigger>
            <TabsTrigger value="outline">
              大纲 ({groupedDocuments?.outline.length || 0})
            </TabsTrigger>
            <TabsTrigger value="characters">
              人设 ({groupedDocuments?.characters.length || 0})
            </TabsTrigger>
            <TabsTrigger value="worldbuilding">
              世界观 ({groupedDocuments?.worldbuilding.length || 0})
            </TabsTrigger>
            <TabsTrigger value="other">
              其他 ({groupedDocuments?.other.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allDocuments.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="outline" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedDocuments?.outline.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedDocuments?.characters.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="worldbuilding" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedDocuments?.worldbuilding.map(renderDocumentCard)}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedDocuments?.other.map(renderDocumentCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
