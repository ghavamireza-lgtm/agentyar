import { groq } from '@ai-sdk/groq';
import { generateText, streamText, stepCountIs } from 'ai';
import { SOCIAL_SYSTEM_PROMPT } from './prompts';
import { socialTools } from './tools';

const model = groq('qwen/qwen3.6-27b');

export async function runSocialAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: SOCIAL_SYSTEM_PROMPT,
    prompt: userMessage,
    tools: socialTools,
    stopWhen: stepCountIs(5), // ← اینجوری بنویس
  });

  return result;
}

export function streamSocialAgent(messages: any[]) {
  return streamText({
    model,
    system: SOCIAL_SYSTEM_PROMPT,
    messages,
    tools: socialTools,
    stopWhen: stepCountIs(5), // ← اینجا هم همین
  });
}