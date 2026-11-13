import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../src/utils/file.utils.js";
import { upsertFiles, readFiles , listFiles} from "../tool/file.tool.js";
import * as filesTool from "../tool/file.tool.js";
import { ToolMessage } from "langchain";
import rl from "../../src/utils/readline.js";

export async function LLMNode(state) {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTools = model.bindTools([upsertFiles, readFiles, listFiles]); //it will add the upsertFiles tool to the model, so that the model can use the tool to create/update files.
  const stream = await modelWithTools.stream(state.messages);
  // process.stdout.write("[AI]: ");
  let aiMessage = null;

  for await (const chunk of stream) {
    process.stdout.write(chunk.text);
    if (!aiMessage)
      aiMessage = chunk; // it will assign the first chunk received from the model to the aiMessage, which is a part of the AI message.
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
export async function ToolNode(state, config) {

    const messages = state.messages
    const lastMessage = state.messages[ state.messages.length - 1 ]
    const toolCalls = lastMessage.tool_calls

    const toolResults = []

    for (const toolCall of toolCalls) {

        switch (toolCall.name) {
            case "upsertFiles":
                process.stdout.write(`[Tool]: Updating/creating files ${JSON.stringify(toolCall.args.files.map(f => f.path).join(", "))}\n`)
                const userInput = await rl.question("Do you want to proceed? (yes/no): ")
                if (userInput.toLowerCase() !== "yes") {
                    process.stdout.write("Aborting file update.\n")
                    return new ToolMessage({
                        content: "User aborted file update/create.",
                        tool_call_id: toolCall.id
                    })
                }
                const result = await filesTool.upsertFiles.invoke(toolCall)
                toolResults.push(result)
                break;
            case "readFiles":
                process.stdout.write(`[Tool]: Reading files ${JSON.stringify(toolCall.args.files.map(f => f.path).join(", "))}\n`)
                const readResult = await filesTool.readFiles.invoke(toolCall)
                toolResults.push(readResult)
                break;

            case "listFiles":
                process.stdout.write(`[Tool]: Listing files\n`)
                const listResult = await filesTool.listFiles.invoke(toolCall)
                toolResults.push(listResult)
                break;

            default:
                process.stdout.write(`[Tool]: Unknown tool ${toolCall.name}\n`)
                break;
        }

    }


    return {
        messages: [
            ...state.messages,
            ...toolResults
        ]
    }

}


