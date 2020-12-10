// rename files from advent-of-code
const fs = require('fs');
const files = fs.readdirSync(process.env.PWD);

files
  .filter((file) => /^day-\d+\.js$/.test(file))
  .forEach((file) => {
    const newFile = file.replace(/(\d+)/, (match) => match.padStart(2, '0'));
    console.log(`renaming ${file} as ${newFile}`);
    fs.rename(file, newFile, (err) => {
      err && console.log(err);
    });
  });
