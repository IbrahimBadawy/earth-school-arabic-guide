export function normalizeArabic(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآ]/g, 'ا') // normalize alef
    .replace(/ة/g, 'ه') // taa marbuta to haa
    .replace(/ى/g, 'ي') // alef maqsura to yaa
    .trim();
}

export function arabicSearch(query, text) {
  if (!query || !text) return false;
  return normalizeArabic(text).includes(normalizeArabic(query));
}
