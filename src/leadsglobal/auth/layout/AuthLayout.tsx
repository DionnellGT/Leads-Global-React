import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src="/logo1.png" alt="El Avellano" className="h-16 w-auto object-contain" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Panel de administración</h1>
            <p className="text-sm text-muted-foreground">El Avellano — Los Muermos</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
