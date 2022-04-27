// related docsearch config
// https://github.com/algolia/docsearch-configs/blob/master/configs/arc.json

export default function Algolia (lang) {
  return `
<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2.6.3/dist/cdn/docsearch.min.js"></script>
<script>
var docsearchParams = {
  // Your apiKey and indexName will be given to you once
  // we create your config
  apiKey: 'c2b501f7cd2832f5138d0a9e98f12356',
  indexName: 'arc',
  // appId: 'BH4D9OD16A', // Should be only included if you are running DocSearch on your own.
  // Replace inputSelector with a CSS selector
  // matching your search input
  inputSelector: '#docsearch',
  // Set debug to true to inspect the dropdown
  debug: false,
  // algoliaOptions: { 'facetFilters': ['lang:${lang}'] }
}

docsearch(docsearchParams);
</script>
`
}
