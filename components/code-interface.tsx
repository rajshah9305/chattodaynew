"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useArtifacts } from "@/context/artifact-context"
import { useAssistants } from "@/context/assistant-context"
import { usePuter } from "@/context/puter-context"
import { Save, Send, Code, Copy, Check } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CodeSnippet {
  id: string
  code: string
  language: string
}

export function CodeInterface() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [artifactName, setArtifactName] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()
  const { addArtifact } = useArtifacts()
  const { currentAssistant } = useAssistants()
  const { puter } = usePuter()

  // Add initial code snippet based on current assistant
  useEffect(() => {
    if (currentAssistant && currentAssistant.type === "code" && codeSnippets.length === 0) {
      const initialCode = getInitialCodeForLanguage(language)
      setCodeSnippets([
        {
          id: uuidv4(),
          code: initialCode,
          language: language,
        },
      ])
    }
  }, [currentAssistant, codeSnippets.length, language])

  const getInitialCodeForLanguage = (lang: string) => {
    switch (lang) {
      case "javascript":
        return '// Welcome to the Code Generator\n// Enter a prompt to generate JavaScript code\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));'
      case "python":
        return '# Welcome to the Code Generator\n# Enter a prompt to generate Python code\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))'
      case "html":
        return "<!-- Welcome to the Code Generator -->\n<!-- Enter a prompt to generate HTML code -->\n\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>"
      case "css":
        return "/* Welcome to the Code Generator */\n/* Enter a prompt to generate CSS code */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}"
      default:
        return "// Welcome to the Code Generator\n// Enter a prompt to generate code"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)

    try {
      if (!puter) {
        throw new Error("Puter.js is not initialized")
      }

      // Use puter.js to generate code
      // This is a simplified example - in a real app, you'd use the actual puter.js API
      setTimeout(() => {
        // Simulate code generation using client-side processing
        let generatedCode = ""

        if (language === "javascript") {
          if (prompt.toLowerCase().includes("function")) {
            generatedCode = `// Generated JavaScript function based on your prompt\n\nfunction processData(data) {\n  // Validate input\n  if (!data || typeof data !== 'object') {\n    throw new Error('Invalid data format');\n  }\n\n  // Process the data\n  const result = Object.entries(data).map(([key, value]) => {\n    return {\n      id: key,\n      value: typeof value === 'string' ? value.toUpperCase() : value,\n      timestamp: new Date().toISOString()\n    };\n  });\n\n  return result;\n}\n\n// Example usage\nconst sampleData = {\n  item1: 'hello',\n  item2: 'world',\n  item3: 42\n};\n\nconsole.log(processData(sampleData));`
          } else if (prompt.toLowerCase().includes("api")) {
            generatedCode = `// Generated JavaScript API client\n\nclass ApiClient {\n  constructor(baseUrl) {\n    this.baseUrl = baseUrl || 'https://api.example.com';\n    this.headers = {\n      'Content-Type': 'application/json'\n    };\n  }\n\n  async setAuthToken(token) {\n    this.headers['Authorization'] = \`Bearer \${token}\`;\n  }\n\n  async get(endpoint) {\n    try {\n      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {\n        method: 'GET',\n        headers: this.headers\n      });\n      \n      if (!response.ok) {\n        throw new Error(\`HTTP error! status: \${response.status}\`);\n      }\n      \n      return await response.json();\n    } catch (error) {\n      console.error('API request failed:', error);\n      throw error;\n    }\n  }\n\n  async post(endpoint, data) {\n    try {\n      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {\n        method: 'POST',\n        headers: this.headers,\n        body: JSON.stringify(data)\n      });\n      \n      if (!response.ok) {\n        throw new Error(\`HTTP error! status: \${response.status}\`);\n      }\n      \n      return await response.json();\n    } catch (error) {\n      console.error('API request failed:', error);\n      throw error;\n    }\n  }\n}\n\n// Example usage\nconst api = new ApiClient();\napi.get('/users').then(data => console.log(data));`
          } else {
            generatedCode = `// Generated JavaScript code based on your prompt: "${prompt}"\n\n// Helper function to process user input\nfunction processUserInput(input) {\n  return input.trim().toLowerCase();\n}\n\n// Main application logic\nclass App {\n  constructor() {\n    this.data = [];\n    this.isInitialized = false;\n  }\n\n  initialize() {\n    console.log('Initializing application...');\n    // Simulate loading data\n    this.data = [\n      { id: 1, name: 'Item 1', value: Math.random() * 100 },\n      { id: 2, name: 'Item 2', value: Math.random() * 100 },\n      { id: 3, name: 'Item 3', value: Math.random() * 100 }\n    ];\n    this.isInitialized = true;\n    console.log('Application initialized with', this.data.length, 'items');\n    return this;\n  }\n\n  processData() {\n    if (!this.isInitialized) {\n      throw new Error('App must be initialized before processing data');\n    }\n    \n    const result = this.data.map(item => ({\n      ...item,\n      processed: true,\n      score: item.value > 50 ? 'high' : 'low'\n    }));\n    \n    console.log('Data processed successfully');\n    return result;\n  }\n}\n\n// Example usage\nconst app = new App();\nconst processedData = app.initialize().processData();\nconsole.log(processedData);`
          }
        } else if (language === "python") {
          generatedCode = `# Generated Python code based on your prompt: "${prompt}"\n\nimport json\nfrom datetime import datetime\nfrom typing import Dict, List, Any, Optional\n\n\nclass DataProcessor:\n    \"\"\"A class to process and transform data.\"\"\"\n    \n    def __init__(self, config: Optional[Dict[str, Any]] = None):\n        self.config = config or {}\n        self.processed_items = 0\n        \n    def process_item(self, item: Dict[str, Any]) -> Dict[str, Any]:\n        \"\"\"Process a single data item.\"\"\"\n        # Add processing timestamp\n        item['processed_at'] = datetime.now().isoformat()\n        \n        # Apply transformations based on config\n        if 'transformations' in self.config:\n            for field, transform in self.config['transformations'].items():\n                if field in item and transform == 'uppercase':\n                    item[field] = item[field].upper() if isinstance(item[field], str) else item[field]\n                elif field in item and transform == 'lowercase':\n                    item[field] = item[field].lower() if isinstance(item[field], str) else item[field]\n        \n        self.processed_items += 1\n        return item\n    \n    def process_batch(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:\n        \"\"\"Process a batch of data items.\"\"\"\n        return [self.process_item(item) for item in items]\n    \n    def get_stats(self) -> Dict[str, Any]:\n        \"\"\"Get processing statistics.\"\"\"\n        return {\n            'processed_items': self.processed_items,\n            'last_run': datetime.now().isoformat()\n        }\n\n\n# Example usage\nif __name__ == \"__main__\":\n    # Sample configuration\n    config = {\n        'transformations': {\n            'name': 'uppercase',\n            'description': 'lowercase'\n        }\n    }\n    \n    # Sample data\n    data = [\n        {'id': 1, 'name': 'item one', 'description': 'FIRST ITEM', 'value': 42},\n        {'id': 2, 'name': 'item two', 'description': 'SECOND ITEM', 'value': 73},\n        {'id': 3, 'name': 'item three', 'description': 'THIRD ITEM', 'value': 19}\n    ]\n    \n    # Process the data\n    processor = DataProcessor(config)\n    processed_data = processor.process_batch(data)\n    \n    # Print results\n    print(json.dumps(processed_data, indent=2))\n    print(f\"Stats: {processor.get_stats()}\")`
        } else if (language === "html") {
          generatedCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Generated Page</title>\n    <style>\n        body {\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n            line-height: 1.6;\n            color: #333;\n            max-width: 1200px;\n            margin: 0 auto;\n            padding: 20px;\n            background-color: #f9f9f9;\n        }\n        \n        header {\n            background-color: #6200ea;\n            color: white;\n            padding: 1rem 2rem;\n            border-radius: 8px;\n            margin-bottom: 2rem;\n            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n        }\n        \n        h1 {\n            margin: 0;\n        }\n        \n        nav {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n        \n        nav ul {\n            display: flex;\n            list-style: none;\n            padding: 0;\n            margin: 0;\n        }\n        \n        nav li {\n            margin-left: 1.5rem;\n        }\n        \n        nav a {\n            color: white;\n            text-decoration: none;\n            font-weight: 500;\n            transition: opacity 0.2s;\n        }\n        \n        nav a:hover {\n            opacity: 0.8;\n        }\n        \n        .hero {\n            background-color: white;\n            border-radius: 8px;\n            padding: 3rem;\n            margin-bottom: 2rem;\n            text-align: center;\n            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n        }\n        \n        .hero h2 {\n            font-size: 2.5rem;\n            margin-bottom: 1rem;\n            color: #6200ea;\n        }\n        \n        .hero p {\n            font-size: 1.2rem;\n            max-width: 800px;\n            margin: 0 auto 2rem;\n            color: #666;\n        }\n        \n        .btn {\n            display: inline-block;\n            background-color: #6200ea;\n            color: white;\n            padding: 0.8rem 2rem;\n            border-radius: 4px;\n            text-decoration: none;\n            font-weight: 500;\n            transition: background-color 0.2s;\n        }\n        \n        .btn:hover {\n            background-color: #5000d3;\n        }\n        \n        .features {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n            gap: 2rem;\n            margin-bottom: 3rem;\n        }\n        \n        .feature {\n            background-color: white;\n            border-radius: 8px;\n            padding: 2rem;\n            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n        }\n        \n        .feature h3 {\n            color: #6200ea;\n            margin-top: 0;\n        }\n        \n        footer {\n            text-align: center;\n            margin-top: 3rem;\n            padding-top: 2rem;\n            border-top: 1px solid #eee;\n            color: #666;\n        }\n    </style>\n</head>\n<body>\n    <header>\n        <nav>\n            <h1>WebApp</h1>\n            <ul>\n                <li><a href="#">Home</a></li>\n                <li><a href="#">Features</a></li>\n                <li><a href="#">Pricing</a></li>\n                <li><a href="#">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    \n    <main>\n        <section class="hero">\n            <h2>Welcome to Our Platform</h2>\n            <p>A powerful solution for all your needs. Designed to help you achieve more with less effort.</p>\n            <a href="#" class="btn">Get Started</a>\n        </section>\n        \n        <section class="features">\n            <div class="feature">\n                <h3>Easy to Use</h3>\n                <p>Our intuitive interface makes it simple to get started. No technical knowledge required.</p>\n            </div>\n            \n            <div class="feature">\n                <h3>Powerful Tools</h3>\n                <p>Access a wide range of powerful tools designed to boost your productivity.</p>\n            </div>\n            \n            <div class="feature">\n                <h3>24/7 Support</h3>\n                <p>Our dedicated team is always available to help you with any questions or issues.</p>\n            </div>\n        </section>\n    </main>\n    \n    <footer>\n        <p>&copy; 2023 WebApp. All rights reserved.</p>\n    </footer>\n</body>\n</html>`
        } else if (language === "css") {
          generatedCode = `/* Generated CSS based on your prompt: "${prompt}" */\n\n/* Reset and base styles */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  line-height: 1.6;\n  color: #333;\n  background-color: #f8f9fa;\n}\n\n/* Container */\n.container {\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n/* Typography */\nh1, h2, h3, h4, h5, h6 {\n  margin-bottom: 1rem;\n  line-height: 1.2;\n  font-weight: 700;\n  color: #1a1a1a;\n}\n\nh1 {\n  font-size: 2.5rem;\n}\n\nh2 {\n  font-size: 2rem;\n}\n\nh3 {\n  font-size: 1.75rem;\n}\n\np {\n  margin-bottom: 1.5rem;\n}\n\na {\n  color: #6200ea;\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\n\na:hover {\n  color: #3700b3;\n  text-decoration: underline;\n}\n\n/* Button styles */\n.btn {\n  display: inline-block;\n  background-color: #6200ea;\n  color: white;\n  font-weight: 500;\n  text-align: center;\n  vertical-align: middle;\n  cursor: pointer;\n  padding: 0.75rem 1.5rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: background-color 0.15s ease-in-out;\n  border: none;\n}\n\n.btn:hover {\n  background-color: #3700b3;\n  color: white;\n  text-decoration: none;\n}\n\n.btn-secondary {\n  background-color: #f5f5f5;\n  color: #333;\n  border: 1px solid #ddd;\n}\n\n.btn-secondary:hover {\n  background-color: #e5e5e5;\n  color: #333;\n}\n\n/* Card component */\n.card {\n  background-color: white;\n  border-radius: 8px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  margin-bottom: 1.5rem;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);\n}\n\n.card-header {\n  padding: 1.25rem 1.5rem;\n  border-bottom: 1px solid #eee;\n  background-color: #f8f9fa;\n}\n\n.card-body {\n  padding: 1.5rem;\n}\n\n.card-footer {\n  padding: 1.25rem 1.5rem;\n  border-top: 1px solid #eee;\n  background-color: #f8f9fa;\n}\n\n/* Form elements */\n.form-group {\n  margin-bottom: 1rem;\n}\n\n.form-label {\n  display: inline-block;\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n}\n\n.form-control {\n  display: block;\n  width: 100%;\n  padding: 0.75rem 1rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n\n.form-control:focus {\n  color: #495057;\n  background-color: #fff;\n  border-color: #a880ff;\n  outline: 0;\n  box-shadow: 0 0 0 0.2rem rgba(98, 0, 234, 0.25);\n}\n\n/* Grid system */\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px;\n}\n\n.col {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n}\n\n/* Responsive utilities */\n@media (max-width: 768px) {\n  h1 {\n    font-size: 2rem;\n  }\n  \n  h2 {\n    font-size: 1.75rem;\n  }\n  \n  h3 {\n    font-size: 1.5rem;\n  }\n  \n  .container {\n    padding: 0 15px;\n  }\n}`
        }

        setCodeSnippets((prev) => [
          ...prev,
          {
            id: uuidv4(),
            code: generatedCode,
            language: language,
          },
        ])
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating code:", error)
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSaveArtifact = () => {
    if (!artifactName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for this code artifact.",
        variant: "destructive",
      })
      return
    }

    addArtifact({
      id: uuidv4(),
      type: "code",
      name: artifactName,
      content: codeSnippets,
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Success",
      description: "Code saved successfully!",
    })

    setSaveDialogOpen(false)
    setArtifactName("")
  }

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">
            {currentAssistant && currentAssistant.type === "code" ? currentAssistant.name : "Code Generator"}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={codeSnippets.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Code</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={artifactName}
                    onChange={(e) => setArtifactName(e.target.value)}
                    placeholder="Enter a name for this code snippet"
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
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full p-4 scrollbar-thin">
            <div className="space-y-6">
              {codeSnippets.map((snippet) => (
                <div key={snippet.id} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">
                      {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(snippet.id, snippet.code)}
                      className="h-8 w-8 p-0"
                    >
                      {copied === snippet.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="p-4 rounded-md bg-secondary overflow-x-auto code-editor">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe the ${language} code you want to generate...`}
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
