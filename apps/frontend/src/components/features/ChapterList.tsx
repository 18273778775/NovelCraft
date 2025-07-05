import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  GripVertical,
  FileText,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChapterListItem } from '@/lib/chapters-api';
import { useChapters, useDeleteChapter, useUpdateChapterOrder } from '@/hooks/useChapters';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChapterListProps {
  projectId: string;
  onCreateChapter: () => void;
  onEditChapter: (chapter: ChapterListItem) => void;
}

export function ChapterList({ projectId, onCreateChapter, onEditChapter }: ChapterListProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { data: chapters = [], isLoading } = useChapters(projectId);
  const deleteChapterMutation = useDeleteChapter();
  const updateOrderMutation = useUpdateChapterOrder();
  const { toast } = useToast();

  const handleDelete = async (chapter: ChapterListItem) => {
    if (!confirm(`确定要删除章节"${chapter.title}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      await deleteChapterMutation.mutateAsync(chapter.id);
      toast({
        title: '删除成功',
        description: `章节"${chapter.title}"已被删除`,
      });
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message || '删除章节时出现错误',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const chapterId = result.draggableId;
    const newOrder = destinationIndex + 1; // Orders are 1-based

    try {
      await updateOrderMutation.mutateAsync({ chapterId, order: newOrder });
      toast({
        title: '排序更新',
        description: '章节顺序已更新',
      });
    } catch (error: any) {
      toast({
        title: '排序失败',
        description: error.message || '更新章节顺序时出现错误',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg border animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">章节列表</h3>
        <Button onClick={onCreateChapter} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          新建章节
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold mb-2">还没有章节</h4>
          <p className="text-muted-foreground mb-4">
            创建第一个章节开始您的创作
          </p>
          <Button onClick={onCreateChapter}>
            <Plus className="mr-2 h-4 w-4" />
            创建章节
          </Button>
        </div>
      ) : (
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="chapters">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {chapters.map((chapter, index) => (
                  <Draggable
                    key={chapter.id}
                    draggableId={chapter.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          border rounded-lg p-4 bg-background transition-shadow
                          ${snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'}
                          ${isDragging && !snapshot.isDragging ? 'opacity-50' : ''}
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <Link
                                to={`/projects/${projectId}/chapters/${chapter.id}`}
                                className="text-lg font-medium hover:text-primary transition-colors truncate"
                              >
                                {chapter.title}
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEditChapter(chapter)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(chapter)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{chapter.wordCount} 字</span>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(chapter.updatedAt)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                第 {chapter.order} 章
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
