export function splitWordsToMasks(text) {
  return text.split(/(\s+)/).map((w, i) => ({ word: w, key: i }));
}
