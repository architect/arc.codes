#!/bin/sh
# npx hydrate (how we should prep modules) breaks travis
# so this is our hack for now
lambdas=`ls src/html`
for f in $lambdas
do
  (
    cd "src/html/$f"
    rm -rf node_modules
    npm i
    cd ../../../
  ) &
done
wait
