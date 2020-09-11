const path = require("path");
const archiver = require("archiver");
const fs = require("fs");

const BASE_DIR = path.join(__dirname, "..");
const BUILD_DIR = path.join(BASE_DIR, "build");
const RELEASE_DIR = path.join(BASE_DIR, "releases");

const manifest = require(path.join(BUILD_DIR, "manifest.json"))
const version = manifest.version;
const name = manifest.name.toLowerCase();

if (!fs.existsSync(RELEASE_DIR)) {
  fs.mkdirSync(RELEASE_DIR);
}

const out = fs.createWriteStream(
  path.join(RELEASE_DIR, `${name}-${version}.zip`)
);

const archive = archiver("zip", {
  zlib: 9
});

archive.on("error", err => {
  throw err;
});

archive.pipe(out);

archive.directory(BUILD_DIR, false);

archive.finalize();
