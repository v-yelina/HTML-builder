const fs = require("fs");
const readline = require("readline");

const writable = fs.createWriteStream(`${__dirname}/text.txt`);

console.log("Write your text here:");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.prompt();

rl.on("line", (line) => {
  switch (line.trim()) {
    case "exit":
      rl.close();
      break;
    default:
      sentence = line + "\n";
      writable.write(sentence);
      rl.prompt();
      break;
  }
}).on("close", () => {
  writable.end();
  writable.on("finish", () => {
    console.log(`Thank you, you can find your input in ${__dirname}/text.txt`);
  });
});
