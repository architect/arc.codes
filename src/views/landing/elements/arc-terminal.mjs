export default function ArcTerminal ({ html }) {
  return html`
    <style>
      figure {
        background-color: white;
        border-radius: 0.5em;
        border: 1px solid #ccc;
        box-shadow: 0 4px 12px hsla(0deg 0% 0% / 0.125);
        font-family: Source Code Pro, IBM Plex Mono, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      }

      .process {
        border-block-end: 1px solid #ccc;
        color: var(--gray-600);
        padding: 0.5em 1em;
      }

      .dot:first-of-type { color: salmon; }
      .dot:nth-of-type(2) { color: goldenrod; }
      .dot:nth-of-type(3) { color: mediumseagreen; }

      [slot="command"] {
        font-weight: 500;
        color: var(--blue-500);
      }

      [slot="output"] {
        color: var(--gray-600);
      }

      @media (prefers-color-scheme: dark) {
        figure {
          background: #222;
          border-color: #444;
        }

        .process {
          color: var(--gray-400);
          border-color: #444;
        }

        [slot="command"] {
          color: var(--bright-blue);
        }

        [slot="output"] {
          color: var(--gray-400);
        }
      }

    </style>
    <figure class="text-1 inline-block si-100">
      <div class="process">
        <span class="dot">⏺</span>
        <span class="dot">⏺</span>
        <span class="dot">⏺</span>
        <span class="pis-2">Node</span>
      </div>

      <div class="p0">
        <p class="prompt">
          &gt; <slot name="command"></slot>
        </p>

        <slot name="output"></slot>
      </div>
    </figure>
  `
}
