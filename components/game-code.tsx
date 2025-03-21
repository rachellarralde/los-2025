"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Play, Loader2 } from "lucide-react"
import { startGame } from "@/app/actions"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface GameCodeProps {
  code: string
  roomId?: string | null
  playerId?: string | null
}

export function GameCode({ code, roomId, playerId }: GameCodeProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [codeChars, setCodeChars] = useState<string[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Animate code characters appearing one by one
    const chars = code.split("")
    const timer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < chars.length) {
          setCodeChars((prev) => [...prev, chars[i]])
          i++
        } else {
          clearInterval(interval)
        }
      }, 150)

      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [code])

  useEffect(() => {
    if (!roomId) return

    // Subscribe to players in this room
    const supabase = getSupabaseClient()

    // Initial fetch of players
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })

      if (data) {
        setPlayers(data)
      }
    }

    fetchPlayers()

    // Subscribe to player changes
    const subscription = supabase
      .channel("players-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          fetchPlayers()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartGame = async () => {
    if (!roomId) return

    setIsStarting(true)
    setError(null)

    try {
      const result = await startGame(roomId)

      if (result.success) {
        // Game started successfully
        // In a real app, you might redirect to a game screen
        console.log("Game started!")
      } else {
        setError(result.error || "Failed to start game")
      }
    } catch (err) {
      console.error("Error starting game:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="space-y-4 text-center">
      <div>
        <h3 className="mb-1 text-sm">GAME CODE:</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="text-3xl font-bold tracking-widest text-primary">
            {codeChars.map((char, i) => (
              <span
                key={i}
                className="inline-block animate-code-char-appear"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {char}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105"
          >
            {copied ? <Check className="h-4 w-4 animate-success" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-black/10 p-3 animate-fade-in" style={{ animationDelay: "1s" }}>
        <p className="mb-2 text-sm">Tell your friends to visit:</p>
        <p className="text-xs font-bold">{window.location.host}</p>
        <p className="text-xs">
          And enter code: <span className="font-bold">{code}</span>
        </p>
      </div>

      {players.length > 0 && (
        <div className="rounded-md bg-gray-100 p-3 animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <h4 className="mb-2 text-sm font-bold">PLAYERS ({players.length}):</h4>
          <ul className="space-y-1">
            {players.map((player) => (
              <li key={player.id} className="text-xs">
                {player.name} {player.is_host && "(Host)"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-2 text-center text-sm text-red-500 animate-fade-in">{error}</div>
      )}

      <div className="mt-4 flex justify-center animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="relative">
          <div className="absolute -inset-0.5 animate-pulse rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 opacity-75 blur"></div>
          <Button
            onClick={handleStartGame}
            disabled={isStarting || players.length < 1}
            className="relative text-sm transition-transform duration-200 hover:scale-105"
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                STARTING...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                START GAME
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

