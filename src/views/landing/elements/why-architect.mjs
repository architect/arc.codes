export default function WhyArchitect ({ html }) {
  return html`
    <arc-container>
      <h2 class="text5 leading1 tracking-2 font-medium mbs0 mbe4">Why <span class="font-bold">Architect</span>?</h2>
      
      <p class="text1 tracking-1 measure">
        Architect provides everything you need to build massively scalable <a class="underline" href="https://fwa.dev">Functional Web Apps</a> on AWS with low code, clear and terse config, and zero ceremony.
      </p>

      <section class="grid col-1 gap4 mb5">
        <article class="grid-lg col-2 gap0">
          <h3 class="uppercase tracking1 font-bold mbe0"><span>Fullstack, for real</span></h3>
          <p class="measure">Architect not only supports cloud functions for HTTP but also web sockets, queues (FIFO), events (fan-out), and scheduled tasks backed by a world class database that boasts millisecond latency no matter how much data you store or how many people concurrently access it. All these capabilities, and more, with terse but determinstic Infra-as-Code (IaC). </p>
        </article>
        
        <article class="grid-lg col-2 gap0">
          <h3 class="uppercase tracking1 font-bold mbe0"><span>The best developer experience</span></h3>
          <p class="measure">We prioritize speed with fast local dev, smart configurable defaults and flexible Infrastructure as Code. You can focus on business logic instead of glue code — and only pay for in-use services on-demand, while otherwise scaling to zero.</p>
        </article>

        <article class="grid-lg col-2 gap0">
          <h3 class="uppercase tracking1 font-bold mbe0"><span>Intelligent, efficient iteration</span></h3>
          <p class="measure">Architect treats local development, staging, and production environments as first class concerns. Architect developers iterate fast with all of these environments and deployments only seconds away, leading to reduced latency in feedback cycles.</p>
        </article>

        <article class="grid-lg col-2 gap0">
          <h3 class="uppercase tracking1 font-bold mbe0"><span>Infrastructure as code</span></h3>
          <p class="measure">Architect turns formerly complex cloud infrastructure provisioning into a build artifact, so infra and code are always aligned and deterministic. It then compiles manifest code into AWS CloudFormation and deploys it.</p>
        </article>
      </section>

      <arc-button-divider>
        Learn more about Architect
      </arc-button-divider>
    </arc-container>
  `
}
