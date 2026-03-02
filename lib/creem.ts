import { createCreem } from 'creem_io';

export function getCreem() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    throw new Error("CREEM_API_KEY is not configured");
  }
  return createCreem({ apiKey });
}
