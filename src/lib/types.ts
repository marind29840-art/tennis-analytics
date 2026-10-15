export interface PlayerSummary {
  id: string
  name: string
  ranking: number
  country_code: string
  country_name: string
  age: number
  form_score: number
  plays: string
  category: string
}

export interface TournamentInfo {
  id: string
  name: string
  category: string
  surface: string
  country: string
  city: string
}

export interface OddsInfo {
  p1_opening?: number
  p2_opening?: number
  p1_current: number
  p2_current: number
  p1_implied_prob: number
  p2_implied_prob: number
  margin: number
}

export interface Alert {
  type: string
  level: 'info' | 'warning' | 'critical' | 'positive'
  message: string
  player?: number
}

export interface PredictionInfo {
  p1_win_prob: number
  p2_win_prob: number
  confidence: number
  risk: number
  value_bet_player?: number
  value_edge?: number
  alerts: Alert[]
  positive_signals_p1: string[]
  negative_signals_p1: string[]
  positive_signals_p2: string[]
  negative_signals_p2: string[]
}

export interface MatchListItem {
  id: string
  status: string
  scheduled_time: string
  tournament: TournamentInfo
  round: string
  player1: PlayerSummary
  player2: PlayerSummary
  odds?: OddsInfo
  prediction?: PredictionInfo
}

export interface PlayerProfile {
  id: string
  name: string
  first_name: string
  last_name: string
  ranking: number
  best_ranking: number
  country_code: string
  country_name: string
  age: number
  height_cm?: number
  weight_kg?: number
  plays: string
  backhand?: string
  style_of_play?: string
  turned_pro?: number
  category: string
  career_wins: number
  career_losses: number
  ytd_wins: number
  ytd_losses: number
  hard_wins: number
  hard_losses: number
  clay_wins: number
  clay_losses: number
  grass_wins: number
  grass_losses: number
  form_score: number
  service_score: number
  return_score: number
  fatigue_score: number
  elo_rating: number
}

export interface ValueBet {
  match_id: string
  tournament_name: string
  surface: string
  scheduled_time: string
  bet_player_id: string
  bet_player_name: string
  opponent_name: string
  odds: number
  bookmaker_prob: number
  estimated_prob: number
  edge: number
  confidence: number
  risk: number
  reasons: string[]
}

export interface StreakInfo {
  player_id: string
  player_name: string
  ranking: number
  country_code: string
  streak_length: number
  streak_type: string
  surface?: string
  avg_opponent_ranking?: number
  is_misleading: boolean
  context: string
}

export interface StreaksOverview {
  winning_streaks: StreakInfo[]
  losing_streaks: StreakInfo[]
  misleading_streaks: StreakInfo[]
  bounceback_candidates: StreakInfo[]
  momentum_risk: StreakInfo[]
}

// Extended match detail types
export interface FormData {
  form_score: number
  last_5: MatchResult[]
  last_10: MatchResult[]
  last_20: MatchResult[]
  trend: 'improving' | 'declining' | 'stable'
  avg_opponent_ranking_last_5: number
  avg_opponent_ranking_last_10: number
}

export interface MatchResult {
  result: 'W' | 'L'
  opponent_name: string
  opponent_ranking: number
  tournament_name: string
  surface: string
  score: string
  date: string
}

export interface ServiceStats {
  aces_per_match: number
  first_serve_pct: number
  first_serve_won_pct: number
  second_serve_won_pct: number
  break_points_saved_pct: number
  service_games_won_pct: number
  service_score: number
}

export interface ReturnStats {
  break_points_converted_pct: number
  return_games_won_pct: number
  first_return_won_pct: number
  second_return_won_pct: number
  return_score: number
}

export interface FatigueData {
  fatigue_score: number
  matches_last_7_days: number
  matches_last_14_days: number
  rest_days_since_last_match: number
  recent_matches: RecentMatch[]
}

export interface RecentMatch {
  date: string
  tournament_name: string
  surface: string
  result: 'W' | 'L'
  duration_minutes?: number
}

export interface H2HRecord {
  total_matches: number
  p1_wins: number
  p2_wins: number
  surface_matches: number
  surface_p1_wins: number
  surface_p2_wins: number
  last_meetings: H2HMeeting[]
}

export interface H2HMeeting {
  date: string
  tournament_name: string
  surface: string
  winner_name: string
  score: string
  round: string
}

export interface MatchDetail extends MatchListItem {
  form_p1?: FormData
  form_p2?: FormData
  service_p1?: ServiceStats
  service_p2?: ServiceStats
  return_p1?: ReturnStats
  return_p2?: ReturnStats
  fatigue_p1?: FatigueData
  fatigue_p2?: FatigueData
  h2h?: H2HRecord
  streak_p1?: StreakInfo
  streak_p2?: StreakInfo
  verdict?: string
}

export interface RankingPoint {
  date: string
  ranking: number
}

export interface CompareData {
  player1: PlayerProfile
  player2: PlayerProfile
  h2h: H2HRecord
  radar: RadarData
}

export interface RadarData {
  p1: RadarDimensions
  p2: RadarDimensions
}

export interface RadarDimensions {
  service: number
  return: number
  form: number
  surface: number
  consistency: number
  experience: number
}
