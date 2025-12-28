import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes will be added here
import ingestRoutes from './routes/ingest';
import chatRoutes from './routes/chat';

app.use('/api/ingest', ingestRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Personal Knowledge Base Chat API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
