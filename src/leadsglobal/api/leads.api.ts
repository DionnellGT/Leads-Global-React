import { api } from "@/lib/api"
import type {
  AvailablePage,
  Lead,
  LeadEstado,
  LeadFilters,
  LeadStats,
  PaginatedLeads,
} from "../types/lead.types"

function buildParams(filters: LeadFilters) {
  const params: Record<string, string | number> = {}
  if (filters.desde) params.desde = filters.desde
  if (filters.hasta) params.hasta = filters.hasta
  if (filters.estado) params.estado = filters.estado
  if (filters.formId) params.formId = filters.formId
  if (filters.campaignId) params.campaignId = filters.campaignId
  if (filters.pageId) params.pageId = filters.pageId
  if (filters.search) params.search = filters.search
  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit
  return params
}

export async function fetchLeads(
  filters: LeadFilters,
): Promise<PaginatedLeads> {
  const { data } = await api.get<PaginatedLeads>("/leads", {
    params: buildParams(filters),
  })
  return data
}

export async function fetchLeadStats(pageId?: string): Promise<LeadStats> {
  const { data } = await api.get<LeadStats>("/leads/stats", {
    params: pageId ? { pageId } : undefined,
  })
  return data
}

export async function fetchAvailablePages(): Promise<AvailablePage[]> {
  const { data } = await api.get<AvailablePage[]>("/leads/pages")
  return data
}

export async function updateLeadEstado(
  id: string,
  estado: LeadEstado,
): Promise<Lead> {
  const { data } = await api.patch<Lead>(`/leads/${id}/estado`, { estado })
  return data
}

/**
 * Arma la URL de exportación con los filtros actuales. Se usa
 * directamente como `href` de un link de descarga, en vez de
 * traer el archivo con JS, para que el navegador maneje la
 * descarga de forma nativa.
 */
export function getExportUrl(filters: LeadFilters): string {
  const params = new URLSearchParams(
    buildParams(filters) as Record<string, string>,
  )
  return `${api.defaults.baseURL}/leads/export?${params.toString()}`
}
