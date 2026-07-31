import { useQuery } from "@tanstack/react-query"
import { fetchLeadStats } from "../api/leads.api"

export function useLeadStats() {
  return useQuery({
    queryKey: ["leads", "stats"],
    queryFn: fetchLeadStats,
    // Los leads llegan en tiempo real vía webhook; refrescamos cada
    // minuto para que el dashboard se sienta "vivo" sin recargar la página.
    refetchInterval: 60_000,
  })
}
