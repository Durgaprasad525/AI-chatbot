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

## 🧠 How It Works (The Tech Stack)

This project uses a technique called **RAG (Retrieval-Augmented Generation)** to make the AI smart about *your* data.

1.  **LangChain ("The Orchestrator")**:
    -   Think of this as the "glue" that connects the PDF reader, the database, and the AI model together. It manages the flow of data.

2.  **Vector Store ("The Memory")**:
    -   When you upload a document, we don't just save the text. We convert it into long lists of numbers called **Embeddings** using Google's `text-embedding-004` model.
    -   We store these numbers in a local **HNSWLib** database.
    -   This allows the bot to search for "concepts" rather than just keywords. For example, searching for "dog" might also find "puppy".

3.  **RAG Process**:
    -   **You ask:** "What is my resume about?"
    -   **Search:** The system searches the Vector Store for the most relevant parts of your document.
    -   **Augment:** It combines your question + the found text.
    -   **Generate:** It sends this combined info to **Gemini** to write the final answer.

4.  **Google Gemini ("The Brain")**:
    -   We use the **Gemini 2.0 Flash** model to generate the actual answers. It's fast, smart, and efficient.

## 🛠 Troubleshooting

-   **Upload Failed?** Check the terminal where the backend is running. If it says "Quota Exceeded", wait a minute and try again.
-   **Chat Error?** Ensure your API Key is valid and has access to `gemini-2.0-flash`.

## 📁 Project Structure

-   `client/`: React website code.
-   `server/`: Node.js backend code.
-   `server/vector_store/`: Where your document "memories" are stored locally (do not delete this if you want to keep your data!).
-   `server/uploads/`: Temporary folder for processing files.

Enjoy your personal AI assistant!
