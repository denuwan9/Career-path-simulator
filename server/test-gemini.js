const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    console.log("Testing Gemini API...");
    const key = process.env.GOOGLE_API_KEY;
    console.log("Key:", key ? key.slice(0, 5) + "..." : "MISSING");

    const genAI = new GoogleGenerativeAI(key);

    try {
        console.log("Fetching available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        const fs = require('fs');
        fs.writeFileSync('models.txt', JSON.stringify(data, null, 2));
        console.log("Wrote models to models.txt");
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }

    const models = ["gemini-2.5-flash", "gemini-flash-latest"];

    for (const modelName of models) {
        try {
            process.stdout.write(`Testing ${modelName}... `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`SUCCESS!`);
            break;
        } catch (error) {
            console.log(`FAILED (${error.status})`);
        }
    }
}

test();
