let link = require('linkinator')
let test = require('tape')
let tiny = require('tiny-json-http')
let sandbox = require('@architect/sandbox')
let { currentRoot } = require('../../src/shared/redirect-map')

const host = 'http://localhost:3333'
const root = `${host}${currentRoot}`

test('check key paths and find broken links', async (t) => {
  await sandbox.start({ quiet: true })
  t.pass(`sandbox started at ${host}`)

  let quickstart = await tiny.get({ url: root })
  t.ok(quickstart.body, 'got quickstart document')

  let playground = await tiny.get({ url: `${host}/playground` })
  t.ok(playground.body, 'got static playground document')

  const checker = new link.LinkChecker()

  checker.on('link', result => {
    if (result.state === 'BROKEN')
      console.log(`${result.status} ${result.url} from ${result.parent}`)
  })

  const result = await checker.check({
    concurrency: 10, // default of 100 causes functions to exceed 5s timeout
    path: root,
    recurse: true,
    linksToSkip: [
      'https://www.godaddy.com', // GoDaddy 403s crawlers
      'https://github.com/architect/arc.codes/edit/' // skip all the "Edit on GitHub" links
    ],
  })

  const brokenCount = result.links.filter(x => x.state === 'BROKEN').length
  const okCount = result.links.filter(x => x.state === 'OK').length

  t.ok(brokenCount === 0, `${brokenCount} broken link${brokenCount > 1 || brokenCount === 0 ? 's' : ''}`)
  t.pass(`${okCount} working link${okCount > 1 || okCount === 0 ? 's' : ''}`)

  await sandbox.end()
  t.pass('sandbox ended')

  t.end()
})
