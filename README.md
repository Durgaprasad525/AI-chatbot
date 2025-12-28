# Personal Knowledge Chatbot

Welcome! This is your personal chatbot that can read your documents and answer questions about them.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** installed on your computer.
- A **Google Gemini API Key** (Get one here: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)).

### 2. Setup Backend (The Brain)
Open a terminal and run:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and paste your API Key:
```
GOOGLE_API_KEY=your_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend (The Interface)
Open a **new** terminal window and run:

```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## 📚 How to Use

1.  **Upload**: Drag & Drop your PDF, Markdown, or Text files into the upload box.
2.  **Wait**: You'll see a success message when it's ready.
3.  **Chat**: Ask questions about your documents in the chat window!

## 🛠 Troubleshooting

-   **Upload Failed?** Check the terminal where the backend is running. If it says "Quota Exceeded", wait a minute and try again.
-   **Chat Error?** Ensure your API Key is valid and has access to `gemini-2.0-flash`.

## 📁 Project Structure

-   `client/`: React website code.
-   `server/`: Node.js backend code.
-   `server/vector_store/`: Where your document "memories" are stored locally.
-   `server/uploads/`: Temporary folder for processing files.

Enjoy your personal AI assistant!
