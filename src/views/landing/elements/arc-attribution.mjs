import arc from '@architect/functions'

export default function ArcAttribution ({ html }) {
  return html`
    <style>
      img {
        inline-size: clamp(120px, 10vw, 200px);
      }
    </style>
    <arc-container>
      <figure class="pb2 grid gap4 col-1 col-7-lg align-items-center text-center text-start-lg si-100">
        <figure class="col-span-3-lg flex flex-col flex-row-lg gap0 align-items-center justify-content-between-lg">
          <p class="font-semibold text-1 uppercase tracking2">Open governance</p>
          <a href="https://openjsf.org/">
            <img src="${arc.static('landing/openjs-foundation-logo.svg')}" alt="OpenJS Foundation" class="mi-auto" />
          </a>
        </figure>
        <figure class="hidden block-lg col-span-1-lg" aria-hidden="true"></figure>
        <figure class="col-span-3-lg flex flex-col flex-row-lg gap0 align-items-center-lg justify-content-between-lg">
          <p class="font-semibold text-1 uppercase tracking2">Sponsored development</p>
          <a href="https://begin.com">
            <img src="${arc.static('landing/begin-logo.svg')}" alt="Begin" class="mi-auto" />
          </a>
        </figure>
      </figure>
    </arc-container>
  `
}
