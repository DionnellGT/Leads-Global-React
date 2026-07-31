export type LeadEstado = "Nuevo" | "Contactado" | "Vendido"

export interface Lead {
  id: string
  leadgenId: string
  nombre: string
  correo: string
  telefono: string
  ciudad: string
  formId: string
  formName: string
  campaignId: string
  campaignName: string
  pageId: string
  rawFieldData: Record<string, unknown>
  leadCreatedTime: string
  estado: LeadEstado
  assignedTo: string
  createdAt: string
}

export interface LeadFilters {
  desde?: string
  hasta?: string
  estado?: LeadEstado
  formId?: string
  campaignId?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedLeads {
  data: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LeadEstadoCount {
  estado: string
  count: number
}

export interface LeadsByDay {
  date: string
  count: number
}

export interface TopForm {
  formName: string
  count: number
}

export interface TodayVsYesterday {
  today: number
  yesterdaySameTime: number
  diff: number
  diffPercent: number | null
}

export interface LeadStats {
  total: number
  leadsToday: number
  leadsThisWeek: number
  todayVsYesterday: TodayVsYesterday
  byEstado: LeadEstadoCount[]
  leadsByDay: LeadsByDay[]
  topForms: TopForm[]
}
