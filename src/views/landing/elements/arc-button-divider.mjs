export default function ArcButtonDivider ({ html }) {
  return html`
    <style>
      div:after {
        content: "";
        display: block;
        border-block-start: 1px solid var(--gray-200);
        translate: 0 -1.2em;
        position: relative;
        z-index: -1;
      }
    </style>
    <div class="mb6 text-center">
      <arc-link-button>
        <slot></slot>
      </arc-link-button>
    </div>
  `
}
