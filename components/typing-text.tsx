"use client"

import { useState, useEffect } from "react"

interface TypingTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
}

export function TypingText({ text, className, speed = 50, delay = 0, cursor = true }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (delay > 0) {
      timeout = setTimeout(startTyping, delay)
    } else {
      startTyping()
    }

    function startTyping() {
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }

    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && <span className="inline-block h-[1em] w-[0.5em] animate-cursor-blink bg-current" />}
    </span>
  )
}

