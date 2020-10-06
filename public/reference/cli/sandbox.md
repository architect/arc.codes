# `arc sandbox`
## Run a local server with http, queues and optionally scheduled events

Starts a local web server and in-memory database for previewing code defined by `app.arc`.

- `arc sandbox --port 8888` sets the http port to 8888
- `arc sandbox --verbose` enable verbose logging
- `arc sandbox --scheduled` run scheduled events

While the sandbox is running, a few key commands are available (capital letters)

- `H` reload all files
- `S` reload shared files
- `V` reload view files
- `T` trigger all scheduled events to run
---
