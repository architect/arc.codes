export default function ArcLinkButton ({ html }) {
  return html`
    <style>
      .linkButton {
        background: var(--blue-600);
        border-radius: 0.5em;
        box-shadow: 0 0 0 4px var(--back);
        color: white;
        transition: background-color 0.15s linear;
      }

      .linkButton:hover,
      .linkButton:focus {
        background: var(--blue-500);
      }

      .linkButton:focus {
        outline-offset: 4px;
      }
    </style>
    <a
      class="pi1 pb-4 inline-block font-semibold linkButton"
      href="/docs/en/get-started/quickstart"
    >
      <slot></slot>
      <svg class="inline-block mis-4" width="0.75em" height="0.75em" viewBox="0 0 24 24" stroke-width="3" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        </path>
      </svg>
    </a>
  `
}
