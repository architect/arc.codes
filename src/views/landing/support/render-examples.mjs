import { Arcdown } from 'arcdown'

import { cloudformation as helloWorldCf, arc as helloWorldArc } from './hello-world.mjs'
import { cloudformation as arcCodesCf, arc as arcCodesArc } from './arc-codes.mjs'
import { cloudformation as kitchenSinkCf, arc as kitchenSinkArc } from './kitchen-sink.mjs'

const hljs = {
  classString: 'hljs text-1 p-2'
}

const arcdown = new Arcdown({ hljs })

const helloWorldCfMd = '```json\n' + JSON.stringify(helloWorldCf, null, 2) + '\n```'
const helloWorldArcMd = '```arc\n' + helloWorldArc + '\n```'

const getLoc = str => str.split('\n').filter(l => l !== '').length

export async function renderHelloWorld () {
  const a = await arcdown.render(helloWorldArcMd)
  const cf = await arcdown.render(helloWorldCfMd)
  const { html: arc } = a
  const { html: cloudFormation } = cf
  const arcLoc = getLoc(helloWorldArc)
  const cfLoc = getLoc(JSON.stringify(helloWorldCf, null, 2))
  return { arc, arcLoc, cloudFormation, cfLoc }
}

const arcCodesCfMd = '```json\n' + JSON.stringify(arcCodesCf, null, 2) + '\n```'
const arcCodesArcMd = '```arc\n' + arcCodesArc + '\n```'

export async function renderArcCodes () {
  const a = await arcdown.render(arcCodesArcMd)
  const cf = await arcdown.render(arcCodesCfMd)
  const { html: arc } = a
  const { html: cloudFormation } = cf
  const arcLoc = getLoc(arcCodesArc)
  const cfLoc = getLoc(JSON.stringify(arcCodesCf, null, 2))
  return { arc, arcLoc, cloudFormation, cfLoc }
}

const kitchenSinkCfMd = '```json\n' + JSON.stringify(kitchenSinkCf, null, 2) + '\n```'
const kitchenSinkArcMd = '```arc\n' + kitchenSinkArc + '\n```'

export async function renderKitchenSink () {
  const a = await arcdown.render(kitchenSinkArcMd)
  const cf = await arcdown.render(kitchenSinkCfMd)
  const { html: arc } = a
  const { html: cloudFormation } = cf
  const arcLoc = getLoc(kitchenSinkArc)
  const cfLoc = getLoc(JSON.stringify(kitchenSinkCf, null, 2))
  return { arc, arcLoc, cloudFormation, cfLoc }
}
