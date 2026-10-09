export default function Footer ({ html }) {
  return html`
    <style>
      hr {
        border-block-start: 1px solid var(--gray-200);
      }
    </style>
    <arc-container class="mbs6 mbe7">
      <hr class="mb6" />
      <arc-logo class="block"></arc-logo>
      <h2 class="font-medium text3 text4-lg leading1 tracking-2 mbs5 mbe6">
        Ditch the complexity and vendor cruft. <span>Get started with Architect today.</span>
      </h2>

      <arc-link-button>
        Read the quick start
      </arc-link-button>
    </arc-container>
  `
}
