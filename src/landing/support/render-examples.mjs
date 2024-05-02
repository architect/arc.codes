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

export async function renderHelloWorld () {
  const cf = await arcdown.render(helloWorldCfMd)
  const a = await arcdown.render(helloWorldArcMd)
  const { html: cloudFormation } = cf
  const { html: arc } = a
  return { cloudFormation, arc }
}

const arcCodesCfMd = '```json\n' + JSON.stringify(arcCodesCf, null, 2) + '\n```'
const arcCodesArcMd = '```arc\n' + arcCodesArc + '\n```'

export async function renderArcCodes () {
  const cf = await arcdown.render(arcCodesCfMd)
  const a = await arcdown.render(arcCodesArcMd)
  const { html: cloudFormation } = cf
  const { html: arc } = a
  return { cloudFormation, arc }
}

const kitchenSinkCfMd = '```json\n' + JSON.stringify(kitchenSinkCf, null, 2) + '\n```'
const kitchenSinkArcMd = '```arc\n' + kitchenSinkArc + '\n```'

export async function renderKitchenSink () {
  const cf = await arcdown.render(kitchenSinkCfMd)
  const a = await arcdown.render(kitchenSinkArcMd)
  const { html: cloudFormation } = cf
  const { html: arc } = a
  return { cloudFormation, arc }
}
