import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react"
import { useState } from "react"
import { getExportUrl } from "../../api/leads.api"
import { PageHeader } from "../../components/PageHeader"
import { useDebouncedValue } from "../../hooks/useDebouncedValue"
import { useLeads } from "../../hooks/useLeads"
import { useUpdateLeadEstado } from "../../hooks/useUpdateLeadEstado"
import type { LeadEstado, LeadFilters } from "../../types/lead.types"

const ESTADOS: LeadEstado[] = ["Nuevo", "Contactado", "Vendido"]

const BADGE_VARIANT: Record<LeadEstado, "nuevo" | "contactado" | "vendido"> = {
  Nuevo: "nuevo",
  Contactado: "contactado",
  Vendido: "vendido",
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const Leads = () => {
  const [search, setSearch] = useState("")
  const [estado, setEstado] = useState<LeadEstado | "">("")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [page, setPage] = useState(1)
  const limit = 20

  const debouncedSearch = useDebouncedValue(search)

  const filters: LeadFilters = {
    search: debouncedSearch || undefined,
    estado: estado || undefined,
    desde: desde || undefined,
    hasta: hasta || undefined,
    page,
    limit,
  }

  const { data, isLoading, isPlaceholderData } = useLeads(filters)
  const updateEstado = useUpdateLeadEstado()

  const resetPageAndSet = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Leads"
        description={
          data ? `${data.total} lead${data.total === 1 ? "" : "s"} en total` : undefined
        }
        actions={
          <a href={getExportUrl(filters)} className={buttonVariants()}>
            <Download data-icon="inline-start" />
            Exportar Excel
          </a>
        }
      />

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {/* Filtros */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Buscar
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-7"
                placeholder="Nombre, correo o teléfono"
                value={search}
                onChange={(e) => resetPageAndSet(setSearch)(e.target.value)}
              />
            </div>
          </div>

          <div className="w-40 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Estado
            </label>
            <Select
              value={estado}
              onChange={(e) =>
                resetPageAndSet(setEstado)(e.target.value as LeadEstado | "")
              }
            >
              <option value="">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-36 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Desde
            </label>
            <Input
              type="date"
              value={desde}
              onChange={(e) => resetPageAndSet(setDesde)(e.target.value)}
            />
          </div>

          <div className="w-36 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Hasta
            </label>
            <Input
              type="date"
              value={hasta}
              onChange={(e) => resetPageAndSet(setHasta)(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Formulario</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data && data.data.length > 0 ? (
                data.data.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.nombre || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span>{lead.correo || "—"}</span>
                        <span className="text-muted-foreground">
                          {lead.telefono || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.formName || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(lead.leadCreatedTime)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={BADGE_VARIANT[lead.estado]}>
                          {lead.estado}
                        </Badge>
                        <Select
                          className="h-6 w-28 text-xs"
                          value={lead.estado}
                          disabled={updateEstado.isPending}
                          onChange={(e) =>
                            updateEstado.mutate({
                              id: lead.id,
                              estado: e.target.value as LeadEstado,
                            })
                          }
                        >
                          {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No hay leads que coincidan con estos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Página {data.page} de {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft data-icon="inline-start" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPlaceholderData || page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
