import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../src/utils/file.utils.js";
import { AIMessage } from "langchain";
import {upsertFileTool} from "../tool/file.tool.js";

export  async function LLMNode(state) {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });
    
 const modelWithTools = model.bindTools([upsertFileTool]); //it will add the upsertFileTool to the model, so that the model can use the tool to create/update files.
  const stream = await modelWithTools.stream(state.messages);
  process.stdout.write("[AI]: ");
  let aiMessage = "";

  for await (const chunk of stream) {
    console.log("Chunk received:", chunk); // it will print the chunk received from the model, which is a part of the AI message. it will be used to debug the model response.
    process.stdout.write(chunk.text);
    aiMessage += chunk.text;
  }  
process.stdout.write("\n");
  return {
    messages :[...state.messages, new AIMessage(aiMessage)]
  }
}
