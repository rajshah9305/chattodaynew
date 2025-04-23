"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useArtifacts } from "@/context/artifact-context"
import { useAssistants } from "@/context/assistant-context"
import { usePuter } from "@/context/puter-context"
import { Save, Send, Bot } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [artifactName, setArtifactName] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { addArtifact } = useArtifacts()
  const { currentAssistant } = useAssistants()
  const { puter } = usePuter()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Add initial assistant message based on current assistant
  useEffect(() => {
    if (currentAssistant && currentAssistant.type === "chat" && messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: `Hello! I'm ${currentAssistant.name}. ${currentAssistant.description} How can I help you today?`,
        },
      ])
    }
  }, [currentAssistant, messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (!puter) {
        throw new Error("Puter.js is not initialized")
      }

      // Use puter.js to generate a response
      const response = await puter.ai.chat(input)

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.text,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSaveArtifact = () => {
    if (!artifactName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for this chat artifact.",
        variant: "destructive",
      })
      return
    }

    addArtifact({
      id: uuidv4(),
      type: "chat",
      name: artifactName,
      content: messages,
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Success",
      description: "Chat saved successfully!",
    })

    setSaveDialogOpen(false)
    setArtifactName("")
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">
            {currentAssistant && currentAssistant.type === "chat" ? currentAssistant.name : "Chat Assistant"}
          </h2>
        </div>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={messages.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Save Chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Chat</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={artifactName}
                  onChange={(e) => setArtifactName(e.target.value)}
                  placeholder="Enter a name for this chat"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveArtifact}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="flex-1 mb-4 overflow-hidden">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full p-4 scrollbar-thin" ref={scrollAreaRef}>
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`message-bubble ${message.role === "user" ? "user-message" : "assistant-message"}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="message-bubble assistant-message">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] resize-none"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
