import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, AuthResponse } from '@/lib/auth-api';
import { tokenManager } from '@/lib/api';
import { LoginDto, RegisterDto } from '@novel-craft/shared';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data: AuthResponse) => {
      // Store token
      tokenManager.set(data.access_token);
      
      // Update user cache
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data: AuthResponse) => {
      // Store token
      tokenManager.set(data.access_token);
      
      // Update user cache
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getProfile,
    enabled: !!tokenManager.get(),
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Remove token
      tokenManager.remove();
      
      // Clear all cached data
      queryClient.clear();
      
      // Redirect to login
      window.location.href = '/login';
    },
  });
}
