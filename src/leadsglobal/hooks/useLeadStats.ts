import { useQuery } from "@tanstack/react-query"
import { fetchLeadStats } from "../api/leads.api"

export function useLeadStats(pageId?: string) {
  return useQuery({
    queryKey: ["leads", "stats", pageId],
    queryFn: () => fetchLeadStats(pageId),
    // Los leads llegan en tiempo real vía webhook; refrescamos cada
    // minuto para que el dashboard se sienta "vivo" sin recargar la página.
    refetchInterval: 60_000,
  })
}
