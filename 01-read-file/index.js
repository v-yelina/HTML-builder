const fs = require("fs");

const readable = fs.createReadStream(`${__dirname}/text.txt`);

readable.on("error", (error) => {
  console.log(
    `An error occured while reading the file. Error: ${error.message}`
  );
});

readable.pipe(process.stdout);
