interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Novel Craft</h1>
          <p className="mt-2 text-muted-foreground">AI驱动的智能小说润色系统</p>
        </div>
        {children}
      </div>
    </div>
  );
}
