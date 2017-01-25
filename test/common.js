'use strict';

const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');

var createTestDir = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

var getFile = function (filePath) {
  return new gutil.File({
    path: path.resolve(filePath),
    cwd: './test/',
    base: path.dirname(filePath),
    contents: new Buffer(String(fs.readFileSync(filePath)))
  });
};

var fileExists = function (path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
};

var removeFile = function (path) {
  if (fileExists(path)) {
    fs.unlinkSync(path);
  }
};

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var searchReplaceStringInFile = function (filePath, stringToSearch, stringToBeReplaced) {
  let rex = new RegExp(stringToSearch, 'g');
  let file = fs.readFileSync(filePath, 'utf8').toString();
  let result = file.replace(rex, stringToBeReplaced);
  fs.writeFileSync(filePath, result);
};

module.exports = {
  createTestDir: createTestDir,
  getFile: getFile,
  fileExists: fileExists,
  removeFile: removeFile,
  deleteFolderRecursive: deleteFolderRecursive,
  searchReplaceStringInFile: searchReplaceStringInFile
};

