const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "secret-folder");

fs.readdir(targetDir, { withFileTypes: true }, (err, files) => {
  console.log(`\nFiles in ${targetDir}:`);
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(targetDir, file.name);
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
});
