import { tool } from "langchain";
import * as z from "zod";
import fs from "fs/promises";
/**
 *  "Create/Update multiple files at once (create one if not existed)",
 */
export const upsertFileTool = tool(
  async function upsertFile({ files }) {
    await Promise.all(
      files.map(async (file) => {
        return await fs.writeFile(file.path, file.content);
      }),
    ); // it will create/update all the files in parallel using Promise.all, which will wait for all the promises to resolve before returning. It will create a new file if it does not exist, or update the existing file if it does exist.
    return "files created/updated successfully";
  },
  {
    name: "upsertFile",
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
