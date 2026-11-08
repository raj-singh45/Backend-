import { StateGraph, START, END } from "@langchain/langgraph";
import { HumanMessage } from "langchain";
import * as z from "zod";
import rl from "../../src/utils/readline.js";
import { LLMNode } from "./node.js";

const stateFormate = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(stateFormate)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

export default async function initGraph() {
   while(true){
    const userInput = await rl.question("[User]: ");
   const response = await graph.invoke({
      messages: [new HumanMessage(userInput )],
    });
   }
}