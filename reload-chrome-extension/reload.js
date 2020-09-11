const ALARM_NAME = "Reload Chrome Extension Alarm";

function reloadExtension(id) {
  return new Promise(resolve => {
    chrome.management.setEnabled(id, false, (...args) => {
      chrome.management.setEnabled(id, true, (...args) => {
        resolve();
      });
    });
  });
}

function openPage(id, pageToOpen) {
  return new Promise(resolve => {
    chrome.tabs.create(
      {
        url: `chrome-extension://${id}/${pageToOpen}`
      },
      (...args) => {
        resolve();
      }
    );
  });
}

function createAlarm(now = false) {
  chrome.alarms.create(ALARM_NAME, {
    when: Date.now() + (now ? 0 : 60 * 1000)
  });
}

function createSocket() {
  const socket = new WebSocket("ws://localhost:8081");

  socket.onopen = () => {
    console.log("Socket open");
  };

  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      const extName = data.extensionName;
      const pageToOpen = data.pageToOpen;

      chrome.management.getAll(extensions => {
        extensions.forEach(async ext => {
          if (
            ext.installType === "development" &&
            ext.type === "extension" &&
            ext.name === extName
          ) {
            await reloadExtension(ext.id);
            if (pageToOpen) {
              await openPage(ext.id, pageToOpen);
            }
          }
        });
      });
    } catch {}
  };

  socket.onerror = err => {
    console.log(err);
  };

  socket.onclose = () => {
    console.log("Socket closed");
    createAlarm();
  };
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    createSocket();
  }
});

createAlarm(true);
