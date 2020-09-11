const beforeCaretRegex = /:[\w-]+:?$/;

export function getSurroundingEmojiText(str: string, pos: number) {
  const substr = str.substr(0, pos);

  const matches = substr.match(beforeCaretRegex);

  if (!matches || matches.length === 0) {
    return "";
  }

  return matches[0];
}
