import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChapterDialog } from '../ChapterDialog';

// Mock the hooks
vi.mock('@/hooks/useChapters', () => ({
  useCreateChapter: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateChapter: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ChapterDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    projectId: 'test-project-id',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create chapter dialog', () => {
    render(<ChapterDialog {...defaultProps} />, { wrapper: createWrapper() });
    
    expect(screen.getByText('创建新章节')).toBeInTheDocument();
    expect(screen.getByLabelText('章节标题')).toBeInTheDocument();
    expect(screen.getByLabelText('章节顺序（可选）')).toBeInTheDocument();
  });

  it('should handle empty order field correctly', async () => {
    render(<ChapterDialog {...defaultProps} />, { wrapper: createWrapper() });
    
    const titleInput = screen.getByLabelText('章节标题');
    const orderInput = screen.getByLabelText('章节顺序（可选）');
    const createButton = screen.getByRole('button', { name: '创建' });

    // Fill in title but leave order empty
    fireEvent.change(titleInput, { target: { value: '测试章节' } });
    fireEvent.change(orderInput, { target: { value: '' } });

    // Submit form
    fireEvent.click(createButton);

    // Should not show validation error for empty order field
    await waitFor(() => {
      expect(screen.queryByText('章节顺序必须大于0')).not.toBeInTheDocument();
    });
  });

  it('should validate order field when invalid number is provided', async () => {
    render(<ChapterDialog {...defaultProps} />, { wrapper: createWrapper() });
    
    const titleInput = screen.getByLabelText('章节标题');
    const orderInput = screen.getByLabelText('章节顺序（可选）');
    const createButton = screen.getByRole('button', { name: '创建' });

    // Fill in title and invalid order
    fireEvent.change(titleInput, { target: { value: '测试章节' } });
    fireEvent.change(orderInput, { target: { value: '0' } });

    // Submit form
    fireEvent.click(createButton);

    // Should show validation error for invalid order
    await waitFor(() => {
      expect(screen.getByText('章节顺序必须大于0')).toBeInTheDocument();
    });
  });

  it('should accept valid order number', async () => {
    render(<ChapterDialog {...defaultProps} />, { wrapper: createWrapper() });
    
    const titleInput = screen.getByLabelText('章节标题');
    const orderInput = screen.getByLabelText('章节顺序（可选）');
    const createButton = screen.getByRole('button', { name: '创建' });

    // Fill in title and valid order
    fireEvent.change(titleInput, { target: { value: '测试章节' } });
    fireEvent.change(orderInput, { target: { value: '1' } });

    // Submit form
    fireEvent.click(createButton);

    // Should not show validation error
    await waitFor(() => {
      expect(screen.queryByText('章节顺序必须大于0')).not.toBeInTheDocument();
    });
  });
});
