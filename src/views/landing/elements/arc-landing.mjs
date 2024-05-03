export default function ArcLanding ({ html }) {
  return html`
    <style scope="global">
      arc-logo {
        inline-size: clamp(120px, 25vw, 12.5em);
      }

      nav {
        background-color: var(--body);
        color: white;
      }

      nav arc-logo {
        inline-size: 128px;
      }

      @media (min-width: 48em) {
        nav ul {
          font-size: 1rem;
        }
      }

      nav ul li a {
        border: 1px solid transparent;
        border-radius: 99em;
      }

      nav ul li a.active {
        background-color: hsl(0deg 0% 40%);
      }

      nav ul li a:not(.active):hover {
        border-color: hsl(0deg 0% 80%);
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

    <nav class="sticky z1 inset-bs-0">
      <arc-container class="flex align-items-center gap2 pb-1">
        <arc-logo class="block"></arc-logo>
        <ul class="inline-flex align-items-center gap2 list-none font-medium text-1 mis-auto mis-none-lg">
          <li><a class="pi-1 pb-4 active" href="/">Home</a></li>
          <li><a class="pi-1 pb-4" href="/docs/en/get-started/quickstart">Docs</a></li>
        </ul>
      </arc-container>
    </nav>

    <arc-container class="pbs4 relative">
      <h2 class="font-medium text6 text7-lg leading0 uppercase tracking-2 mbs3 mbe5">
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
