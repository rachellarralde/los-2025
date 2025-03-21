import { Clock } from "lucide-react"

export function RetroHeader() {
  return (
    <header className="flex items-center justify-between rounded-md bg-gray-200 p-2">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
        <span className="text-sm font-bold">BATTLE CARDS OS</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden items-center space-x-1 rounded bg-gray-300 px-2 py-1 md:flex">
          <Clock className="h-3 w-3" />
          <span className="text-xs">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>

        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </header>
  )
}

