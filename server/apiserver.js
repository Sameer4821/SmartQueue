require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

const PORT = 3000;


// Load API Key
const apiKey = process.env.GROQ_API_KEY;
console.log("Groq Key:", apiKey ? "Loaded" : "Not Loaded");

// Initialize Groq Client
const groq = new Groq({ apiKey });

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// AI Triage Endpoint
app.post("/api/triage", async (req, res) => {
  const symptoms = req.body.symptom_text;

  if (!symptoms) {
    return res.status(400).json({ error: "symptom_text is required" });
  }

  const prompt = `Analyze these symptoms: "${symptoms}". 
Choose the best department from this list:
General Medicine, Cardiology, Orthopedics, Gastroenterology, Neurology, Emergency, Pediatrics.
Return ONLY the department name.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const aiAnswer = completion.choices[0].message.content.trim();

    const allowed = [
      "General Medicine",
      "Cardiology",
      "Orthopedics",
      "Gastroenterology",
      "Neurology",
      "Emergency",
      "Pediatrics"
    ];

    const finalDept = allowed.includes(aiAnswer) ? aiAnswer : "General Medicine";

    res.json({
      status: "success",
      department_recommendation: finalDept
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Groq API failed. Check your key."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://192.168.230.40:${PORT}`);

});
