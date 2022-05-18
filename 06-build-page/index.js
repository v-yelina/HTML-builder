const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const source = path.join(__dirname, "assets/");
const destination = path.join(__dirname, "project-dist/");
const styleFolder = path.join(__dirname, "styles/");

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

const mergeStyles = () => {
  const writable = fs.createWriteStream(
    path.join(__dirname, "project-dist/style.css")
  );

  const createReadStream = (file) => {
    return fs.createReadStream(path.join(styleFolder, file.name));
  };

  fs.readdir(styleFolder, { withFileTypes: true }, (err, files) => {
    if (err) errorHandler(err);
    else {
      files.forEach((file) => {
        if (file.isFile() && `${path.extname(file.name).slice(1)}` === "css") {
          readable = createReadStream(file);
          readable.on("data", function (chunk) {
            writable.write(chunk);
          });
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
  mergeStyles();
});
