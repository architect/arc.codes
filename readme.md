![Architect logo](https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-light-500b%402x.png#gh-dark-mode-only)
![Architect logo](https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-500b%402x.png#gh-light-mode-only)

## [`https://arc.codes`](https://arc.codes)

> Docs site for the OpenJS Architect framework!

[![GitHub CI status](https://github.com/architect/arc.codes/workflows/Node%20CI/badge.svg)](https://github.com/architect/arc.codes/actions?query=workflow%3A%22Node+CI%22)

## Docs Development

> ℹ️ We're actively improving Architect documentation, this repository, and this readme

This docs site is its own Architect project 🎉 so it can be run locally with `npx arc sandbox`

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
* ~~dark mode~~

## Contributing
[Find out more about contributing to Architect](https://arc.codes/docs/en/about/contribute)
