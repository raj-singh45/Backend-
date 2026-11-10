import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../src/utils/file.utils.js";
import { upsertFiles } from "../tool/file.tool.js";
import * as filesTool from "../tool/file.tool.js";

export async function LLMNode(state) {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTools = model.bindTools([upsertFiles]); //it will add the upsertFiles tool to the model, so that the model can use the tool to create/update files.
  const stream = await modelWithTools.stream(state.messages);
  process.stdout.write("[AI]: ");
  let aiMessage = null;

  for await (const chunk of stream) {
    process.stdout.write(chunk.text);
    if (!aiMessage) aiMessage = chunk;// it will assign the first chunk received from the model to the aiMessage, which is a part of the AI message.
    else aiMessage = aiMessage.concat(chunk); // it will concatenate the chunk received from the model to the aiMessage, which is a part of the AI message.
  }
  process.stdout.write("\n");
  return {
    messages: [...state.messages, aiMessage], //it will return the updated state with the new AI message appended to the messages array.
  };
}
/**
 * Handles the LLM node logic for the state graph.
 * @param {Object} state - The current state of the graph.
 * @returns {Promise<Object>} - The updated state after processing.
 */

export async function ToolNode(state, config){
 const messages = state.messages;
 const lastMessage = messages[messages.length - 1];
  const toolCalls = lastMessage.tool_calls; // it will get the tool calls from the last message, which is a part of the AI message chunk.
  const toolResults = await Promise.all(toolCalls.map( async toolCall =>{
    return filesTool[toolCall.name].invoke(toolCall)
  }))
  //toolResults is also array 
  return{
    messages :[...state.messages , ...toolResults]
  }
}