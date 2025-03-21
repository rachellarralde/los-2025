export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      game_rooms: {
        Row: {
          id: string
          code: string
          status: string
          current_round: number
          max_rounds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          status?: string
          current_round?: number
          max_rounds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          status?: string
          current_round?: number
          max_rounds?: number
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          room_id: string
          name: string
          score: number
          is_host: boolean
          is_connected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          name: string
          score?: number
          is_host?: boolean
          is_connected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          name?: string
          score?: number
          is_host?: boolean
          is_connected?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rounds: {
        Row: {
          id: string
          room_id: string
          prompt: string
          round_number: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          prompt: string
          round_number: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          prompt?: string
          round_number?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          created_at?: string
        }
      }
      player_cards: {
        Row: {
          id: string
          player_id: string
          round_id: string
          card_id: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          round_id: string
          card_id: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          round_id?: string
          card_id?: string
          position?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          round_id: string
          voter_id: string
          voted_for_id: string
          created_at: string
        }
        Insert: {
          id?: string
          round_id: string
          voter_id: string
          voted_for_id: string
          created_at?: string
        }
        Update: {
          id?: string
          round_id?: string
          voter_id?: string
          voted_for_id?: string
          created_at?: string
        }
      }
    }
  }
}

