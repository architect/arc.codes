let { spawn } = require('child_process')
let pkg = require('../../package.json')
let cmd = pkg.scripts.spellcheck.split(' ')

module.exports = {
  sandbox: {
    watcher: async ({ filename }) => {
      if (!filename.endsWith('.md')) return
      return new Promise((res) => {
        console.log('Checking spelling...')
        let spell = spawn(cmd[0], cmd.slice(1))
        let found = false
        let log = data => {
          if (!found) console.log('\nFound spelling or grammar error(s):')
          found = true
          console.log(data.toString())
        }
        spell.stdout.on('data', log)
        spell.stderr.on('data', log)
        spell.on('close', code => {
          if (!code) console.log('No spelling or grammar errors found!')
          // Always resolve, errors should have been printed already
          res()
        })
      })
    }
  }
}
