import toc from '../../docs/table-of-contents.js'
import listFromObject from '../helpers/list.js'

export default function Sidebar(props={}) {
  return `
<aside
  slot=sidebar
  class="
    h-full
    fixed
    left-sidebar
    static-lg
    p2
    overflow-auto
    sidebar-w
    transition-x
    col-start-1
    col-end-2
    row-start-2
    bg-g0
  "
>
  ${ listFromObject(toc) }
</aside>
  `
}

/*
 // EXPECTED
<ul class="pb4">
  <li>
    Guides
    <ul>
      <li>
        Get started
        <ul>
          <li>
            <a href="/docs/en/guides/get-started/quickstart">
              Quickstart
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/get-started/detailed-setup">
              Detailed setup
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/get-started/project-layout">
              Project layout
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/get-started/going-beyond-hello-world">
              Going beyond "Hello World"
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/get-started/meet-your-new-superpowers">
              Meet your new superpowers
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/get-started/upgrade-guides">
              Upgrade guides
            </a>
          </li>
        </ul>
      </li>
      <li>
        Tutorials
        <ul>
          <li>
            <a href="/docs/en/guides/tutorials/developing-with-cloud-functions">
              Developing with cloud functions
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/working-locally-and-offline">
              Working locally and offline
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/code-sharing-across-functions">
              Code sharing across functions
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/cloud-function-middleware">
              Cloud function middleware
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/single-page-apps">
              Single page apps
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/http-and-websocket-sessions">
              HTTP & WebSocket sessions
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/modeling-and-persisting-data">
              Modeling & persisting data
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/background-tasks">
              Background tasks
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/implementing-cors">
              Implementing CORS
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/logging-and-monitoring-your-app">
              Logging & monitoring your app
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/assigning-a-domain-name-to-your-app">
              Assigning a domain name to your app
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/adding-websockets-to-your-app">
              Adding WebSockets to your app
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/using-dependencies-in-your-functions">
              Using dependencies in your functions
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/tutorials/extending-architect-with-macros">
              Extending Architect with macros
            </a>
          </li>
        </ul>
      </li>
      <li>
        AWS
        <ul>
          <li>
            <a href="/docs/en/guides/aws/configuration">
              Configuration
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/aws/aws-credentials">
              AWS credentials
            </a>
          </li>
          <li>
            <a href="/docs/en/guides/aws/custom-iam-roles">
              Custom IAM roles
            </a>
           </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    Reference
    <ul>
      <li>
        <a href="/docs/en/reference/architect-project-structure">
          Architect project structure
        </a>
        <ul>
          <li>
            Architect manifest & config
            <ul>
              <li>
                <a href="/docs/en/reference/architect-manifest-and-config/project-mainfest-and-config">
                  Project manifest & config
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-manifest-and-config/function-config-file">
                  Function config file
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-manifest-and-config/environment-file">
                  Environment file
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-manifest-and-config/playground">
                  Playground
                </a>
              </li>
            </ul>
          </li>
          <li>
            Static assets
            <ul>
              <li>
                <a href="/docs/en/reference/static-assets/static">
                  Static
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/static-assets/cdn">
                  CDN
                </a>
              </li>
            </ul>
          </li>
          <li>
            Functions
            <ul>
              <li>
                <a href="/docs/en/reference/functions/http-functions">
                  HTTP functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/functions/database-functions">
                  Database functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/functions/scheduled-functions">
                  Scheduled functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/functions/event-functions">
                  Event functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/functions/queue-functions">
                  Queue functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/functions/websocket-functions">
                  WebSocket functions
                </a>
              </li>
            </ul>
          </li>
          <li>
            Databases
            <ul>
              <li>
                <a href="/docs/en/reference/databases/indexes">
                  Indexes
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/databases/tables">
                  Tables
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <a href="/docs/en/reference/macros">
          Macros
        </a>
        <ul>
          <li>
            CLI reference
            <ul>
              <li>
                <a href="/docs/en/reference/cli-reference/deploy">
                  deploy
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/env">
                  env
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/hydrate">
                  hydrate
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/init">
                  init
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/logs">
                  logs
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/package">
                  package
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/repl">
                  repl
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/cli-reference/sandbox">
                  sandbox
                </a>
              </li>
            </ul>
          </li>
          <li>
            Runtime helper reference
            <ul>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-events">
                  arc-events
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-http">
                  arc-http
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-http-async">
                  arc-http-async
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-http-helpers">
                  arc-http-helpers
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-http-proxy">
                  arc-http-proxy
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-http-session">
                  arc-http-session
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-queues">
                  arc-queues
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-static">
                  arc-static
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-tables">
                  arc-tables
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/runtime-helper-reference/arc-ws">
                  arc-ws
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    About
    <ul>
      <li>
        <a href="/docs/en/about/mission">
          Mission
        </a>
      </li>
      <li>
        <a href="/docs/en/about/governance">
          Governance
        </a>
      </li>
      <li>
        <a href="/docs/en/about/community">
          Community
        </a>
      </li>
      <li>
        <a href="/docs/en/about/contributor-guide">
          Contributor guide
        </a>
      </li>
      <li>
        <a href="/docs/en/about/help-wanted">
          Help wanted
        </a>
      </li>
    </ul>
  </li>
</ul>
*/
