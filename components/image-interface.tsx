"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useArtifacts } from "@/context/artifact-context"
import { useAssistants } from "@/context/assistant-context"
import { usePuter } from "@/context/puter-context"
import { Save, Send, ImageIcon, Download } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
}

export function ImageInterface() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [artifactName, setArtifactName] = useState("")
  const [style, setStyle] = useState("realistic")
  const { toast } = useToast()
  const { addArtifact } = useArtifacts()
  const { currentAssistant } = useAssistants()
  const { puter } = usePuter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)

    try {
      if (!puter) {
        throw new Error("Puter.js is not initialized")
      }

      // Use puter.js to generate an image
      // This is a simplified example - in a real app, you'd use the actual puter.js API
      setTimeout(() => {
        // Simulate image generation using client-side processing
        // In a real implementation, we would use puter.js's actual image generation capabilities

        // Generate a placeholder image URL based on the prompt
        const placeholderImageUrl = `/placeholder.svg?height=512&width=512`

        setImages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            url: placeholderImageUrl,
            prompt: prompt,
            style: style,
          },
        ])

        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSaveArtifact = () => {
    if (!artifactName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for this image artifact.",
        variant: "destructive",
      })
      return
    }

    addArtifact({
      id: uuidv4(),
      type: "image",
      name: artifactName,
      content: images,
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Success",
      description: "Image saved successfully!",
    })

    setSaveDialogOpen(false)
    setArtifactName("")
  }

  const handleDownloadImage = (image: GeneratedImage) => {
    // Create a temporary link element
    const link = document.createElement("a")
    link.href = image.url
    link.download = `generated-image-${image.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">
            {currentAssistant && currentAssistant.type === "image" ? currentAssistant.name : "Image Generator"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="cartoon">Cartoon</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
              <SelectItem value="sketch">Sketch</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={images.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Images
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Images</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={artifactName}
                    onChange={(e) => setArtifactName(e.target.value)}
                    placeholder="Enter a name for this image collection"
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
      </div>

      <Card className="flex-1 mb-4 overflow-hidden">
        <CardContent className="p-4 h-full">
          {images.length > 0 ? (
            <div className="image-grid h-full overflow-y-auto scrollbar-thin">
              {images.map((image) => (
                <div key={image.id} className="image-card">
                  <img src={image.url || "/placeholder.svg"} alt={image.prompt} />
                  <div className="image-overlay">
                    <p className="text-sm mb-2 truncate">{image.prompt}</p>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => handleDownloadImage(image)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No images generated yet</h3>
              <p className="text-muted-foreground max-w-md">
                Enter a prompt below to generate an image using client-side AI capabilities.
              </p>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="flex-1 min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !prompt.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
