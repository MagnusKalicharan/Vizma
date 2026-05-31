const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const html = fs.readFileSync("d:/math/kinematics/index.html", "utf8");
const dom = new JSDOM(html, {
  url: "file:///d:/math/kinematics/index.html",
  runScripts: "dangerously",
  resources: "usable"
});

dom.window.console.error = function(...args) {
  console.log("JSDOM ERROR:", ...args);
};

dom.window.addEventListener("error", (event) => {
  console.log("JSDOM UNCAUGHT ERROR:", event.error);
});

setTimeout(() => {
  console.log("JSDOM Wait complete");
}, 2000);
