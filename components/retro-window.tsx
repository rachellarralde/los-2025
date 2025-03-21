import type React from "react"
import { cn } from "@/lib/utils"
import { CRTEffect } from "./crt-effect"

interface RetroWindowProps {
  title: string
  children: React.ReactNode
  className?: string
  animateIn?: boolean
}

export function RetroWindow({ title, children, className, animateIn = true }: RetroWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border-2 border-gray-400 bg-gray-200 shadow-md transition-all duration-300",
        animateIn && "animate-window-appear",
        className,
      )}
    >
      <div className="flex h-8 items-center bg-gradient-to-r from-blue-700 to-blue-900 px-2">
        <div className="mr-2 flex space-x-1">
          <div className="h-3 w-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500 hover:opacity-80 transition-opacity"></div>
          <div className="h-3 w-3 rounded-full bg-green-500 hover:opacity-80 transition-opacity"></div>
        </div>
        <div className="flex-1 text-center font-pixel-mono text-sm font-bold text-white">{title}</div>
        <div className="h-4 w-4"></div> {/* Spacer for balance */}
      </div>
      <CRTEffect intensity="low" className="bg-gray-100">
        {children}
      </CRTEffect>
    </div>
  )
}

