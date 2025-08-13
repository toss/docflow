import { z } from "zod";

export const checkConfigSchema = z
	.object({
  	entryPoints: z.array(z.string()).optional().describe("Entry points to check"),
	})
	.default({});
