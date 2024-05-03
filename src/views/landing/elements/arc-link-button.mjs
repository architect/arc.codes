export default function ArcLinkButton ({ html }) {
  return html`
    <style>
      .linkButton {
        background: var(--blue-600);
        border-radius: 0.5em;
        box-shadow: 0 0 0 4px #efefef;
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
    </a>
  `
}
