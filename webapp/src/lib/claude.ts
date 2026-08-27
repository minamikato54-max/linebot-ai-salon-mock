import Anthropic from "@anthropic-ai/sdk";

// ANTHROPIC_API_KEY環境変数から自動解決される
export const claude = new Anthropic();
