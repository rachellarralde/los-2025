"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wifi, Users, Clock, RefreshCw } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { getCardsForRound } from "@/app/actions"

interface MobileGameViewProps {
  playerId: string
  roomId: string
  gameCode: string
  gameState: any
}

export function MobileGameView({ playerId, roomId, gameCode, gameState }: MobileGameViewProps) {
  const [players, setPlayers] = useState<any[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [currentRound, setCurrentRound] = useState<any>(null)
  const [playerCards, setPlayerCards] = useState<any[]>([])
  const [allSubmissions, setAllSubmissions] = useState<any[]>([])
  const [votedFor, setVotedFor] = useState<string | null>(null)

  // Fetch players
  useEffect(() => {
    if (!roomId) return

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
        const current = data.find((p) => p.id === playerId)
        if (current) {
          setCurrentPlayer(current)
        }
      }
    }

    fetchPlayers()

    // Subscribe to player changes
    const subscription = supabase
      .channel("mobile-players-channel")
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
  }, [roomId, playerId])

  // Fetch current round
  useEffect(() => {
    if (!roomId || !gameState || gameState.status === "waiting") return

    const supabase = getSupabaseClient()

    const fetchCurrentRound = async () => {
      const { data } = await supabase
        .from("rounds")
        .select("*")
        .eq("room_id", roomId)
        .eq("round_number", gameState.current_round)
        .single()

      if (data) {
        setCurrentRound(data)
      }
    }

    fetchCurrentRound()

    // Subscribe to round changes
    const subscription = supabase
      .channel("mobile-rounds-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rounds",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          fetchCurrentRound()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId, gameState])

  // Fetch cards for player
  useEffect(() => {
    if (!roomId || !playerId || !gameState || gameState.status === "waiting") return

    const fetchCards = async () => {
      const result = await getCardsForRound(roomId, gameState.current_round)

      if (result.success && result.cards) {
        setCards(result.cards)
      }
    }

    fetchCards()
  }, [roomId, playerId, gameState])

  // Countdown timer
  useEffect(() => {
    if (!currentRound || currentRound.status !== "playing") return

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }

    // Auto-submit when time runs out
    if (timeLeft === 0 && selectedCards.length > 0) {
      submitCards()
    }
  }, [currentRound, timeLeft])

  const toggleCardSelection = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
    } else {
      if (selectedCards.length < 2) {
        setSelectedCards([...selectedCards, cardId])
      }
    }
  }

  const submitCards = async () => {
    if (selectedCards.length !== 2 || !currentRound) return

    const supabase = getSupabaseClient()

    // Submit cards
    for (let i = 0; i < selectedCards.length; i++) {
      await supabase.from("player_cards").insert({
        player_id: playerId,
        round_id: currentRound.id,
        card_id: selectedCards[i],
        position: i + 1,
      })
    }

    // Fetch all submissions after submitting
    fetchSubmissions()
  }

  const fetchSubmissions = async () => {
    if (!currentRound) return

    const supabase = getSupabaseClient()

    // Get all submissions for this round
    const { data } = await supabase
      .from("player_cards")
      .select(`
        id,
        position,
        player_id,
        players(name),
        cards(text)
      `)
      .eq("round_id", currentRound.id)
      .order("player_id")
      .order("position")

    if (data) {
      // Group by player_id
      const submissions: Record<string, any[]> = {}

      data.forEach((card) => {
        if (!submissions[card.player_id]) {
          submissions[card.player_id] = []
        }
        submissions[card.player_id].push(card)
      })

      // Convert to array
      const submissionsArray = Object.entries(submissions).map(([playerId, cards]) => ({
        playerId,
        playerName: cards[0].players.name,
        cards,
      }))

      setAllSubmissions(submissionsArray)
    }
  }

  const voteForSubmission = async (votedPlayerId: string) => {
    if (!currentRound || votedPlayerId === playerId) return

    const supabase = getSupabaseClient()

    // Submit vote
    await supabase.from("votes").insert({
      round_id: currentRound.id,
      voter_id: playerId,
      voted_for_id: votedPlayerId,
    })

    setVotedFor(votedPlayerId)
  }

  // Determine game state for UI
  const getDisplayState = () => {
    if (!gameState) return "waiting"

    if (gameState.status === "waiting") {
      return "waiting"
    }

    if (gameState.status === "playing") {
      if (!currentRound) return "waiting"

      if (currentRound.status === "playing") {
        // Check if player has already submitted cards
        const hasSubmitted = allSubmissions.some((s) => s.playerId === playerId)
        return hasSubmitted ? "waiting_for_others" : "playing"
      }

      if (currentRound.status === "voting") {
        return "voting"
      }

      if (currentRound.status === "ended") {
        return "results"
      }
    }

    return "waiting"
  }

  const displayState = getDisplayState()

  return (
    <div className="flex h-full flex-col bg-gray-900">
      {/* Game header */}
      <div className="bg-gray-800 p-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-300">GAME: {gameCode}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center rounded-full p-1 hover:bg-gray-700"
            aria-label="Reload page"
          >
            <RefreshCw className="h-4 w-4 text-blue-400" />
          </button>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-300">{players.length} PLAYERS</span>
          </div>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1 overflow-y-auto p-4">
        {displayState === "waiting" && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <h2 className="text-xl font-bold text-white">Waiting for players...</h2>
            <p className="mt-2 text-center text-sm text-gray-400">Game will start when the host begins the round</p>
          </div>
        )}

        {displayState === "waiting_for_others" && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <h2 className="text-xl font-bold text-white">Cards submitted!</h2>
            <p className="mt-2 text-center text-sm text-gray-400">Waiting for other players to submit their cards...</p>
          </div>
        )}

        {displayState === "playing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{currentRound?.prompt || "Choose your cards:"}</h2>
              <div className="flex items-center space-x-1 rounded-full bg-gray-700 px-2 py-1">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">{timeLeft}s</span>
              </div>
            </div>

            <div className="grid gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => toggleCardSelection(card.id)}
                  className={`relative rounded-md border-2 p-3 text-left transition-all ${
                    selectedCards.includes(card.id)
                      ? "border-green-500 bg-gray-800"
                      : "border-gray-700 bg-gray-800 hover:border-gray-500"
                  }`}
                >
                  <p className="text-white">{card.text}</p>
                  {selectedCards.includes(card.id) && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                      {selectedCards.indexOf(card.id) + 1}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={submitCards}
              disabled={selectedCards.length !== 2}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              SUBMIT CARDS
            </Button>
          </div>
        )}

        {displayState === "voting" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Vote for the best combination:</h2>

            <div className="space-y-4">
              {allSubmissions.map((submission) => (
                <div key={submission.playerId} className="rounded-md bg-gray-800 p-3">
                  <div className="mb-2 text-sm text-gray-400">{submission.playerName}'s cards:</div>
                  <div className="space-y-2">
                    {submission.cards.map((card) => (
                      <div key={card.id} className="rounded border border-gray-700 bg-gray-900 p-2 text-white">
                        {card.cards.text}
                      </div>
                    ))}
                  </div>

                  {submission.playerId !== playerId ? (
                    <Button
                      onClick={() => voteForSubmission(submission.playerId)}
                      disabled={votedFor !== null}
                      className={`mt-3 w-full ${
                        votedFor === submission.playerId ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {votedFor === submission.playerId ? "VOTED!" : "VOTE"}
                    </Button>
                  ) : (
                    <div className="mt-3 text-center text-sm text-gray-400">You can't vote for your own cards</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {displayState === "results" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Round Results:</h2>

            <div className="rounded-md bg-gray-800 p-4">
              <h3 className="mb-3 text-center text-lg font-bold text-yellow-400">WINNER!</h3>

              <div className="mb-4 rounded-md bg-gray-700 p-3">
                <div className="mb-2 text-sm font-bold text-white">Player 2's cards:</div>
                <div className="space-y-2">
                  <div className="rounded border border-yellow-500 bg-gray-900 p-2 text-white">A giant robot</div>
                  <div className="rounded border border-yellow-500 bg-gray-900 p-2 text-white">A haunted mansion</div>
                </div>
                <div className="mt-2 text-center text-sm text-gray-300">3 votes</div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-300">Next round starting soon...</p>
                <div className="mt-2 inline-block h-1 w-24 animate-gradient-x bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player list */}
      <div className="bg-gray-800 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">PLAYERS</h3>
          <span className="text-xs text-gray-400">
            Round {gameState?.current_round || 0}/{gameState?.max_rounds || 5}
          </span>
        </div>
        <div className="space-y-1">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between rounded bg-gray-700 px-2 py-1">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${player.is_connected ? "bg-green-400" : "bg-red-400"}`}></div>
                <span className="text-sm text-white">
                  {player.name} {player.is_host && "(Host)"}
                </span>
              </div>
              <span className="text-sm text-yellow-400">{player.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

