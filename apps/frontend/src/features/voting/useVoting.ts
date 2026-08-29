import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVotingList,
  getVotingDetail,
  createVoting,
  voteVoting,
  tutupVoting,
  bukaVoting,
  deleteVoting,
  getHasilVoting,
} from './votingApi'
import type { VotingFormData } from './votingApi'

export const useVotingList = () => {
  return useQuery({
    queryKey: ['voting-list'],
    queryFn: getVotingList,
  })
}

export const useVotingDetail = (id: string) => {
  return useQuery({
    queryKey: ['voting-detail', id],
    queryFn: () => getVotingDetail(id),
  })
}

export const useHasilVoting = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['voting-hasil', id],
    queryFn: () => getHasilVoting(id),
    enabled,
  })
}

export const useCreateVoting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: VotingFormData) => createVoting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-list'] })
    },
  })
}

export const useVote = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pilihanId: string) => voteVoting(id, pilihanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['voting-list'] })
    },
  })
}

export const useTutupVoting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tutupVoting(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['voting-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['voting-list'] })
    },
  })
}

export const useBukaVoting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bukaVoting(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['voting-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['voting-list'] })
    },
  })
}

export const useDeleteVoting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVoting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-list'] })
    },
  })
}