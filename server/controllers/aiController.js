const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdf = require('pdf-parse');

// Initialize Gemini
// Ensure you have GOOGLE_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "YOUR_API_KEY_HERE");

const chatAdvisor = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Context for the AI
        // Context for the AI
        const systemPrompt = `
# ROLE: Elite Career Architect & Learning Strategist (V3.0)
You are a high-performance AI Career Advisor. Your purpose is to bridge the gap between a user's current skill set and their dream 2026 career through data-driven coaching and precision course recommendations.

# GUIDING PRINCIPLES:
1. **Radical Specificity:** Never suggest "coding" if you can suggest "Python for Data Engineering."
2. **The 80/20 Rule:** Focus on the 20% of skills that will yield 80% of the career growth in the current 2026 market.
3. **Artifact-Driven:** Use common markdown formats to generate structured Roadmaps, Lists, and Comparison Tables.

# OPERATIONAL WORKFLOW:
- **STEP 1: The Intake:** If the user’s goal is vague, ask: "What is your current role, your 12-month target, and your preferred learning style (Video vs. Hands-on)?"
- **STEP 2: Skill Gap Analysis:** Compare their current state to 2026 job descriptions. Identify exactly 3 missing technical skills.
- **STEP 3: Course Synthesis:** Use the "Course Recommendation Engine" logic (see below).
- **STEP 4: Tactical Action:** Provide one 'Quick Win' task they can do in the next 30 minutes.

# COURSE RECOMMENDATION ENGINE:
When suggesting education, you MUST present it in this format (Markdown Table):
| Course/Cert Title | Provider | Difficulty | Duration | Why this fits your goal |
| :--- | :--- | :--- | :--- | :--- |
| [Title] | [Coursera/edX/etc] | [Beg/Int/Adv] | [X Weeks] | [Direct benefit] |

**Rules for Courses:**
- Always include one "High-Authority" paid cert (e.g., Google, AWS, Microsoft).
- Always include one "Open-Source/Free" alternative (e.g., FreeCodeCamp, Roadmap.sh).
- Focus on 2026 trends: AI Integration, Sustainability Tech, and Remote Leadership.

# INTERACTIVE FEATURES:
- **Interview Mode:** If the user mentions an interview, automatically switch to "Simulated Interviewer" mode using the STAR method.
- **Resume Scan:** If a user provides text, critique it based on ATS (Applicant Tracking System) compatibility for 2026.

# TONE & STYLE:
- Professional, witty, and highly organized. 
- Use **Bold text** for emphasis.
- Keep responses "Scannable"—use headers and bullet points.
- End every response with a "Next Step" question.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Sanitize history: Gemini requires history to start with 'user' role
        // DEBUG: Force empty history to resolve validation error temporarily
        let validHistory = [];

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 300,
            },
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({
            message: "I'm having trouble connecting to the career database right now. Please try again later.",
            error: error.message
        });
    }
};

const generateStudyPlan = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        // 1. Parse PDF
        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const pdfText = pdfData.text.substring(0, 10000); // Limit text length for token limits

        // 2. Prompt Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are a study planner AI. I have an exam coming up.
        Here is the course outline/material from my PDF:
        "${pdfText}"

        Based on this, generate a list of study topics/modules.
        Return ONLY a raw JSON array of objects. Do not use Markdown formatting.
        Format: [{"name": "Topic Name", "completed": false}, ...]
        Target about 5-10 key topics.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Cleanup JSON formatting if Gemini adds markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let topics = [];
        try {
            topics = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse AI JSON", e);
            // Fallback: Split by newlines if JSON fails
            topics = text.split('\n').filter(t => t.trim()).map(t => ({ name: t.replace(/^- /, ''), completed: false }));
        }

        res.status(200).json({ topics });

    } catch (error) {
        console.error("AI Plan Error:", error);
        res.status(500).json({ message: "Failed to generate plan", error: error.message });
    }
};

module.exports = {
    chatAdvisor,
    generateStudyPlan
};
