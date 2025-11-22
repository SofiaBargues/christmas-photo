"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  x: number
  y: number
  radius: number
  speed: number
  wind: number
  opacity: number
}

interface SnowEffectProps {
  isEnabled?: boolean
}

export function SnowEffect({ isEnabled = true }: SnowEffectProps) {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    if (!isEnabled) {
      setSnowflakes([])
      return
    }

    // Create initial snowflakes with more realism
    const count = 150
    const newSnowflakes: Snowflake[] = []

    for (let i = 0; i < count; i++) {
      newSnowflakes.push({
        id: i,
        x: Math.random() * 100, // vw
        y: Math.random() * 100, // vh
        radius: Math.random() * 3 + 1, // 1px to 4px
        speed: Math.random() * 0.3 + 0.1,
        wind: Math.random() * 0.5 - 0.25, // Slight horizontal drift
        opacity: Math.random() * 0.7 + 0.1, // More variation in opacity
      })
    }

    setSnowflakes(newSnowflakes)

    // Animation loop
    const interval = setInterval(() => {
      setSnowflakes((prev) =>
        prev.map((flake) => {
          let newY = flake.y + flake.speed
          let newX = flake.x + flake.wind // Apply wind

          // Reset to top if it goes off screen
          if (newY > 100) {
            newY = -5
            newX = Math.random() * 100
          }

          if (newX > 100) newX = 0
          if (newX < 0) newX = 100

          return {
            ...flake,
            y: newY,
            x: newX,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isEnabled]) // Added dependency

  if (!isEnabled) return null // Don't render if disabled

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white blur-[1px]" // Added blur for softness
          style={{
            left: `${flake.x}vw`,
            top: `${flake.y}vh`,
            width: `${flake.radius}px`,
            height: `${flake.radius}px`,
            opacity: flake.opacity,
            // Removed transition for smoother frame-by-frame updates
          }}
        />
      ))}
    </div>
  )
}
