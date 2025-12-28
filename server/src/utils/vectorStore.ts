import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import path from "path";
import fs from "fs";

// Storage path for HNSWLib
const VECTOR_STORE_PATH = path.resolve(__dirname, "../../vector_store");

export const getVectorStore = async () => {
    // Ensure directory exists
    if (!fs.existsSync(VECTOR_STORE_PATH)) {
        fs.mkdirSync(VECTOR_STORE_PATH, { recursive: true });
    }

    // Initialize Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        apiKey: process.env.GOOGLE_API_KEY,
    });

    let vectorStore;

    if (fs.existsSync(path.join(VECTOR_STORE_PATH, "args.json"))) {
        console.log("Loading existing vector store...");
        try {
            vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, embeddings);
            console.log("Vector store loaded successfully.");
        } catch (err) {
            console.error("Failed to load vector store, recreating...");
            // If load fails, we should clear it
            fs.rmSync(VECTOR_STORE_PATH, { recursive: true, force: true });
            fs.mkdirSync(VECTOR_STORE_PATH, { recursive: true });
            // Fallthrough to create new
            const verifyEmbed = await embeddings.embedQuery("test");
            console.log(`Generated embedding dimension: ${verifyEmbed.length}`);

            console.log("Creating new vector store...");
            vectorStore = await HNSWLib.fromTexts(
                ["Initial document"],
                [{ id: 1 }],
                embeddings
            );
            await vectorStore.save(VECTOR_STORE_PATH);
        }
    } else {
        const verifyEmbed = await embeddings.embedQuery("test");
        console.log(`Generated embedding dimension: ${verifyEmbed.length}`);

        console.log("Creating new vector store...");
        vectorStore = await HNSWLib.fromTexts(
            ["Initial document"],
            [{ id: 1 }],
            embeddings
        );
        await vectorStore.save(VECTOR_STORE_PATH);
    }
    return vectorStore;
};

export const saveVectorStore = async (vectorStore: HNSWLib) => {
    await vectorStore.save(VECTOR_STORE_PATH);
}
