// eslint-disable-next-line import/no-unresolved
import { LinkChecker } from 'linkinator'
import test from 'tape'
import sandbox from '@architect/sandbox'

import { currentRoot }  from '../src/shared/redirect-map.mjs'

const host = 'http://localhost:3333'
const root = `${host}${currentRoot}`

test('find broken links', async (t) => {
  await sandbox.start({ quiet: true })
  t.pass(`sandbox started at ${host}`)

  const checker = new LinkChecker()

  checker.on('link', result => {
    if (result.state === 'BROKEN')
      console.log(`${result.status} ${result.url} from ${result.parent}`)
  })

  const result = await checker.check({
    concurrency: 5, // default of 100 causes functions to exceed 5s timeout
    path: root,
    recurse: true,
    linksToSkip: [
      'https://arc.codes/_static/arc.codes.png', // final asset is fingerprinted
      'https://www.godaddy.com', // GoDaddy 403s crawlers
      'https://github.com/architect/arc.codes/edit/', // skip all the "Edit on GitHub" links
      'https://twitter.com/arcdotcodes', // lolnothingmatters
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
