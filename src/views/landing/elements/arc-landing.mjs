export default function ArcLanding ({ html }) {
  return html`
    <style scope="global">
      arc-logo {
        inline-size: clamp(120px, 25vw, 12.5em);
      }

      nav {
        background-color: var(--fore);
        color: white;
      }

      @media (prefers-color-scheme: dark) {
        nav {
          background-color: #1e1d1a;
        }
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

      @media (prefers-color-scheme: dark) {
        h2 span,
        h3 span {
          color: var(--bright-blue);
        }
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

      @media (prefers-color-scheme: dark) {
        arc-graphic {
          opacity: 0.05;
        }
      }

      nav a svg {
        block-size: 1em;
        inline-size: auto;
      }
    </style>

    <nav class="sticky z1 inset-bs-0">
      <arc-container class="flex align-items-center gap2 pb-1">
        <arc-logo class="block"></arc-logo>
        <ul class="inline-flex align-items-center gap2 list-none font-medium text-1 mis-auto mis-none-lg">
          <li><a class="pi-1 pb-4 active" href="/">Home</a></li>
          <li><a class="pi-1 pb-4" href="/docs/en/get-started/quickstart">Docs</a></li>
        </ul>
        <ul class="hidden inline-flex-lg align-items-center-lg gap0-lg list-none mis-auto-lg">
          <a href="https://discord.gg/y5A2eTsCRX" title="Discord">
            <svg viewBox="0 0 71 55" fill="currentColor"><g clip-path="url(#clip0)"><path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/></g><defs><clipPath id="clip0"><rect width="71" height="55" fill="currentColor"/></clipPath></defs></svg>
          </a>
          <a href="https://github.com/architect/architect" title="GitHub">
            <svg viewBox="0 0 32 32" fill="currentColor"><path fill-rule="evenodd" d="M15.999 0C7.164 0 0 7.345 0 16.405c0 7.248 4.584 13.397 10.942 15.566.8.151 1.092-.356 1.092-.79 0-.39-.013-1.422-.021-2.79-4.45.99-5.39-2.2-5.39-2.2-.728-1.895-1.777-2.4-1.777-2.4-1.452-1.017.11-.997.11-.997 1.606.116 2.451 1.691 2.451 1.691 1.427 2.507 3.745 1.783 4.657 1.363.145-1.06.559-1.783 1.015-2.193-3.552-.413-7.288-1.821-7.288-8.108 0-1.79.624-3.256 1.647-4.402-.165-.415-.714-2.083.158-4.341 0 0 1.342-.441 4.399 1.682A14.97 14.97 0 0116 7.933c1.36.007 2.728.188 4.006.553 3.055-2.123 4.395-1.682 4.395-1.682.874 2.258.325 3.926.16 4.341 1.026 1.146 1.645 2.612 1.645 4.402 0 6.303-3.741 7.69-7.305 8.095.574.507 1.085 1.508 1.085 3.039 0 2.192-.02 3.962-.02 4.5 0 .438.29.949 1.1.789C27.42 29.796 32 23.65 32 16.405 32 7.345 24.836 0 15.999 0"></path></svg>
          </a>
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
