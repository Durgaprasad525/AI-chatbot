import express, { Request, Response } from 'express';
import { getVectorStore } from '../utils/vectorStore';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

const formatDocumentsAsString = (documents: Document[]) => {
    return documents.map((doc) => doc.pageContent).join("\n\n");
};

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const vectorStore = await getVectorStore();
        const retriever = vectorStore.asRetriever();

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
        });

        // Simple RAG chain
        const template = `Answer the question based only on the following context:
{context}

Question: {question}
`;
        const prompt = PromptTemplate.fromTemplate(template);

        const chain = RunnableSequence.from([
            {
                context: async (input: string) => {
                    const relevantDocs = await retriever.invoke(input);
                    return formatDocumentsAsString(relevantDocs);
                },
                question: (input: string) => input,
            },
            prompt,
            model,
            new StringOutputParser(),
        ]);

        const response = await chain.invoke(message);

        res.json({ response });

    } catch (error: any) {
        console.error('Chat error full details:', JSON.stringify(error, null, 2));
        res.status(500).json({ error: error.message || 'Failed to process chat message' });
    }
});

export default router;
