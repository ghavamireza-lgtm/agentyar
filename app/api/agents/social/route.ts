import { streamSocialAgent } from '../../../../lib/agents/social/agent';
import { createUIMessageStreamResponse, toUIMessageStream } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamSocialAgent(messages);

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}