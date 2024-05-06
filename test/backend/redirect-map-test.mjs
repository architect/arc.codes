import { stat } from 'fs/promises'
import { join } from 'path'
import test from 'tape'
import { redirect, tempRedirects, permanentRedirects } from '../../src/shared/redirect-map.mjs'

test('redirect map middleware', async t => {
  t.plan(4)

  t.equal(typeof redirect, 'function', 'Redirect middleware is a function')

  const redirectResponse = await redirect({
    requestContext: {
      http: {
        method: 'GET',
        path: '/examples',
      }
    }
  })
  const expectedResponse = {
    statusCode: 301,
    headers: {
      location: '/docs/en/guides/examples',
    },
  }
  t.deepEqual(redirectResponse, expectedResponse, 'Correctly redirect permanent mapped path')

  const nonRedirectResponse = await redirect({
    requestContext: {
      http: {
        method: 'get',
        path: '/unmapped/path'
      }
    }
  })
  t.notOk(nonRedirectResponse, "Don't respond to unmapped path")

  const postResponse = await redirect({
    requestContext: {
      http: {
        method: 'POST',
        path: '/examples'
      }
    }
  })
  t.notOk(postResponse, "Don't respond to POST method")
})

test('all redirect destinations exist', async t => {
  t.plan(3)

  t.equal(typeof tempRedirects, 'object', 'tempRedirects map')
  t.equal(typeof permanentRedirects, 'object', 'permanentRedirects map')

  const destinations = [ ...Object.values(tempRedirects), ...Object.values(permanentRedirects) ]
  for (const destination of destinations) {
    const filePath = destination.split('#')[0] + '.md'
    try {
      await stat(join(new URL('.', import.meta.url).pathname, '../../src/views', filePath))
    }
    catch (error) {
      t.fail(error)
    }
  }

  t.pass(`Checked for ${destinations.length} files`)
})
