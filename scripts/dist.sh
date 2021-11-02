#!/bin/bash
echo "Copying Architect Highlight.js grammar from node_modules to get-docs-000lang-catchall/highlight..."
mkdir src/http/get-docs-000lang-catchall/highlight &> /dev/null
mkdir src/http/get-docs-000lang-catchall/highlight/languages &> /dev/null
cp node_modules/@architect/syntaxes/arc-hljs-grammar.js src/http/get-docs-000lang-catchall/highlight/languages/arc.js
echo "Done."
