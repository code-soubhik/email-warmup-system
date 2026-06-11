import { withRateLimit } from "@/_lib/rateLimit"

async function handler() {
  return Response.json({ message: 'Hello World', time: new Date().toLocaleTimeString()})
}

export const GET = withRateLimit(handler);