import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGoals, addGoal, updateGoal, deleteGoal, type Goal } from '../lib/db'
import { queryKeys } from '../lib/query'

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: getGoals,
  })
}

export function useAddGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (goal: { name: string; targetAmount: number; iconEmoji?: string }) =>
      addGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<Omit<Goal, 'id' | 'createdAt'>>) =>
      updateGoal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
    },
  })
}
