const express = require("express")
const path = require("path")
const compression = require("compression")

const app = express()
const PORT = process.env.PORT || 3000

// Enable compression
app.use(compression())

// Serve static files from the 'out' directory (Next.js static export)
app.use(express.static(path.join(__dirname, "out")))

// Handle all routes by serving the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "out", "index.html"))
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
