const emojis = {
  "👀": ["eyes"],
};

const emojiLookup = new Map<string, string>();

Object.entries(emojis).forEach(([emoji, aliases]) => {
  aliases.forEach((alias) => {
    emojiLookup.set(alias, emoji);
  });
});

export function getEmoji(text: string): string | undefined {
  if (text.startsWith(":") && text.endsWith(":")) {
    return emojiLookup.get(text.substr(1, text.length - 2));
  }
}
