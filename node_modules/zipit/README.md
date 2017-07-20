# zipit

[![Current Version](https://img.shields.io/npm/v/zipit.svg)](https://www.npmjs.org/package/zipit)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/zipit.svg?branch=master)](https://travis-ci.org/continuationlabs/zipit)
![Dependencies](http://img.shields.io/david/continuationlabs/zipit.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

`zipit` allows you to easily create zip archives from any combination of strings, `Buffer`s, files, directories, and other input types.

## Example

The following example creates a zip archive from a file, a directory, a Node.js `Buffer`, and a string.

```javascript
const Zipit = require('zipit');

Zipit({
  input: [
    './some_file.js',                                              // File
    './some_directory',                                            // Directory
    { name: 'some_buffer.buf', data: Buffer.from('foo-bar-baz') }, // Buffer
    { name: 'some_string.txt', data: 'blah-blah-blah' }            // String
  ],
  cwd: process.cwd()
}, (err, buffer) => {
  if (err) {
    console.error(err);
    return;
  }

  // Handle buffer, which is an instance of Buffer
});
```

## API

`zipit` exports a single function used to create zip archives.

  - Arguments
    - `options` (object) - An object that configures the creation of the zip archive. The following schema is supported.
      - `input` (string, object, or array) - If this is a string, it represents the path to a file or directory to include in the zip archive. If this is an object, it should have `name` and `data` properties which are used as the file name and contents in the zip archive. If this is an array, it should contain a combination of strings and objects as previously described.
      - `cwd` (string) - Specifies the working directory for relative file system operations. Defaults to `process.cwd()`.
    - `callback` (function) - A function which is called after the zip archive is created, or an error occurs. This function takes the following arguments.
      - `err` (error) - Represents any error that occurs.
      - `buffer` (`Buffer`) - Contains the zip archive, represented as a Node.js `Buffer`.
  - Returns
    - Nothing
