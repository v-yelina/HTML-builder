const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

let source = path.join(__dirname, "files/");
let destination = path.join(__dirname, "files-copy/");

const errorHandler = (err) => {
  console.log(err.message);
  return;
};

const copyFile = () => {
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) errorHandler(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.join(source, file.name),
            path.join(destination, file.name),
            (err) => {
              if (err) errorHandler(err);
            }
          );
        }
      });
    }
  });
};

fs.rm(destination, { recursive: true, force: true }, (err) => {
  if (err) errorHandler(err);

  fsPromises.mkdir(destination, { recursive: true }).catch((err) => {
    errorHandler(err);
  });
  copyFile();
});
