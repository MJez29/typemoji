interface EmojiMessage {
  enteredText: string;
  caret: number;
}

function isValidMessage(message: unknown): message is EmojiMessage {
  if (typeof message !== "object" || !message) {
    return false;
  }

  const emojiMessage = message as EmojiMessage;

  if (typeof emojiMessage.enteredText !== "string") {
    return false;
  }

  if (
    typeof emojiMessage.caret !== "number" ||
    !Number.isInteger(emojiMessage.caret)
  ) {
    return false;
  }

  if (
    emojiMessage.caret < 0 ||
    emojiMessage.caret > emojiMessage.enteredText.length
  ) {
    return false;
  }

  return true;
}

type RemoveFirst<T extends unknown[]> = ((...b: T) => void) extends (
  a: T[0],
  ...b: infer I
) => void
  ? I
  : [];

class DebuggerSession {
  private target: chrome.debugger.Debuggee;

  constructor(tabId: number) {
    this.target = {
      tabId,
    };
  }

  public start() {
    return new Promise((resolve, reject) => {
      chrome.debugger.attach(this.target, "1.2", () => {
        if (chrome.runtime.lastError) {
          console.log("Start Error");
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  public stop() {
    return new Promise((resolve, reject) => {
      chrome.debugger.detach(this.target, () => {
        if (chrome.runtime.lastError) {
          console.log("Stop Error");
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  public sendCommand(method: string, commandParams?: Object | undefined) {
    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(
        this.target,
        method,
        commandParams,
        (result) => {
          if (chrome.runtime.lastError) {
            console.log("SendCommand Error");
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

function simulateKeyEvent(debuggerSession: DebuggerSession, key: string) {
  return debuggerSession.sendCommand("Input.dispatchKeyEvent", {
    type: "keyDown",
    windowsVirtualKeyCode: parseInt(key, 10),
  });
}

function insertTextEvent(debuggerSession: DebuggerSession, text: string) {
  return debuggerSession.sendCommand("Input.insertText", {
    text,
  });
}

async function replaceText(
  debuggerSession: DebuggerSession,
  text: string,
  caret: number,
  emoji: string
) {
  const leftDeletions = caret;
  const rightDeletions = text.length - caret;

  const deletions: Promise<unknown>[] = [];

  for (let i = 0; i < leftDeletions; i++) {
    deletions.push(simulateKeyEvent(debuggerSession, "8"));
  }

  for (let i = 0; i < rightDeletions; i++) {
    deletions.push(simulateKeyEvent(debuggerSession, "8"));
  }

  await Promise.all(deletions);

  await insertTextEvent(debuggerSession, emoji);
}

chrome.runtime.onMessage.addListener(
  async (message: unknown, sender, sendReponse) => {
    console.log("Received message: ", message);
    const tabId = sender.tab?.id;
    if (isValidMessage(message) && typeof tabId === "number") {
      const debuggerSession = new DebuggerSession(tabId);
      debuggerSession.start();
      await replaceText(
        debuggerSession,
        message.enteredText,
        message.caret,
        "👀"
      );
      debuggerSession.stop();
    }
  }
);
