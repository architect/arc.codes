import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import arc from '@architect/functions'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'https://arc.codes'

// Configuration
const config = {
  // Files or directories to skip
  excludes: [ '.DS_Store', 'node_modules', 'table-of-contents.mjs' ],
}

/**
 * Cleans markdown content for LLM consumption
 * @param {string} content - Raw markdown content
 * @returns {string} Cleaned content
 */
function cleanMarkdownContent (content) {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n*/m, '')
    // Remove custom HTML components but keep content
    .replace(/<arc-viewer[^>]*>/g, '')
    .replace(/<\/arc-viewer>/g, '')
    .replace(/<arc-tab[^>]*label="([^"]*)"[^>]*>/g, '**$1:**\n')
    .replace(/<\/arc-tab>/g, '')
    .replace(/<div[^>]*slot[^>]*>/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<h5>/g, '')
    .replace(/<\/h5>/g, '')
    // Remove multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Extracts frontmatter from markdown content
 * @param {string} content - Raw markdown content
 * @returns {Object} Frontmatter data
 */
function extractFrontmatter (content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}

  const frontmatter = {}
  const lines = frontmatterMatch[1].split('\n')
  for (const line of lines) {
    const [ key, ...valueParts ] = line.split(':')
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim()
    }
  }
  return frontmatter
}

/**
 * Generates a URL from a relative file path
 * @param {string} relativePath - Relative path to the markdown file
 * @returns {string} Full URL
 */
function filePathToUrl (relativePath) {
  const urlPath = relativePath
    .replace(/\.md$/, '')
    .replace(/:/g, '') // Remove colons from path (e.g., :tutorials)
  return `${BASE_URL}/docs/en/${urlPath}`
}

/**
 * Processes a markdown file and extracts its content
 * @param {string} filePath - Path to the markdown file
 * @param {string} docsDir - Base docs directory
 * @returns {string} Processed content with metadata
 */
function processMarkdownFile (filePath, docsDir) {
  const content = readFileSync(filePath, 'utf-8')
  const relativePath = relative(docsDir, filePath)
  const frontmatter = extractFrontmatter(content)
  const cleanContent = cleanMarkdownContent(content)

  const metadata = [
    frontmatter.title ? `# ${frontmatter.title}` : null,
    `Source: ${filePathToUrl(relativePath)}`,
    frontmatter.description ? `Description: ${frontmatter.description}` : null,
    frontmatter.category ? `Category: ${frontmatter.category}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return `${metadata}\n\n${cleanContent}\n`
}

/**
 * Recursively processes all markdown files in a directory
 * @param {string} dir - Directory to process
 * @param {string} docsDir - Base docs directory for relative paths
 * @returns {string[]} Array of processed file contents
 */
function processDirectory (dir, docsDir) {
  const results = []

  if (!existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`)
    return results
  }

  let files
  try {
    files = readdirSync(dir, { withFileTypes: true })
  }
  catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message)
    return results
  }

  for (const file of files) {
    if (config.excludes.includes(file.name)) continue

    const fullPath = join(dir, file.name)

    if (file.isDirectory()) {
      results.push(...processDirectory(fullPath, docsDir))
    }
    else if (file.name.endsWith('.md')) {
      try {
        results.push(processMarkdownFile(fullPath, docsDir))
      }
      catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message)
      }
    }
  }

  return results
}

async function _handler () {
  // Try local dev path first (src/views), then fall back to production symlink (node_modules/@architect/views)
  let docsDir = join(__dirname, '..', '..', 'views', 'docs', 'en')

  if (!existsSync(docsDir)) {
    docsDir = join(__dirname, 'node_modules', '@architect', 'views', 'docs', 'en')
  }

  console.log('Attempting to read docs from:', docsDir)

  const header = `# Architect (arc.codes) - Complete Documentation

> This is the complete documentation for Architect, a simple framework for building and delivering powerful Functional Web Apps (FWAs) on AWS.

> For a high-level overview, see: ${BASE_URL}/llms.txt

---

`

  const content = processDirectory(docsDir, docsDir)
  const separator = '\n\n---\n\n'
  const body = header + content.join(separator)

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-store, must-revalidate',
    },
    body,
  }
}

export const handler = arc.http.async(_handler)
