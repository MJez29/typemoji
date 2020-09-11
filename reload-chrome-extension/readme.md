# Reload Chrome Extension

A very simple chrome extension that connects to the websocket located at `ws://localhost:8081` and waits for messages of the name of the chrome extension to reload. It only reloads unpacked (development) extensions. It reloads an extension by basically turning it off and on again or more specifically disabling and then re-enabling it.

In it's current state the websocket server must be running before `reload.js` runs. Which means that you probabling have to reload or turn this extension back on at the start of each development session.
