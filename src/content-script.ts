import { getSurroundingEmojiText } from "@src/emoji-detection";
import { getEmoji } from "@src/emojis";

const emojiCharacterRegex = /^[\w-]$/;

function sendEmoji(enteredText: string, caret: number) {
  chrome.runtime.sendMessage({
    enteredText,
    caret,
  });
}

class EmojiKeystrokeManager {
  private emoji: string;

  constructor() {
    this.emoji = "";
  }

  public clearEmoji() {
    this.emoji = "";
  }

  public addCharacter(key: string) {
    console.log(emojiCharacterRegex.test(key), this.hasDeclaredEmoji());
    if (key === ":") {
      if (this.hasStartedEmoji()) {
        this.emoji += key;
        sendEmoji(this.emoji, this.emoji.length);

        this.clearEmoji();
      } else {
        this.emoji = key;
      }
    } else if (emojiCharacterRegex.test(key) && this.hasDeclaredEmoji()) {
      this.emoji += key;
    } else {
      console.log("Else clear");
      this.clearEmoji();
    }
    console.log(key, this.emoji);
  }

  private hasDeclaredEmoji() {
    return this.emoji.length >= 1;
  }

  private hasStartedEmoji() {
    return this.emoji.length >= 2;
  }
}

const emojiKeyStrokeManager = new EmojiKeystrokeManager();

window.addEventListener("keypress", (keyboardEvent) => {
  console.log(keyboardEvent.target);
  if (!keyboardEvent.ctrlKey && !keyboardEvent.altKey) {
    emojiKeyStrokeManager.addCharacter(keyboardEvent.key);
  } else {
    console.log("Special key clear");
    emojiKeyStrokeManager.clearEmoji();
  }
});

window.addEventListener("focusin", (focusEvent) => {
  emojiKeyStrokeManager.clearEmoji();
});

window.addEventListener("focusout", (focusEvent) => {
  emojiKeyStrokeManager.clearEmoji();
});
