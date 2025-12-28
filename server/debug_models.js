require('dotenv').config();
const axios = require('axios');

async function listModels() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error("Error: GOOGLE_API_KEY is missing in .env");
        return;
    }

    try {
        console.log("Fetching available models from Google API...");
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        const models = response.data.models;
        if (models) {
            console.log("\nAvailable Models:");
            models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found in response.");
        }
    } catch (error) {
        console.error("Failed to list models:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

listModels();
