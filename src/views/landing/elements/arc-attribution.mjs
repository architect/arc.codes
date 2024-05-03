import arc from '@architect/functions'

export default function ArcAttribution ({ html }) {
  return html`
    <style>
      img {
        inline-size: clamp(120px, 10vw, 200px);
      }
    </style>
    <arc-container>
      <figure class="pb2 grid gap4 col-1 col-2-lg align-items-center text-center text-start-lg si-100">
        <figure class="grid gap0 col-1 col-2-lg align-items-center">
          <p class="font-semibold text-1 uppercase tracking2">Open governance</p>
          <a href="https://openjsf.org/">
            <img src="${arc.static('landing/openjs-foundation-logo.svg')}" alt="OpenJS Foundation" class="mi-auto" />
          </a>
        </figure>
        <figure class="grid gap0 col-1 col-2-lg align-items-center">
          <p class="font-semibold text-1 uppercase tracking2">Sponsored development</p>
          <a href="https://begin.com">
            <img src="${arc.static('landing/begin-logo.svg')}" alt="Begin" class="mi-auto" />
          </a>
        </figure>
      </figure>
    </arc-container>
  `
}
