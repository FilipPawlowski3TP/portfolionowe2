// Polish typography helpers — non-breaking spaces after single-letter
// prepositions/conjunctions, before currency and units, proper quotes.
// Applied at render time to content from src/data/site.ts (via <T>).

const SINGLE_LETTER = /([^\p{L}\p{N}]|^)([iouzaIOUZA])\s+/gu;
const BEFORE_CURRENCY = /\s(zł|PLN)(?![\p{L}\p{N}])/gu;

/** Normalize Polish typography in plain text. */
export function typo(text: string): string {
  return text
    .replace(SINGLE_LETTER, (_m, prefix: string, word: string) => `${prefix}${word}\u00A0`)
    .replace(BEFORE_CURRENCY, (_m, unit: string) => `\u00A0${unit}`);
}
