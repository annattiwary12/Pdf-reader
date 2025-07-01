import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import 'dotenv/config'; // Loads .env
import path from 'path';
import fs from 'fs';

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    console.log(`📥 Job received:`, job.data);
    const data = job.data;

    try {
      // ✅ 1. Validate and resolve path
      if (!data.path || typeof data.path !== 'string') {
        throw new Error(`❌ Invalid or missing PDF file path. Got: ${data.path}`);
      }

      const pdfPath = path.resolve(data.path);
      console.log(`📁 Resolved PDF path: ${pdfPath}`);

      if (!fs.existsSync(pdfPath)) {
        throw new Error(`❌ File does not exist at path: ${pdfPath}`);
      }

      // 📄 2. Load PDF
      console.log('📄 Loading PDF...');
      const loader = new PDFLoader(pdfPath);
      const docs = await loader.load();
      console.log(`✅ Loaded ${docs.length} document(s) from PDF.`);

      // ✂️ 3. Split into chunks
      console.log('✂️ Splitting document into chunks...');
      const splitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await splitter.splitDocuments(docs);
      console.log(`✅ Split into ${splitDocs.length} chunks.`);

      // 🔗 4. Generate embeddings
      console.log('🧠 Generating embeddings...');
      const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      });

      // 📤 5. Store in Qdrant
      console.log('📤 Storing vectors in Qdrant...');
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: 'http://127.0.0.1:6333', // Use 127.0.0.1 instead of localhost to avoid Windows socket issues
          collectionName: 'langchainjs-testing',
        }
      );

      await vectorStore.addDocuments(splitDocs);
      console.log(`✅ All documents added to Qdrant successfully.`);
    } catch (error) {
      console.error('❌ Error during job execution:', error.message);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: 6379,
    },
  }
);
