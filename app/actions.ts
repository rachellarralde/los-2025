"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Generate a random 4-character code
function generateGameCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase()
}

// Create a new game room
export async function createGameRoom(playerName: string) {
  const supabase = createServerSupabaseClient()

  // Generate a unique game code
  let code = generateGameCode()
  let isUnique = false

  while (!isUnique) {
    // Check if code already exists
    const { data } = await supabase.from("game_rooms").select("code").eq("code", code).single()

    if (!data) {
      isUnique = true
    } else {
      code = generateGameCode()
    }
  }

  // Create the game room
  const { data: room, error: roomError } = await supabase.from("game_rooms").insert({ code }).select().single()

  if (roomError || !room) {
    console.error("Error creating game room:", roomError)
    return { success: false, error: roomError?.message || "Failed to create game room" }
  }

  // Create the host player
  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      room_id: room.id,
      name: playerName,
      is_host: true,
    })
    .select()
    .single()

  if (playerError || !player) {
    console.error("Error creating player:", playerError)
    return { success: false, error: playerError?.message || "Failed to create player" }
  }

  revalidatePath("/")

  return {
    success: true,
    gameCode: room.code,
    roomId: room.id,
    playerId: player.id,
  }
}

// Join an existing game room
export async function joinGameRoom(gameCode: string, playerName: string) {
  const supabase = createServerSupabaseClient()

  // Find the game room
  const { data: room, error: roomError } = await supabase
    .from("game_rooms")
    .select("*")
    .eq("code", gameCode.toUpperCase())
    .single()

  if (roomError || !room) {
    console.error("Error finding game room:", roomError)
    return { success: false, error: "Game not found. Check the code and try again." }
  }

  // Check if game is joinable
  if (room.status !== "waiting") {
    return { success: false, error: "Game has already started." }
  }

  // Create the player
  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      room_id: room.id,
      name: playerName,
      is_host: false,
    })
    .select()
    .single()

  if (playerError || !player) {
    console.error("Error creating player:", playerError)
    return { success: false, error: playerError?.message || "Failed to join game" }
  }

  revalidatePath(`/player`)

  return {
    success: true,
    gameCode: room.code,
    roomId: room.id,
    playerId: player.id,
  }
}

// Start the game
export async function startGame(roomId: string) {
  const supabase = createServerSupabaseClient()

  // Update game room status
  const { error: updateError } = await supabase
    .from("game_rooms")
    .update({
      status: "playing",
      current_round: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", roomId)

  if (updateError) {
    console.error("Error starting game:", updateError)
    return { success: false, error: updateError.message }
  }

  // Get a random prompt
  const prompts = [
    "Choose cards that would make the funniest story:",
    "Select cards that would create the most epic adventure:",
    "Pick cards that would make the scariest scenario:",
    "Choose cards that would create the most absurd situation:",
    "Select cards that would make the best movie plot:",
  ]

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

  // Create the first round
  const { error: roundError } = await supabase.from("rounds").insert({
    room_id: roomId,
    prompt: randomPrompt,
    round_number: 1,
    status: "playing",
  })

  if (roundError) {
    console.error("Error creating round:", roundError)
    return { success: false, error: roundError.message }
  }

  // Get random cards for each player
  const { data: players } = await supabase.from("players").select("id").eq("room_id", roomId)

  if (players && players.length > 0) {
    // Get all cards
    const { data: allCards } = await supabase.from("cards").select("id")

    if (allCards && allCards.length > 0) {
      // Shuffle cards
      const shuffledCards = [...allCards].sort(() => Math.random() - 0.5)

      // Assign 5 cards to each player
      for (const player of players) {
        const playerCards = shuffledCards.splice(0, 5)
        // We'll deal with this in the client side
      }
    }
  }

  revalidatePath(`/game/${roomId}`)

  return { success: true }
}

// Get cards for a round
export async function getCardsForRound(roomId: string, roundNumber: number) {
  const supabase = createServerSupabaseClient()

  // Get 5 random cards
  const { data: cards, error } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error || !cards) {
    console.error("Error getting cards:", error)
    return { success: false, error: error?.message || "Failed to get cards" }
  }

  return { success: true, cards }
}

