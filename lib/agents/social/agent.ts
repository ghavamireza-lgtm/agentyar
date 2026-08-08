import { groq } from '@ai-sdk/groq';
import { generateText, streamText, stepCountIs } from 'ai';
import { SOCIAL_SYSTEM_PROMPT } from './prompts';
import { socialTools } from './tools';

const model = groq('lIama-3.3-70b-versatile');

export async function runSocialAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: SOCIAL_SYSTEM_PROMPT,
    prompt: userMessage,
    tools: socialTools,
    stopWhen: stepCountIs(3),
  });

  return result;
}

export function streamSocialAgent(messages: any[]) {
  return streamText({
    model,
    system: SOCIAL_SYSTEM_PROMPT,
    messages,
    tools: socialTools,
    stopWhen: stepCountIs(3),
  });
}