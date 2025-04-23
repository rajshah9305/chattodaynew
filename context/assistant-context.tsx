"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Assistant {
  id: string
  type: "chat" | "code" | "image"
  name: string
  description: string
  systemPrompt?: string
}

interface AssistantContextType {
  assistants: Assistant[]
  currentAssistant: Assistant | null
  setCurrentAssistant: (assistant: Assistant) => void
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined)

// Default assistants
const defaultAssistants: Assistant[] = [
  {
    id: uuidv4(),
    type: "chat",
    name: "General Assistant",
    description: "I can help with a wide range of topics and questions.",
    systemPrompt: "You are a helpful, friendly assistant.",
  },
  {
    id: uuidv4(),
    type: "chat",
    name: "Creative Writer",
    description: "I can help with creative writing, storytelling, and content creation.",
    systemPrompt: "You are a creative writing assistant, skilled in storytelling and content creation.",
  },
  {
    id: uuidv4(),
    type: "code",
    name: "Code Helper",
    description: "I can help with programming questions and generate code examples.",
    systemPrompt: "You are a coding assistant, skilled in programming and software development.",
  },
  {
    id: uuidv4(),
    type: "code",
    name: "Web Developer",
    description: "I specialize in web development with HTML, CSS, and JavaScript.",
    systemPrompt: "You are a web development assistant, skilled in HTML, CSS, and JavaScript.",
  },
  {
    id: uuidv4(),
    type: "image",
    name: "Image Creator",
    description: "I can generate images based on your descriptions.",
    systemPrompt: "You are an image generation assistant.",
  },
  {
    id: uuidv4(),
    type: "image",
    name: "Art Director",
    description: "I can help create artistic images with specific styles and themes.",
    systemPrompt: "You are an art director assistant, skilled in creating images with specific artistic styles.",
  },
]

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [assistants, setAssistants] = useState<Assistant[]>(defaultAssistants)
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(defaultAssistants[0])

  // Load assistants from localStorage on mount
  useEffect(() => {
    const storedAssistants = localStorage.getItem("assistants")
    if (storedAssistants) {
      try {
        setAssistants(JSON.parse(storedAssistants))
      } catch (error) {
        console.error("Failed to parse stored assistants:", error)
      }
    }

    const storedCurrentAssistant = localStorage.getItem("currentAssistant")
    if (storedCurrentAssistant) {
      try {
        setCurrentAssistant(JSON.parse(storedCurrentAssistant))
      } catch (error) {
        console.error("Failed to parse stored current assistant:", error)
      }
    }
  }, [])

  // Save assistants to localStorage when they change
  useEffect(() => {
    localStorage.setItem("assistants", JSON.stringify(assistants))
  }, [assistants])

  // Save current assistant to localStorage when it changes
  useEffect(() => {
    if (currentAssistant) {
      localStorage.setItem("currentAssistant", JSON.stringify(currentAssistant))
    }
  }, [currentAssistant])

  return (
    <AssistantContext.Provider value={{ assistants, currentAssistant, setCurrentAssistant }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistants() {
  const context = useContext(AssistantContext)
  if (context === undefined) {
    throw new Error("useAssistants must be used within an AssistantProvider")
  }
  return context
}
