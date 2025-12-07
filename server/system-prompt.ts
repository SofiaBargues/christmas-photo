"use server";

export async function systemPrompt(prompt: string) {
  return `
CRITICAL PRESERVATION:
- Keep all faces, eyes, and expressions exactly identical to the original.
- Maintain the original composition, proportions, and structure of the background.

MODIFICATIONS:

- Decorate the existing environment with Christmas elements (garlands, lights, ornaments, stockings) that integrate naturally. Only replace the background if it's unclear or undefined.
- Dress people in festive attire (Santa hat, Christmas sweater, plaid scarf) while keeping poses unchanged.

${prompt ? `Additional instructions: ${prompt}` : ""}
`;
}
