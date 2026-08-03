import { useQuery } from "@tanstack/react-query"
import { fetchAvailablePages } from "../api/leads.api"

export function useAvailablePages() {
  return useQuery({
    queryKey: ["leads", "pages"],
    queryFn: fetchAvailablePages,
    staleTime: 5 * 60_000, // la lista de páginas cambia poco, cache 5 min
  })
}
