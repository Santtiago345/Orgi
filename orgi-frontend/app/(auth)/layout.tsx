export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sidebar via-sidebar to-sidebar-hover p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="w-full max-w-md mx-auto relative">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="w-12 h-12 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-white text-xl font-bold">O</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">orgi</h1>
          <p className="text-sidebar-text mt-1 text-sm">Gestión Financiera Personal</p>
        </div>
        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
