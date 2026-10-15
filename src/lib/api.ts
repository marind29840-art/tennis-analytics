import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { MatchListItem, PlayerProfile, ValueBet, StreaksOverview, MatchDetail, RankingPoint, CompareData } from './types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
})

// Matches
export const useTodayMatches = () =>
  useQuery({
    queryKey: ['matches', 'today'],
    queryFn: () => api.get<MatchListItem[]>('/api/matches/today').then(r => r.data),
    staleTime: 60_000,
  })

export const useUpcomingMatches = () =>
  useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: () => api.get<MatchListItem[]>('/api/matches/upcoming').then(r => r.data),
    staleTime: 60_000,
  })

export const useMatch = (id: string) =>
  useQuery({
    queryKey: ['match', id],
    queryFn: () => api.get<MatchDetail>(`/api/matches/${id}`).then(r => r.data),
    enabled: !!id,
  })

// Players
export const usePlayer = (id: string) =>
  useQuery({
    queryKey: ['player', id],
    queryFn: () => api.get<PlayerProfile>(`/api/players/${id}`).then(r => r.data),
    enabled: !!id,
  })

export const usePlayerForm = (id: string) =>
  useQuery({
    queryKey: ['player', id, 'form'],
    queryFn: () => api.get(`/api/players/${id}/form`).then(r => r.data),
    enabled: !!id,
  })

export const usePlayerStreaks = (id: string) =>
  useQuery({
    queryKey: ['player', id, 'streaks'],
    queryFn: () => api.get(`/api/players/${id}/streaks`).then(r => r.data),
    enabled: !!id,
  })

export const usePlayerRanking = (id: string) =>
  useQuery({
    queryKey: ['player', id, 'ranking'],
    queryFn: () => api.get<RankingPoint[]>(`/api/players/${id}/ranking`).then(r => r.data),
    enabled: !!id,
    staleTime: 300_000,
  })

export const useSearchPlayers = (q: string) =>
  useQuery({
    queryKey: ['players', 'search', q],
    queryFn: () => api.get<PlayerProfile[]>(`/api/players/?q=${encodeURIComponent(q)}&limit=10`).then(r => r.data),
    enabled: q.length > 1,
    staleTime: 30_000,
  })

// Value bets
export const useValueBets = (minEdge = 0.05) =>
  useQuery({
    queryKey: ['value-bets', minEdge],
    queryFn: () => api.get<ValueBet[]>(`/api/value-bets?min_edge=${minEdge}`).then(r => r.data),
    staleTime: 60_000,
  })

// Streaks
export const useStreaks = () =>
  useQuery({
    queryKey: ['streaks'],
    queryFn: () => api.get<StreaksOverview>('/api/streaks').then(r => r.data),
    staleTime: 300_000,
  })

// Compare
export const useCompare = (p1Id: string, p2Id: string) =>
  useQuery({
    queryKey: ['compare', p1Id, p2Id],
    queryFn: () => api.get<CompareData>(`/api/compare/${p1Id}/${p2Id}`).then(r => r.data),
    enabled: !!p1Id && !!p2Id,
  })

// Seed data
export const seedDemoData = () => api.post('/api/data/seed').then(r => r.data)
export const getDataStatus = () => api.get('/api/data/status').then(r => r.data)
