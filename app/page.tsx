"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat-interface"
import { CodeInterface } from "@/components/code-interface"
import { ImageInterface } from "@/components/image-interface"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ArtifactProvider } from "@/context/artifact-context"
import { AssistantProvider } from "@/context/assistant-context"
import { PuterProvider } from "@/context/puter-context"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <PuterProvider>
        <AssistantProvider>
          <ArtifactProvider>
            <div className="flex h-screen flex-col bg-background">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden p-4">
                  <Tabs defaultValue="chat" className="h-full flex flex-col">
                    <TabsList className="mx-auto mb-4">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 overflow-hidden rounded-lg border bg-card">
                      <TabsContent
                        value="chat"
                        className="h-full data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <ChatInterface />
                      </TabsContent>
                      <TabsContent
                        value="code"
                        className="h-full data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <CodeInterface />
                      </TabsContent>
                      <TabsContent
                        value="image"
                        className="h-full data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <ImageInterface />
                      </TabsContent>
                    </div>
                  </Tabs>
                </main>
              </div>
            </div>
          </ArtifactProvider>
        </AssistantProvider>
      </PuterProvider>
    </ThemeProvider>
  )
}
