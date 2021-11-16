#!/bin/bash
echo "Copying Architect Highlight.js files & grammars from node_modules to get-docs-000lang-catchall/highlight/..."
mkdir src/http/get-docs-000lang-catchall/highlight &> /dev/null
mkdir src/http/get-docs-000lang-catchall/highlight/languages &> /dev/null
for lang in bash javascript json powershell python ruby yaml ini
do
  cp node_modules/highlight.js/lib/languages/$lang.js src/http/get-docs-000lang-catchall/highlight/languages/
done
cp node_modules/highlight.js/lib/core.js src/http/get-docs-000lang-catchall/highlight/
cp node_modules/@architect/syntaxes/arc-hljs-grammar.js src/http/get-docs-000lang-catchall/highlight/languages/arc.js
cp scripts/highlight/index.js src/http/get-docs-000lang-catchall/highlight/
echo "Done."
