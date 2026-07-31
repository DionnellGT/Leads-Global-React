import { useQuery } from "@tanstack/react-query"
import { fetchLeads } from "../api/leads.api"
import type { LeadFilters } from "../types/lead.types"

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => fetchLeads(filters),
    placeholderData: (previousData) => previousData,
  })
}
