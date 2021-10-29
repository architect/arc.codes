const { stat } = require('fs/promises')
const path = require('path')
const test = require('tape')
const { redirect, tempRedirects, permanentRedirects } = require('../../src/shared/redirect-map')

test('redirect map middleware', async t => {
  t.plan(5)

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

  const tempRedirectResponse = await redirect({
    requestContext: {
      http: {
        method: 'GET',
        path: '/',
      }
    }
  })
  const expectedTempResponse = {
    statusCode: 302,
    headers: {
      location: '/docs/en/guides/get-started/quickstart',
    },
  }
  t.deepEqual(tempRedirectResponse, expectedTempResponse, 'Correctly redirect temporary mapped path')

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
      await stat(path.join(__dirname, '../../src/views', filePath))
    }
    catch (error) {
      t.fail(error)
    }
  }

  t.pass(`Checked for ${destinations.length} files`)
})
