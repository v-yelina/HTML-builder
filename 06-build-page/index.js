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

const createHtml = () => {
  const templateHtml = path.join(__dirname, "template.html");
  const readTemplateStream = fs.createReadStream(templateHtml);
  const writableStream = fs.createWriteStream(
    path.join(__dirname, "project-dist/index.html"),
    {
      flags: "w",
    }
  );
  let template = "";

  readTemplateStream.on("data", function (chunk) {
    template += chunk;
  });

  readTemplateStream.on("end", function () {
    fs.readdir(
      path.join(__dirname, "components"),
      { withFileTypes: true },
      (err, files) => {
        if (err) errorHandler(err);
        else {
          try {
            files.forEach((file) => {
              if (file.isFile()) {
                const fileName = `${file.name.split(".")[0]}`;
                const fileExt = `${path.extname(file.name).slice(1)}`;
                if (fileExt === "html") {
                  const readable = fs.createReadStream(
                    path.join(__dirname, `components/${file.name}`)
                  );
                  let component = "";
                  readable.on("data", function (chunk) {
                    component += chunk;
                  });
                  readable.on("end", function () {
                    let startIndex = template.indexOf(fileName) - 2;
                    template =
                      template.slice(0, startIndex) +
                      component +
                      template.slice(startIndex + fileName.length + 5);
                    if (files.indexOf(file) === files.length - 1) {
                      writableStream.write(template);
                    }
                  });
                }
              }
            });
          } catch (err) {
            errorHandler(err);
          }
        }
      }
    );
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
  createHtml();
});
