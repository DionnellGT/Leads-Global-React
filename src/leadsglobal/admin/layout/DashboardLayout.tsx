import { cn } from "@/lib/utils"
import { LayoutDashboard, LogOut, Users2 } from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router"
import { useAuthStore } from "../../auth/store/useAuthStore"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/leads", label: "Leads", icon: Users2, end: false },
]

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/auth/login", { replace: true })
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            L
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">
            Leads Global
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-3">
          {user && (
            <p className="mb-2 truncate text-xs font-medium text-sidebar-foreground">
              {user.fullName}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
          <p className="mt-2 text-xs text-sidebar-foreground/50">
            Remate de Terrenos · Fundo El Avellano
          </p>
        </div>
      </aside>

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
