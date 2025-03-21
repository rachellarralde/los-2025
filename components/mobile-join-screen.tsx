"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, RefreshCw } from "lucide-react"
import { joinGameRoom } from "@/app/actions"

interface MobileJoinScreenProps {
  onJoin: (roomId: string, playerId: string, gameCode: string) => void
  isConnecting: boolean
  initialGameCode: string
}

export function MobileJoinScreen({ onJoin, isConnecting, initialGameCode }: MobileJoinScreenProps) {
  const [playerName, setPlayerName] = useState("")
  const [gameCode, setGameCode] = useState(initialGameCode)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)

  const handleJoinGame = async () => {
    if (!playerName.trim() || !gameCode.trim()) return

    setJoining(true)
    setError(null)

    try {
      const result = await joinGameRoom(gameCode, playerName)

      if (result.success) {
        onJoin(result.roomId!, result.playerId!, result.gameCode!)
      } else {
        setError(result.error || "Failed to join game")
      }
    } catch (err) {
      console.error("Error joining game:", err)
      setError("An unexpected error occurred")
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-blue-900 p-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center rounded-full p-1 hover:bg-blue-800"
          aria-label="Reload page"
        >
          <RefreshCw className="h-4 w-4 text-blue-300" />
        </button>
      </div>

      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white animate-text-glow">BATTLE CARDS</h1>
        <div className="mx-auto h-1 w-20 animate-gradient-x bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
      </div>

      <div className="flex-1 rounded-md bg-gray-800 p-4 shadow-lg">
        <div className="mb-6 rounded-md bg-gray-900 p-3">
          <h2 className="mb-4 text-center text-xl font-bold text-white">JOIN GAME</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="game-code" className="mb-1 block text-sm text-gray-300">
                GAME CODE:
              </label>
              <Input
                id="game-code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="bg-gray-700 text-white placeholder:text-gray-500"
                placeholder="Enter 4-letter code"
                maxLength={4}
                disabled={joining}
              />
            </div>

            <div>
              <label htmlFor="player-name" className="mb-1 block text-sm text-gray-300">
                YOUR NAME:
              </label>
              <Input
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-700 text-white placeholder:text-gray-500"
                placeholder="Enter your name"
                maxLength={15}
                disabled={joining}
              />
            </div>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-900/50 p-2 text-center text-sm text-red-200">{error}</div>}

        <Button
          onClick={handleJoinGame}
          disabled={joining || !playerName.trim() || !gameCode.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {joining ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              CONNECTING...
            </>
          ) : (
            "JOIN GAME"
          )}
        </Button>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Make sure you have the correct game code</p>
          <p className="mt-1">from the host's screen</p>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-blue-300">
        <p>© {new Date().getFullYear()} BATTLE CARDS</p>
      </div>
    </div>
  )
}

