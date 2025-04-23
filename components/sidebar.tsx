"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useArtifacts } from "@/context/artifact-context"
import { useAssistants } from "@/context/assistant-context"
import { MessageSquare, Code, ImageIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isMobile?: boolean
}

export function Sidebar({ isMobile = false }: SidebarProps) {
  const { artifacts, removeArtifact } = useArtifacts()
  const { assistants, setCurrentAssistant } = useAssistants()
  const [activeTab, setActiveTab] = useState("artifacts")

  const chatArtifacts = artifacts.filter((a) => a.type === "chat")
  const codeArtifacts = artifacts.filter((a) => a.type === "code")
  const imageArtifacts = artifacts.filter((a) => a.type === "image")

  const chatAssistants = assistants.filter((a) => a.type === "chat")
  const codeAssistants = assistants.filter((a) => a.type === "code")
  const imageAssistants = assistants.filter((a) => a.type === "image")

  return (
    <div
      className={cn(
        "pb-12 w-[240px] flex-shrink-0 border-r bg-background",
        isMobile ? "w-full h-full" : "hidden md:block",
      )}
    >
      <Tabs defaultValue="artifacts" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="px-4 py-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
            <TabsTrigger value="assistants">Assistants</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="artifacts" className="flex-1 overflow-hidden">
          <div className="space-y-4 py-2 px-4">
            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Chat Artifacts</h2>
              <ScrollArea className="h-[120px]">
                {chatArtifacts.length > 0 ? (
                  <div className="space-y-1 px-1">
                    {chatArtifacts.map((artifact) => (
                      <div key={artifact.id} className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span className="truncate">{artifact.name}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeArtifact(artifact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground px-2">No chat artifacts saved</p>
                )}
              </ScrollArea>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Code Artifacts</h2>
              <ScrollArea className="h-[120px]">
                {codeArtifacts.length > 0 ? (
                  <div className="space-y-1 px-1">
                    {codeArtifacts.map((artifact) => (
                      <div key={artifact.id} className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                          <Code className="mr-2 h-4 w-4" />
                          <span className="truncate">{artifact.name}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeArtifact(artifact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground px-2">No code artifacts saved</p>
                )}
              </ScrollArea>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Image Artifacts</h2>
              <ScrollArea className="h-[120px]">
                {imageArtifacts.length > 0 ? (
                  <div className="space-y-1 px-1">
                    {imageArtifacts.map((artifact) => (
                      <div key={artifact.id} className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          <span className="truncate">{artifact.name}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeArtifact(artifact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground px-2">No image artifacts saved</p>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assistants" className="flex-1 overflow-hidden">
          <div className="space-y-4 py-2 px-4">
            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Chat Assistants</h2>
              <div className="space-y-1 px-1">
                {chatAssistants.map((assistant) => (
                  <Button
                    key={assistant.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => setCurrentAssistant(assistant)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {assistant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Code Assistants</h2>
              <div className="space-y-1 px-1">
                {codeAssistants.map((assistant) => (
                  <Button
                    key={assistant.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => setCurrentAssistant(assistant)}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    {assistant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Image Assistants</h2>
              <div className="space-y-1 px-1">
                {imageAssistants.map((assistant) => (
                  <Button
                    key={assistant.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => setCurrentAssistant(assistant)}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {assistant.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
