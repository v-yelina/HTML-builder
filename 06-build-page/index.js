const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

let source = path.join(__dirname, "assets/");
let destination = path.join(__dirname, "project-dist/");

const errorHandler = (err) => {
  console.log(err.message);
  return;
};

const copyFile = (source, destination) => {
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
        } else {
          fsPromises
            .mkdir(path.join(destination, file.name), { recursive: true })
            .catch((err) => {
              errorHandler(err);
            });
          copyFile(
            path.join(source, file.name),
            path.join(destination, file.name)
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
  fsPromises
    .mkdir(path.join(destination, "assets/"), { recursive: true })
    .catch((err) => {
      errorHandler(err);
    });
  copyFile(source, path.join(destination, "assets/"));
});
