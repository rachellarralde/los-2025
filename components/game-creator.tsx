"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GameCode } from "@/components/game-code"
import { Loader2, Smartphone } from "lucide-react"
import { TypingText } from "@/components/typing-text"
import Link from "next/link"
import { createGameRoom } from "@/app/actions"
import { useRouter } from "next/navigation"

export function GameCreator() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [gameCode, setGameCode] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  const handleCreateGame = async () => {
    if (!playerName.trim()) return

    setIsLoading(true)
    setIsCreating(true)
    setError(null)

    try {
      const result = await createGameRoom(playerName)

      if (result.success) {
        setGameCode(result.gameCode)
        setRoomId(result.roomId)
        setPlayerId(result.playerId)
      } else {
        setError(result.error || "Failed to create game")
      }
    } catch (err) {
      console.error("Error creating game:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (gameCode) {
    return (
      <div className="w-full">
        <GameCode code={gameCode} roomId={roomId} playerId={playerId} />

        <div className="mt-4 flex justify-center">
          <Link
            href={`/player?code=${gameCode}`}
            className="flex items-center space-x-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
            target="_blank"
          >
            <Smartphone className="h-4 w-4" />
            <span>Test Player View</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {isCreating ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
          <TypingText text="Initializing game server..." className="text-sm text-gray-700" speed={40} />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="player-name" className="block text-sm">
              Your Name:
            </label>
            <Input
              id="player-name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          {error && <div className="rounded-md bg-red-50 p-2 text-center text-sm text-red-500">{error}</div>}

          <Button
            onClick={handleCreateGame}
            disabled={isLoading || !playerName.trim()}
            className="w-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                LOADING...
              </>
            ) : (
              "CREATE GAME ROOM"
            )}
          </Button>
        </>
      )}
    </div>
  )
}

