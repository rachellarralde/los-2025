"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MobileGameView } from "@/components/mobile-game-view"
import { MobileJoinScreen } from "@/components/mobile-join-screen"
import { getSupabaseClient } from "@/lib/supabase"

export default function PlayerPage() {
  const searchParams = useSearchParams()
  const gameCode = searchParams.get("code")
  const [playerName, setPlayerName] = useState("")
  const [joined, setJoined] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<any>(null)

  // Handle joining a game
  const handleJoinGame = (roomId: string, playerId: string, code: string) => {
    setRoomId(roomId)
    setPlayerId(playerId)
    setJoined(true)
  }

  // Subscribe to game state changes
  useEffect(() => {
    if (!roomId || !joined) return

    const supabase = getSupabaseClient()

    // Initial fetch of game state
    const fetchGameState = async () => {
      // Get game room
      const { data: room } = await supabase.from("game_rooms").select("*").eq("id", roomId).single()

      if (room) {
        setGameState(room)
      }
    }

    fetchGameState()

    // Subscribe to game room changes
    const roomSubscription = supabase
      .channel("game-room-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setGameState(payload.new)
        },
      )
      .subscribe()

    return () => {
      roomSubscription.unsubscribe()
    }
  }, [roomId, joined])

  return (
    <div className="fixed inset-0 bg-black">
      <div className="mx-auto h-full max-w-md overflow-hidden bg-gray-900 text-white">
        {joined ? (
          <MobileGameView
            playerId={playerId!}
            roomId={roomId!}
            gameCode={gameCode || "UNKNOWN"}
            gameState={gameState}
          />
        ) : (
          <MobileJoinScreen onJoin={handleJoinGame} isConnecting={isConnecting} initialGameCode={gameCode || ""} />
        )}
      </div>
    </div>
  )
}

