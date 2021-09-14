const slugify = require('@architect/views/modules/helpers/slugify').default

module.exports = function createGroupIndex (pathParts, toc) {
  const mainSlug = pathParts.shift()
  const tocSlugsMap = Object.fromEntries(Object.keys(toc).map(t => [ slugify(t), t ]))
  const mainTitle = tocSlugsMap[mainSlug]
  const mainGroup = toc[mainTitle]
  let groupTitle
  let groupPages

  if (mainGroup) {
    pathParts.forEach((slug) => {
      let groupSlugs = {} // maintain slug lookup
      // ! this smells:
      const subGroup = (groupPages ? groupPages : mainGroup).find((group) => {
        groupSlugs = {} // reset lookup
        Object.keys(group).forEach(g => groupSlugs[slugify(g)] = g)
        return group[groupSlugs[slug]]
      })

      groupTitle = groupSlugs[slug]
      groupPages = subGroup[groupTitle]
    })
  }

  // ? TODO: create `children` from category "index.md" content if it exists

  if (groupPages) {
    return {
      title: groupTitle,
      category: mainTitle,
      groupPages
    }
  }
  else {
    return null
  }
}
