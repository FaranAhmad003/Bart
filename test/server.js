const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const path = require("path"); // Add this line to use path module for file paths
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from 'public' directory (change if your static files are in a different directory)
app.use(express.static("public"));
require("dotenv").config();
// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
console.log('API Key:', process.env.API_KEY); // This should output your actual API key

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.send({ message: text });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send({ error: "Error generating text" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
