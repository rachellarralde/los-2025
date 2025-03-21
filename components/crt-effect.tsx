"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CRTEffectProps {
  children: React.ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function CRTEffect({ children, className, intensity = "low" }: CRTEffectProps) {
  const [isOn, setIsOn] = useState(false)

  useEffect(() => {
    // Simulate CRT turning on
    const timer = setTimeout(() => {
      setIsOn(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-opacity duration-500",
        isOn ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {/* CRT scanlines */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 bg-scanlines",
          intensity === "low" && "opacity-[0.03]",
          intensity === "medium" && "opacity-[0.05]",
          intensity === "high" && "opacity-[0.08]",
        )}
      />

      {/* CRT flicker */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 animate-crt-flicker",
          intensity === "low" && "opacity-[0.01]",
          intensity === "medium" && "opacity-[0.02]",
          intensity === "high" && "opacity-[0.03]",
        )}
      />

      {/* Slight vignette effect */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 rounded-lg bg-radial-vignette",
          intensity === "low" && "opacity-[0.2]",
          intensity === "medium" && "opacity-[0.3]",
          intensity === "high" && "opacity-[0.4]",
        )}
      />

      {/* Content */}
      <div className={cn("relative z-0", isOn && "animate-crt-on")}>{children}</div>
    </div>
  )
}

