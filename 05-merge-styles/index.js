const fs = require("fs");
const path = require("path");

const styleFolder = path.join(__dirname, "styles/");

const writable = fs.createWriteStream(
  path.join(__dirname, "project-dist/bundle.css")
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
