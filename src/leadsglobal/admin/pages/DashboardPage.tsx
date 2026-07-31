import { Card, CardContent, CardHeader, CardTitle, CardValue } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "../../components/PageHeader"
import { useLeadStats } from "../../hooks/useLeadStats"
import type { LeadEstadoCount } from "../../types/lead.types"

const ESTADO_COLOR: Record<string, string> = {
  Nuevo: "var(--chart-1)",
  Contactado: "var(--chart-4)",
  Vendido: "var(--chart-3)",
}

function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-")
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ]
  return `${Number(day)} ${months[Number(month) - 1]}`
}

function EstadoBreakdown({ data }: { data: LeadEstadoCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.estado} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{item.estado}</span>
            <span className="text-muted-foreground">{item.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.count / total) * 100}%`,
                backgroundColor: ESTADO_COLOR[item.estado] ?? "var(--chart-2)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export const DashboardPage = () => {
  const { data: stats, isLoading } = useLeadStats()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen de leads capturados desde Facebook e Instagram"
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total de leads</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <CardValue>{stats?.total ?? 0}</CardValue>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads hoy</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <CardValue>{stats?.leadsToday ?? 0}</CardValue>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads últimos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <CardValue>{stats?.leadsThisWeek ?? 0}</CardValue>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de leads por día + desglose por estado */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads de los últimos 14 días</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={224}>
                  <LineChart data={stats?.leadsByDay ?? []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDayLabel}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      interval={1}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      labelFormatter={(v) => formatDayLabel(v as string)}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Leads"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leads por estado</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : (
                <EstadoBreakdown data={stats?.byEstado ?? []} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top formularios */}
        <Card>
          <CardHeader>
            <CardTitle>Formularios con más leads</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : stats && stats.topForms.length > 0 ? (
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={stats.topForms} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="formName"
                    width={140}
                    tick={{ fontSize: 11, fill: "var(--foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar dataKey="count" name="Leads" fill="var(--chart-2)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Todavía no hay suficientes datos por formulario.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
