const fs = require("fs");
const path = require("path");

fs.readdir(
  `${__dirname}/secret-folder`,
  { withFileTypes: true },
  (err, files) => {
    console.log("\nCurrent directory files:");
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = `${__dirname}/secret-folder/${file.name}`;
          const fileName = `${file.name.split(".")[0]}`;
          const fileExt = `${path.extname(file.name).slice(1)}`;
          fs.stat(filePath, (err, stats) => {
            console.log(
              `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(2)}kB`
            );
          });
        }
      });
    }
  }
);
