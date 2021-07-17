/**
 * converts iTunes library to json and logs to console
 * e.g. node ./itunes-library-to-json.js ./Library.xml
 */

const parser = require('fast-xml-parser');
const fs = require('fs');

const tag = {
  'Track ID': 'integer',
  Name: 'string',
  Artist: 'string',
  Album: 'string',
  Genre: 'string',
  Kind: 'string',
  Size: 'integer',
  'Total Time': 'integer',
  'Disc Number': 'integer',
  'Disc Count': 'integer',
  'Track Number': 'integer',
  'Track Count': 'integer',
  Year: 'integer',
  'Date Modified': 'date',
  'Date Added': 'date',
  'Bit Rate': 'integer',
  'Sample Rate': 'integer',
  'Play Count': 'integer',
  'Play Date': 'integer',
  'Play Date UTC': 'date',
  Normalization: 'integer',
  'Sort Album': 'string',
  'Persistent ID': 'string',
  'Track Type': 'string',
  Location: 'string',
  'File Folder Count': 'integer',
  'Library Folder Count': 'integer',
  BPM: 'integer',
  'Album Rating': 'integer',
  'Album Rating Computed': 'true',
  'Sort Name': 'string',
  'Skip Count': 'integer',
  'Skip Date': 'date',
  Rating: 'integer',
  'Album Artist': 'string',
  Comments: 'string',
  'Sort Artist': 'string',
  Composer: 'string',
  Grouping: 'string',
  'Sort Composer': 'string',
  Compilation: 'true',
  'Sort Album Artist': 'string',
  'Rating Computed': 'true',
  'Release Date': 'date',
  Purchased: 'true',
  Work: 'string',
  'File Type': 'integer',
  Matched: 'true',
  Explicit: 'true',
  'Part Of Gapless Album': 'true',
  'Volume Adjustment': 'integer',
  'Artwork Count': 'integer',
  'Movement Number': 'integer',
  'Movement Count': 'integer',
  'Movement Name': 'string',
};

const library = fs.readFileSync(process.argv[2], 'utf-8');

const parsedLibrary = parser.parse(library, { arrayMode: 'strict' });

function dictToSong(song) {
  const { key, ...rest } = song;
  return key.reduce((acc, k) => {
    acc[k] = rest[tag[k]].shift();
    return acc;
  }, {});
}

const songs = parsedLibrary.plist[0].dict[0].dict[0].dict.map(dictToSong);

console.log(JSON.stringify(songs));
