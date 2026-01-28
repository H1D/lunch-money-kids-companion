import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPreferences, savePreferences, type Preferences } from '../lib/db'
import { queryKeys } from '../lib/query'

export function usePreferences() {
  return useQuery({
    queryKey: queryKeys.preferences,
    queryFn: getPreferences,
  })
}

export function useSavePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (prefs: Omit<Preferences, 'id' | 'updatedAt'>) =>
      savePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.preferences })
    },
  })
}
