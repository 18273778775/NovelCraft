// Text processing utilities
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }
  
  // Remove markdown syntax and count words
  const cleanText = text
    .replace(/[#*_`~\[\]()]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return cleanText.split(' ').filter(word => word.length > 0).length;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
  
  return formatDate(date);
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 6 characters
  return password.length >= 6;
}

// API utilities
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
) {
  return {
    success,
    data,
    message,
    error,
  };
}

// File utilities
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isMarkdownFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ext === 'md' || ext === 'markdown';
}

// Chapter utilities
export function generateChapterTitle(index: number): string {
  return `第${index}章`;
}

export function extractChapterFromMarkdown(content: string): {
  title: string;
  content: string;
}[] {
  const chapters: { title: string; content: string }[] = [];
  const lines = content.split('\n');
  
  let currentChapter: { title: string; content: string } | null = null;
  
  for (const line of lines) {
    // Check if line is a chapter heading (# or ##)
    const headingMatch = line.match(/^#{1,2}\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous chapter if exists
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      
      // Start new chapter
      currentChapter = {
        title: headingMatch[1].trim(),
        content: '',
      };
    } else if (currentChapter) {
      // Add line to current chapter content
      currentChapter.content += line + '\n';
    }
  }
  
  // Add last chapter
  if (currentChapter) {
    chapters.push(currentChapter);
  }
  
  return chapters.map(chapter => ({
    ...chapter,
    content: chapter.content.trim(),
  }));
}
