import { AssemblyAI } from "assemblyai";

// Server-side only — never import in client components
export const assemblyClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});
