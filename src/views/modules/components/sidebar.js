import listFromObject from '../helpers/list.js'
import slugify from '../helpers/slugify.js'
import toc from '../../docs/table-of-contents.js'
const map = {
  list: function List(state={}) {
    let { children } = state
    return `
<ul
  class="
    mb1
    list-none
  "
>
  ${ children }
</ul>
    `
  },
  item: function Item(state={}) {
    let { child='', children=[], depth, path } = state
    let isHeading = children.length
    return `
<li
  class="
    mb-1
    ml-4
  "
>
  ${
    isHeading
      ? Heading({ children: child, depth, path })
      : Anchor({ children: child, depth, path })
   }
  ${ children }
</li>
    `
  }
}

function Anchor(state={}) {
  let { children, path } = state
  let href = slugify(path.concat([ children ]).join('/'))
  return `
<a href="/${ href }">${ children }</a>
  `
}

function Heading(state={}) {
  let { children, depth, path } = state
  let href = slugify(path.concat([ children ]).join('/'))
  return `
<h${depth + 2}
  class="
   mb-1
  "
>
  ${ children }
</h${depth + 2}>
  `
}

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
${ listFromObject({ data: toc, map, path: [ 'docs', 'en' ] }) }
</aside>
  `
}

/*
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
                <a href="/docs/en/reference/architect-project-structure/architect-manifest-and-config/project-manifest-and-config">
                  Project manifest & config
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/architect-manifest-and-config/function-config-file">
                  Function config file
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/architect-manifest-and-config/environment-file">
                  Environment file
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/architect-manifest-and-config/playground">
                  Playground
                </a>
              </li>
            </ul>
          </li>
          <li>
            Static assets
            <ul>
              <li>
                <a href="/docs/en/reference/architect-project-structure/static-assets/static">
                  Static
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/static-assets/cdn">
                  CDN
                </a>
              </li>
            </ul>
          </li>
          <li>
            Functions
            <ul>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/http-functions">
                  HTTP functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/database-functions">
                  Database functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/scheduled-functions">
                  Scheduled functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/event-functions">
                  Event functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/queue-functions">
                  Queue functions
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/functions/websocket-functions">
                  WebSocket functions
                </a>
              </li>
            </ul>
          </li>
          <li>
            Databases
            <ul>
              <li>
                <a href="/docs/en/reference/architect-project-structure/databases/indexes">
                  Indexes
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/architect-project-structure/databases/tables">
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
                <a href="/docs/en/reference/macros/cli-reference/deploy">
                  deploy
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/env">
                  env
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/hydrate">
                  hydrate
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/init">
                  init
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/logs">
                  logs
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/package">
                  package
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/repl">
                  repl
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/cli-reference/sandbox">
                  sandbox
                </a>
              </li>
            </ul>
          </li>
          <li>
            Runtime helper reference
            <ul>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-events">
                  arc-events
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-http">
                  arc-http
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-http-async">
                  arc-http-async
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-http-helpers">
                  arc-http-helpers
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-http-proxy">
                  arc-http-proxy
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-http-session">
                  arc-http-session
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-queues">
                  arc-queues
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-static">
                  arc-static
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-tables">
                  arc-tables
                </a>
              </li>
              <li>
                <a href="/docs/en/reference/macros/runtime-helper-reference/arc-ws">
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
