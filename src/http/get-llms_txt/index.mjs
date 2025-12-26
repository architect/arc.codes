import toc from '../../views/docs/table-of-contents.mjs'

const BASE_URL = 'https://arc.codes'

/**
 * Generates a URL for a documentation page
 * @param {string[]} pathParts - Path segments
 * @returns {string} Full URL
 */
function docUrl (pathParts) {
  const slug = pathParts
    .map(part => part.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    .join('/')
  return `${BASE_URL}/docs/en/${slug}`
}

/**
 * Recursively generates markdown links from the table of contents structure
 * @param {Array} items - TOC items (strings or objects)
 * @param {string[]} parentPath - Parent path segments
 * @param {number} depth - Current nesting depth
 * @returns {string} Markdown formatted links
 */
function generateLinks (items, parentPath = [], depth = 0) {
  const indent = '  '.repeat(depth)
  const lines = []

  for (const item of items) {
    if (typeof item === 'string') {
      // Simple string item - it's a doc page
      const path = [ ...parentPath, item ]
      lines.push(`${indent}- [${item}](${docUrl(path)})`)
    }
    else if (typeof item === 'object' && !Array.isArray(item)) {
      // Object with nested structure
      for (const [ key, value ] of Object.entries(item)) {
        if (Array.isArray(value)) {
          // Category with sub-items
          lines.push(`${indent}- ${key}`)
          lines.push(generateLinks(value, [ ...parentPath, key ], depth + 1))
        }
      }
    }
  }

  return lines.join('\n')
}

export async function handler () {
  const sections = []

  sections.push('# Architect (arc.codes)')
  sections.push('')
  sections.push('> Architect is a simple framework for building and delivering powerful Functional Web Apps (FWAs) on AWS')
  sections.push('')
  sections.push('## Documentation')
  sections.push('')

  for (const [ sectionName, items ] of Object.entries(toc)) {
    sections.push(`### ${sectionName}`)
    sections.push('')
    sections.push(generateLinks(items, [ sectionName ]))
    sections.push('')
  }

  // Add quick links section
  sections.push('## Quick Links')
  sections.push('')
  sections.push(`- [GitHub Repository](https://github.com/architect/architect)`)
  sections.push(`- [Full Documentation for LLMs](${BASE_URL}/llms-full.txt)`)
  sections.push(`- [Discord Community](https://discord.gg/y5A2eTsCRX)`)
  sections.push('')

  const content = sections.join('\n')

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
    body: content,
  }
}
