import {PDFParse}from "pdf-parse"
import fs from "fs/promises"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere"
import "dotenv/config"
import { Pinecone } from "@pinecone-database/pinecone";


const parser  = new PDFParse({
    data :await  fs.readFile("./story.pdf")
})
// –––––––––––––––––––––––––– Extract all the text from pdf file –––––––––––––––––––––––––
const text =(await parser.getText({pageJoiner:""})).text ;

// --------------------------split the text into chunks-------------------------------------
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 })
 const chunks = await textSplitter.splitText(text) ; 
 //console.log(chunks) ; 

 
// –––––––––––––––––––––––––– Initialize embeddings [embedding model] –––––––––––––––––––––––––

const embeddings = new CohereEmbeddings({
    model: "embed-v5.0-fast",
    apiKey: process.env.COHERE_API_KEY
})

const vectors = await embeddings.embedDocuments(chunks)


// –––––––––––––––––––––––––– Initialize Pinecone client –––––––––––––––––––––––––
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });


const index = pc.Index({
    name: "cohort-rag",
    host: "https://cohort-rag-iibxmfv.svc.aped-4627-b74a.pinecone.io"
});

await index.documents.upsert({
    documents: vectors.map((vector, index) => {
        return {
            _id: `chunk-${index}`,
            embedding: vector,
            content: chunks[ index ]
        }
    })
})

// documents: [
//   {
//     _id: 'chunk-0',
//     embedding: [0.012, -0.045, 0.891, ...],
//     content: 'Pehle chunk ka asli text...'
//   },
//   {
//     _id: 'chunk-1',
//     embedding: [-0.033, 0.112, 0.405, ...],
//     content: 'Doosre chunk ka asli text...'
//   }
// ]