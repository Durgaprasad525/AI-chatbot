import express, { Request, Response } from 'express';
import multer from 'multer';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore, saveVectorStore } from '../utils/vectorStore';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Extend Request interface to include file
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

router.post('/', upload.single('file'), async (req: MulterRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        console.log(`Processing file: ${req.file.originalname} (${fileType})`);

        let docs;

        if (fileType === 'application/pdf') {
            const loader = new PDFLoader(filePath);
            docs = await loader.load();
        } else {
            // Assume text/plain or markdown for now
            // Simple Loading for text files
            const content = fs.readFileSync(filePath, 'utf-8');
            // We need to construct a Document object manually if not using a loader, 
            // but using TextSplitter directly on string is easier if we just have raw text.
            // However, to keep it consistent with docs structure:
            docs = [{ pageContent: content, metadata: { source: req.file.originalname } }];
        }

        // Split text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        // Use splitDocuments for Document objects
        const splitDocs = await splitter.splitDocuments(docs);

        // Store
        const vectorStore = await getVectorStore();

        // Gemini Free Tier has strict rate limits. We'll batch to avoid hitting them.
        const BATCH_SIZE = 1;
        const DELAY_MS = 2000; // 2 seconds delay between batches

        console.log(`Ingesting ${splitDocs.length} chunks in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < splitDocs.length; i += BATCH_SIZE) {
            const batch = splitDocs.slice(i, i + BATCH_SIZE);
            try {
                await vectorStore.addDocuments(batch);
                console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(splitDocs.length / BATCH_SIZE)}`);
            } catch (batchError) {
                console.error(`Error processing batch ${i}:`, batchError);
                throw batchError;
            }
            if (i + BATCH_SIZE < splitDocs.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        }

        await saveVectorStore(vectorStore);

        // Cleanup
        fs.unlinkSync(filePath);

        res.json({ message: 'Ingestion successful', chunks: splitDocs.length });

    } catch (error: any) {
        console.error('Ingestion error full details:', JSON.stringify(error, null, 2));
        res.status(500).json({ error: error.message || 'Failed to ingest document' });
    }
});

export default router;
