export default function ArcLanding ({ html }) {
  return html`
    <style scope="global">
      arc-logo {
        display: block;
        inline-size: clamp(120px, 25vw, 12.5em);
      }

      h2 span,
      h3 span {
        color: var(--arc-blue);
      }

      .measure {
        max-inline-size: 64ch;
      }

      arc-graphic {
        inset-block-start: 50%;
        translate: 25% -50%;
        opacity: 0.33;
        inline-size: clamp(320px, 60vw, 1400px);
        z-index: -1;
        filter: blur(3px);
      }
    </style>

    <arc-container class="pbs4 relative">
      <header class="mbe4">
        <h1>
          <arc-logo></arc-logo>
          <span class="screenreader-only">Architect</span>
        </h1>
      </header>

      <h2 class="font-medium text6 text7-lg leading0 uppercase tracking-2 mbe4">
        Cloud infra<br class="hidden block-lg" /> for <span class="font-extrabold">humans</span>
      </h2>
      
      <p class="text1 measure">
        Architect gives you the power to configure, locally build, and globally deploy web apps to the cloud using concise, declarative statements. Built on rock solid AWS foundations, Architect makes advanced web development a breeze.
      </p>

      <p class="mbs4 text1">
        <arc-link-button>
          Get started
        </arc-link-button>
      </p>

      <arc-graphic class="block absolute inset-ie-0"></arc-graphic>
    </arc-container>

    <arc-attribution class="block mb5"></arc-attribution>
    <seamless-development></seamless-development>
    <why-architect></why-architect>
    <manifest-examples></manifest-examples>
    <foot-er></foot-er>
  `
}
