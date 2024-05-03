import { renderHelloWorld, renderArcCodes, renderKitchenSink } from '../support/render-examples.mjs'

const { cloudFormation: helloWorldCf, arc: helloWorldArc } = await renderHelloWorld()
const { cloudFormation: arcCodesCf, arc: arcCodesArc } = await renderArcCodes()
const { cloudFormation: kitchenSinkCf, arc: kitchenSinkArc } = await renderKitchenSink()

export default function CloudFormation ({ html }) {
  return html`
    <style>
      label {
        background-color: white;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px hsla(0deg 0% 0% / 0.125);
        cursor: pointer;
      }

      form:has([value="hello-world"]:checked) ~ #hello-world,
      form:has([value="arc-codes"]:checked) ~ #arc-codes,
      form:has([value="kitchen-sink"]:checked) ~ #kitchen-sink {
        display: grid;
      }

      pre {
        overflow: scroll;
        max-block-size: 66dvh;
      }

      pre::-webkit-scrollbar {
        inline-size: 8px;
        block-size: 8px;
      }

      pre::-webkit-scrollbar-track {
        background-color: transparent;
      }

      pre::-webkit-scrollbar-thumb {
        background-color: var(--gray-300);
        border-radius: 8px;
      }

      pre::-webkit-scrollbar-corner {
        background-color: transparent;
      }

    </style>

    <arc-container class="pbe4">
      <h2 class="text5 font-medium leading1 tracking-2 mbs6 mbe4">
        IaC: <span class="font-bold">NP!</span>
      </h2>

      <p class="measure mbe0">
        Infrastructure as Code (IaC) can be intimidating for even the most experienced developers. Architect’s manifest file — which can be written in multiple open text formats — codifies cloud infrastructure provisioning as a minimal build artefact, turning formerly complex work into approachable, maintainable code.
      </p>

      <p class="measure mbe4">
        See the difference for yourself by exploring the examples of Architect project manifests and the CloudFormation configurations they generate below. Or <a class="underline font-semibold" href="https://arc.codes/playground">try the interactive Architect playground</a>.
      </p>

      
      <form class="flex gap0 text-1 font-semibold mbe2">
        <label class="inline-flex align-items-center gap-4 pi0 pb-4">
          <input type="radio" name="demo" value="hello-world" checked />
          Hello world
        </label>

        <label class="inline-flex align-items-center gap-4 pi0 pb-4">
          <input type="radio" name="demo" value="arc-codes" />
          Arc.codes
        </label>

        <label class="inline-flex align-items-center gap-4 pi0 pb-4">
          <input type="radio" name="demo" value="kitchen-sink" />
          Kitchen sink
        </label>
      </form>

      <article id="hello-world" class="hidden col-1 col-2-lg gap0 align-items-start">
        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">Architect manifest</h3>
          ${helloWorldArc}
        </div>

        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">CloudFormation</h3>
          ${helloWorldCf}
        </div>
      </article>

      <article id="arc-codes" class="hidden col-1 col-2-lg gap0 align-items-start">
        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">Architect manifest</h3>
          ${arcCodesArc}
        </div>

        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">CloudFormation</h3>
          ${arcCodesCf}
        </div>
      </article>

      <article id="kitchen-sink" class="hidden col-1 col-2-lg gap0 align-items-start">
        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">Architect manifest</h3>
          ${kitchenSinkArc}
        </div>

        <div>
          <h3 class="text1 tracking-1 font-medium mbe-4">CloudFormation</h3>
          ${kitchenSinkCf}
        </div>
      </article>

    </arc-container >
  `
}
