import { z } from "zod";
import { DEFAULT_PROMPT } from "./prompt.js";

export const generateConfigSchema = z
  .object({
    jsdoc: z.object({
      fetcher: z
        .function()
        .args(
          z.object({
            signature: z.string(),
            prompt: z.string(),
          }),
        )
        .returns(z.promise(z.string()))
        .describe("Function to fetch JSDoc from AI service"),
      prompt: z.string().default(DEFAULT_PROMPT).optional(),
    }),
  })
  .optional();
