import inventory from '@architect/inventory'
import pkg from '@architect/package'

export async function handler (req) {
  let statusCode = 200
  let body

  try {
    const rawArc = Buffer.from(req.queryStringParameters.arc, 'base64').toString()
    const inv = await inventory({ rawArc, deployStage: 'staging' })
    body = JSON.stringify(pkg(inv))
  }
  catch (e) {
    statusCode = 500
    body = JSON.stringify({
      name: e.name,
      message: e.message,
      stack: e.stack
    })
  }

  return {
    statusCode,
    body
  }
}
