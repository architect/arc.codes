let fs = require('fs')
let path = require('path')
let parse = require('@architect/parser')

function read(filepath, callback) {
  fs.readFile(filepath, {encoding:'utf8'}, function done(err, result) {
    if (err) callback(err)
    else {
      let err
      let arc
      try {
        arc = parse(result.toString())
      }
      catch(e) {
        err = e
      }
      callback(err, arc)
    }
  })
}

/**
 * reads the .arc file
 */
module.exports = function readArc(callback) {

  let arcDefault = path.join(process.cwd(), 'node_modules', '@architect', 'shared', '.arc')
  let arcInCurrentDir = path.join(process.cwd(), '.arc')
  let arcInSharedDir = path.join(__dirname, '..', 'shared', '.arc')

  if (fs.existsSync(arcDefault)) {
    // Arc default path (used in Arc 4 as well as ARC_LOCAL)
    read(arcDefault, callback)
  }
  else if (fs.existsSync(arcInCurrentDir)) {
    // If .arc is in the cwd, use that (used in Arc 3)
    read(arcInCurrentDir, callback)
  }
  else if (fs.existsSync(arcInSharedDir)) {
    // Otherwise we are: testing, staging, or in production and loading from within node_modules
    // Eg, ./node_modules/@architect/shared/.arc
    read(arcInSharedDir, callback)
  }
  else {
    callback(ReferenceError('.arc file not found'))
  }
}
