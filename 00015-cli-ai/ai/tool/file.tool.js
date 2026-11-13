import { tool } from "langchain";
import * as z from "zod";
import fs from "fs/promises";
/**
 *  "Create/Update multiple files at once (create one if not existed)",
 */
export const upsertFiles = tool(
  async function upsertFiles({ files }) {
    await Promise.all(
      files.map(async (file) => {
        return await fs.writeFile(file.path, file.content);
      }),
    ); // it will create/update all the files in parallel using Promise.all, which will wait for all the promises to resolve before returning. It will create a new file if it does not exist, or update the existing file if it does exist.
    return "files created/updated successfully";
  },
  {
    name: "upsertFiles",
    description:
      "Create/Update multiple files at once (create one if not existed)",
    schema: z.object({
      files: z
        .array(
          z.object({
            name: z
              .string()
              .describe("The name of the file to be created/updated"),
            path: z
              .string()
              .describe("The absolute path of the file to be created/updated"),
            content: z
              .string()
              .describe("The content of the file to be created/updated"),
          }),
        )
        .describe("A list of files to upsert (create/update)"),
    }),
  },
);
  
/**
 * List all the folder (recursively) and files in the current folder (ignore folders like node_modules)
 */
export const listFiles = tool(
    async function ({ folder }) {
        const results = []
        async function traverse(currentFolder) {
            const entries = await fs.readdir(currentFolder, { withFileTypes: true })
            for (const entry of entries) {
                const fullPath = `${currentFolder}/${entry.name}`
                if (entry.isDirectory()) {
                    if (entry.name === "node_modules") continue
                    await traverse(fullPath)
                } else {
                    results.push(fullPath)
                }
            }
        }
        await traverse(folder)
        return JSON.stringify(results)
    },
    {
        name: "listFiles",
        description: "List all the folder (recursively) and files in the current folder (ignore folders like node_modules)",
        schema: z.object({
            folder: z.string().describe("absolute path of the folder to list")
        })
    }
)

/**
 * Read the content of multiple file at once 
 */
export const readFiles = tool(
    async function ({ files }) {
        const results = await Promise.all(files.map(async file => {
            const content = await fs.readFile(file.path, "utf-8")
            return { path: file.path, content }
        }))
        return JSON.stringify(results)
    },
    {
        name: "readFiles",
        description: "Read the content of multiple files at once",
        schema: z.object({
            files: z.array(z.object({
                path: z.string().describe("absolute path of the file to be read")
            }))
        })
    }
)
