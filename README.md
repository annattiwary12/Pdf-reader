# 🧠 Chat with PDF

Chat with any PDF using AI! This tool lets you upload a PDF and ask questions about its content — perfect for studying, summarizing, or extracting key insights.

## 🔍 Features

- 📄 Upload any PDF file
- 💬 Ask questions based on the documents
- 🧠 Get answers using AI + embeddings
- 🧹 Clean and simple UI
- 💾 Memory of conversation (optional)

## 🛠️ Tech Stack

- [React](w) (frontend)
- [Node.js](w) / [Express](w) (backend)
- [LangChain](w) or [OpenAI API](w)
- [Pinecone](w), [ChromaDB](w), or [FAISS](w) for vector search
- [pdf-parse](w) or [pdfjs-dist](w) for reading PDF content

## ⚙️ How It Works

1. Upload a PDF file.
2. Text is extracted and split into chunks.
3. Chunks are converted into embeddings and stored in a vector database.
4. Your query is also embedded and compared with relevant chunks.
5. The relevant text is sent to an LLM to generate a response.

## 🧑‍💻 Getting Started

### Backend

```bash
git clone https://github.com/your-username/chat-with-pdf.git
cd chat-with-pdf/backend
npm install
npm run dev
