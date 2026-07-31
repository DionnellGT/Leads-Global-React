import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLeadEstado } from "../api/leads.api"
import type { LeadEstado } from "../types/lead.types"

export function useUpdateLeadEstado() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: LeadEstado }) =>
      updateLeadEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}
