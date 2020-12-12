const express = require("express");
const path = require("path");

const getTranslatedServer = (lang) => {
  const distFolder = path.join(
    process.cwd(),
    `dist/foodnet/server/${lang}`
  );
  const server = require(`${distFolder}/main.js`);
  return server.app(lang);
};

function run() {
  const port = process.env.PORT || 4200;

  // Start up the Node server
  const appRo = getTranslatedServer("ro");
  const appHu = getTranslatedServer("hu");
  const appEn = getTranslatedServer("en");

  const server = express();
  server.use("/ro", appRo);
  server.use("/hu", appHu);
  server.use("/en", appEn);
  server.use("", appRo);

  server.listen(port, () => {

  });
}

run();
