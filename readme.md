[<img src="https://s3-us-west-2.amazonaws.com/arc.codes/architect-logo-500b@2x.png" width=500>](https://www.npmjs.com/package/@architect/architect)

## [`https://arc.codes`](https://arc.codes)

> Docs site for the Architect serverless framework!

[![GitHub CI status](https://github.com/architect/arc.codes/workflows/Node%20CI/badge.svg)](https://github.com/architect/arc.codes/actions?query=workflow%3A%22Node+CI%22)

## Docs Development

> ℹ️ We're actively improving Architect documentation, this repository, and this readme

This docs site is its own Architect project 🎉 so it can be run locally with `arc sandbox`

Use `npm run seed-dependencies` to move Shiki/dist (+ select languages) and the Arc syntax highlighting grammar to the docs catchall function. This drastically reduces that function's size on disk.

## Table of Contents & Sidebar

The Sidebar is dynamically built from `table-of-contents.js` and the current state.

The Table of Contents (TOC) is a simple set of objects containing arrays of strings that correspond with Markdown documents.

> ⚠️ The fourth level of items will be grouped into a (closed by default) collapsible group. Use sparingly!

## Markdown & Frontmatter

All docs are written in Markdown.

The renderer combines [markdown-it](https://www.npmjs.com/package/markdown-it) and [frontmatter](https://www.npmjs.com/package/markdown-it-front-matter) to create HTML views.

The frontmatter attributes are technically optional but highly encouraged as they aid the site's SEO.

| attribute       | type       | effect                |
|-----------------|------------|-----------------------|
| **title**       | `string`   | HTML title            |
| **category**    | `string`   | HTML title prefix     |
| **description** | `string`   | HTML meta description |
| **sections**    | `string[]` | currently unused      |

## Todo

* dynamic category landing page
* writing style guide
* a homepage
* dark mode

## Contributing
[Find out more about contributing to Architect](https://arc.codes/docs/en/about/contribute)
