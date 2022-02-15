let { updater } = require('@architect/utils')
let { spawn } = require('child_process')
let pkg = require('../../package.json')
let cmd = pkg.scripts.spellcheck.split(' ')
let update = updater('Spelling')

module.exports = {
  sandbox: {
    watcher: async ({ filename }) => {
      if (!filename.endsWith('.md')) return
      return new Promise((res) => {
        update.start('Checking spelling')
        let start = Date.now()
        let done = () => update.done(`Checked spelling in ${(Date.now() - start) / 1000} seconds`)
        let spell = spawn(cmd[0], cmd.slice(1))
        let found = false
        let log = data => {
          if (!found) {
            done()
            update.warn(`Found spelling or grammar error(s):`)
          }
          found = true
          console.log(data.toString())
        }
        spell.stdout.on('data', log)
        spell.stderr.on('data', log)
        spell.on('close', code => {
          if (!code) {
            done()
            update.done('No spelling or grammar errors found!')
          }
          // Always resolve, errors should have been printed already
          res()
        })
      })
    }
  }
}
