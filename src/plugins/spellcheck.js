/* eslint-disable import/no-commonjs */
const { updater } = require('@architect/utils')
const { spawn } = require('child_process')
const pkg = require('../../package.json')
const cmd = pkg.scripts.spellcheck.split(' ')
const update = updater('Spelling')

module.exports = {
  sandbox: {
    watcher: async ({ filename }) => {
      if (!filename.endsWith('.md')) return
      return new Promise((res) => {
        update.start('Checking spelling')
        const start = Date.now()
        const done = () => update.done(`Checked spelling in ${(Date.now() - start) / 1000} seconds`)
        const spell = spawn(cmd[0], cmd.slice(1))
        let found = false
        const log = data => {
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
