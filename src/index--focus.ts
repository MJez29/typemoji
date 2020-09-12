import { getSurroundingEmojiText } from "@src/emoji-detection";
import { getEmoji } from "./emojis";

function onHtmlInputChanged(event: Event) {
  if (!(event instanceof InputEvent)) {
    return;
  }

  const target = event.target;

  if (
    !target ||
    !(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) ||
    target.selectionStart !== target.selectionEnd
  ) {
    return;
  }

  const caret = target.selectionStart;

  if (typeof caret !== "number") {
    return;
  }

  const surroundingEmojiText = getSurroundingEmojiText(target.value, caret);
  const emoji = getEmoji(surroundingEmojiText);

  console.log(surroundingEmojiText, emoji);

  if (emoji) {
    target.value = target.value.replace(surroundingEmojiText, emoji);
  }
}

window.addEventListener("focusin", (focusEvent) => {
  const target = focusEvent.target;
  if (target instanceof HTMLInputElement) {
    target.addEventListener("input", onHtmlInputChanged);
  }
});

window.addEventListener("focusout", (focusEvent) => {
  const target = focusEvent.target;
  if (target instanceof HTMLInputElement) {
    target.removeEventListener("input", onHtmlInputChanged);
  }
});
