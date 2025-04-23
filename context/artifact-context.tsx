"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Artifact {
  id: string
  type: "chat" | "code" | "image"
  name: string
  content: any
  createdAt: string
}

interface ArtifactContextType {
  artifacts: Artifact[]
  addArtifact: (artifact: Artifact) => void
  removeArtifact: (id: string) => void
  getArtifactById: (id: string) => Artifact | undefined
}

const ArtifactContext = createContext<ArtifactContextType | undefined>(undefined)

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  // Load artifacts from localStorage on mount
  useEffect(() => {
    const storedArtifacts = localStorage.getItem("artifacts")
    if (storedArtifacts) {
      try {
        setArtifacts(JSON.parse(storedArtifacts))
      } catch (error) {
        console.error("Failed to parse stored artifacts:", error)
      }
    }
  }, [])

  // Save artifacts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("artifacts", JSON.stringify(artifacts))
  }, [artifacts])

  const addArtifact = (artifact: Artifact) => {
    setArtifacts((prev) => [...prev, artifact])
  }

  const removeArtifact = (id: string) => {
    setArtifacts((prev) => prev.filter((artifact) => artifact.id !== id))
  }

  const getArtifactById = (id: string) => {
    return artifacts.find((artifact) => artifact.id === id)
  }

  return (
    <ArtifactContext.Provider value={{ artifacts, addArtifact, removeArtifact, getArtifactById }}>
      {children}
    </ArtifactContext.Provider>
  )
}

export function useArtifacts() {
  const context = useContext(ArtifactContext)
  if (context === undefined) {
    throw new Error("useArtifacts must be used within an ArtifactProvider")
  }
  return context
}
