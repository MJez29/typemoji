const WebSocket = require("ws");

class ReloadChromeExtensionPlugin {
  constructor(init) {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on("connection", ws => {
      this.ws = ws;
      console.log("Websocket connection!");
    });

    let m;
    if (typeof init === "string") {
      m = {
        extensionName: init
      };
    } else {
      m = {
        extensionName: init.extensionName,
        pageToOpen: init.pageToOpen
      };

      this.pageToOpen = init.pageToOpen;
    }
    this.message = JSON.stringify(m);
  }

  apply(compiler) {
    compiler.hooks.done.tap("Reload Chrome Extension Plugin", stats => {
      if (this.ws) {
        this.ws.send(this.message);
      }
    });

    if (typeof this.pageToOpen === "string") {
      compiler.hooks.emit.tap(
        "Reload Chrome Extension Plugin",
        ({ assets }) => {
          if ("manifest.json" in assets) {
            const manifest = JSON.parse(assets["manifest.json"].source());
            if (manifest["web_accessible_resources"]) {
              manifest["web_accessible_resources"].push(this.pageToOpen);
            } else {
              manifest["web_accessible_resources"] = [this.pageToOpen];
            }
            assets["manifest.json"].source = () =>
              JSON.stringify(manifest, null, 2);
          }
        }
      );
    }
  }
}

module.exports = ReloadChromeExtensionPlugin;
