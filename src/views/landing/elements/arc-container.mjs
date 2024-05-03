export default function ArcContainer ({ html }) {
  return html`
    <style>
      :host {
        display: block;
        inline-size: min(100vw, 72em);
        padding-inline: var(--space-0);
        margin-inline: auto;
      }

      @media (min-width: 48em) {
        :host {
          padding-inline: var(--space-4);
        }
      }
    </style>
    <slot></slot>
  `
}
