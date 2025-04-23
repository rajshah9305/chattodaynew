"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface PuterContextType {
  puter: any | null
  isLoading: boolean
  error: Error | null
}

const PuterContext = createContext<PuterContextType | undefined>(undefined)

export function PuterProvider({ children }: { children: ReactNode }) {
  const [puter, setPuter] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadPuter() {
      try {
        // Load the puter.js library from CDN
        const script = document.createElement("script")
        script.src = "https://unpkg.com/puter@latest/dist/puter.min.js"
        script.async = true

        // Wait for the script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })

        // Initialize puter.js
        // Note: window.puter should be available after the script loads
        if (window.puter) {
          setPuter(window.puter)
          setIsLoading(false)
        } else {
          throw new Error("Failed to initialize puter.js")
        }
      } catch (err) {
        console.error("Failed to load puter.js:", err)
        setError(err instanceof Error ? err : new Error("Failed to load puter.js"))
        setIsLoading(false)
      }
    }

    loadPuter()
  }, [])

  return <PuterContext.Provider value={{ puter, isLoading, error }}>{children}</PuterContext.Provider>
}

export function usePuter() {
  const context = useContext(PuterContext)
  if (context === undefined) {
    throw new Error("usePuter must be used within a PuterProvider")
  }
  return context
}
