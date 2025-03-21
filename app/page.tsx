import Link from "next/link"
import { GameCreator } from "@/components/game-creator"
import { RetroWindow } from "@/components/retro-window"
import { RetroHeader } from "@/components/retro-header"
import { RetroFooter } from "@/components/retro-footer"
import { TypingText } from "@/components/typing-text"
import { Smartphone } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-600 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:20px_20px] p-4 md:p-8 animate-bg-scroll">
      <div className="mx-auto max-w-4xl">
        <RetroHeader />

        <main className="my-8">
          <div className="mb-4 flex justify-end">
            <Link
              href="/player"
              className="flex items-center space-x-1 rounded bg-blue-700 px-3 py-1 text-sm text-white hover:bg-blue-800"
              target="_blank"
            >
              <Smartphone className="h-4 w-4" />
              <span>Test Player View</span>
            </Link>
          </div>

          <RetroWindow title="BATTLE CARDS OS v1.0" className="mb-6">
            <div className="p-6 text-center">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-4xl animate-text-glow title-style">
                BATTLE CARDS
              </h1>
              <div className="mb-6 flex justify-center">
                <div className="h-2 w-32 animate-gradient-x bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
              </div>
              <p className="mb-8 text-lg">
                <TypingText text="The ultimate multiplayer card game with a battle royale twist!" speed={30} />
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-md border-2 border-dashed border-gray-300 bg-gray-100 p-4 transition-all duration-300 hover:border-gray-400 hover:shadow-md">
                  <h2 className="mb-2 text-xl font-bold title-style">HOW TO PLAY</h2>
                  <ol className="text-sm text-gray-700">
                    <li className="mb-1 animate-slide-in" style={{ animationDelay: "100ms" }}>
                      1. Create a game room
                    </li>
                    <li className="mb-1 animate-slide-in" style={{ animationDelay: "200ms" }}>
                      2. Share the code with friends
                    </li>
                    <li className="mb-1 animate-slide-in" style={{ animationDelay: "300ms" }}>
                      3. Connect via your phones
                    </li>
                    <li className="mb-1 animate-slide-in" style={{ animationDelay: "400ms" }}>
                      4. Twist words, battle others
                    </li>
                    <li className="animate-slide-in" style={{ animationDelay: "500ms" }}>
                      5. Last player standing wins!
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col items-center justify-center rounded-md border-2 border-gray-300 bg-gray-100 p-4 transition-all duration-300 hover:border-gray-400 hover:shadow-md">
                  <h2 className="mb-4 text-xl font-bold title-style">START A GAME</h2>
                  <GameCreator />
                </div>
              </div>
            </div>
          </RetroWindow>

          <div className="grid gap-6 md:grid-cols-2">
            <RetroWindow title="FEATURES.EXE" animateIn={true}>
              <div className="space-y-2 p-4 text-sm">
                <div className="flex items-start animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="mr-2 h-4 w-4 shrink-0 rounded-full bg-green-400 animate-pulse"></div>
                  <p>Pixel art graphics powered by Three.js</p>
                </div>
                <div className="flex items-start animate-fade-in" style={{ animationDelay: "400ms" }}>
                  <div className="mr-2 h-4 w-4 shrink-0 rounded-full bg-green-400 animate-pulse"></div>
                  <p>Mobile-optimized gameplay</p>
                </div>
                <div className="flex items-start animate-fade-in" style={{ animationDelay: "600ms" }}>
                  <div className="mr-2 h-4 w-4 shrink-0 rounded-full bg-green-400 animate-pulse"></div>
                  <p>Hilarious card combinations</p>
                </div>
                <div className="flex items-start animate-fade-in" style={{ animationDelay: "800ms" }}>
                  <div className="mr-2 h-4 w-4 shrink-0 rounded-full bg-green-400 animate-pulse"></div>
                  <p>Battle royale elimination rounds</p>
                </div>
                <div className="flex items-start animate-fade-in" style={{ animationDelay: "1000ms" }}>
                  <div className="mr-2 h-4 w-4 shrink-0 rounded-full bg-green-400 animate-pulse"></div>
                  <p>Cozy, story-driven atmosphere</p>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow title="HELP.TXT" animateIn={true}>
              <div className="p-4 text-sm">
                <h3 className="mb-2 text-lg animate-text-flicker title-style">SYSTEM REQUIREMENTS</h3>
                <p className="mb-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  Any modern browser on desktop or mobile.
                </p>
                <h3 className="mb-2 text-lg animate-text-flicker title-style" style={{ animationDelay: "200ms" }}>
                  NEED HELP?
                </h3>
                <p className="mb-2 animate-fade-in" style={{ animationDelay: "500ms" }}>
                  Having trouble connecting to a game?
                </p>
                <Link
                  href="/faq"
                  className="inline-block rounded bg-primary px-3 py-1 text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: "700ms" }}
                >
                  Check FAQ
                </Link>
              </div>
            </RetroWindow>
          </div>
        </main>

        <RetroFooter />
      </div>
    </div>
  )
}

