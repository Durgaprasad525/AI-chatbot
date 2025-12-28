require('dotenv').config();

async function listModels() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error("Error: GOOGLE_API_KEY is missing in .env");
        return;
    }

    try {
        console.log("Fetching available models from Google API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();

        if (data.models) {
            console.log("\nAvailable Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods) {
                    if (m.supportedGenerationMethods.includes("generateContent")) {
                        console.log(`[CHAT] ${m.name}`);
                    }
                    if (m.supportedGenerationMethods.includes("embedContent")) {
                        console.log(`[EMBED] ${m.name}`);
                    }
                }
            });
        } else {
            console.log("No models found in response.");
        }
    } catch (error) {
        console.error("Failed to list models:", error);
    }
}

listModels();
