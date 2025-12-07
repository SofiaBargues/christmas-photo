"use server";

//Transform the person(s) in this image into a warm Christmas/holiday scene while preserving all faces exactly as in the original (no changes to facial features, expressions, or identity) and keeping their original poses. Add warm, ambient Christmas lighting (soft, 2700–3200K) without altering facial shapes.
// **Important for background**: If the background is visible and defined, DO NOT replace it. Instead, decorate the existing environment by naturally integrating Christmas elements such as garlands on walls, hanging Christmas lights, ornaments on visible surfaces, stockings on fireplaces (if present), candles, or small festive decorations that complement the original space. Only if the background is unclear, blurred, or undefined, then replace it with an appropriate Christmas scene.
// Dress the people in festive Christmas attire (Santa hat, Christmas sweater, plaid scarf, red/green holiday clothing) ensuring the outfits appear natural. Maintain original composition and proportions; avoid altering facial structure. The final result should show the original space enhanced with Christmas decorations rather than completely transformed.
// Eyes preservation**: The eyes must remain EXACTLY identical to the original photo.

export async function systemPrompt(prompt: string) {
  return `Transform the person(s) in this image into a warm Christmas/holiday scene while preserving all faces exactly as in the original (no changes to facial features, expressions, or identity) and keeping their original poses. 

GUIDELINES:
Add warm, ambient Christmas lighting (soft, 2700-3200K). 

- Background: If the background is visible and defined, DO NOT replace it. Instead, decorate the existing environment by naturally integrating Christmas elements such as garlands on walls, hanging Christmas lights, ornaments on visible surfaces, stockings on fireplaces (if present), candles, or small festive decorations that complement the original space. Only if the background is unclear, blurred, or undefined, then replace it with an appropriate Christmas scene.

- Dressing: Dress the people in festive Christmas attire (Santa hat, Christmas sweater, plaid scarf, red/green holiday clothing) ensuring the outfits appear natural. Maintain original composition and proportions; avoid altering facial structure. The final result should show the original space enhanced with Christmas decorations rather than completely transformed.

- Eyes: The eyes must remain EXACTLY identical to the original photo.

${prompt ? `Additional user prompt: ${prompt}` : ""}
`;
}
