export default function SeamlessDevelopment ({ html }) {
  return html`
    <style>
      .decoration {
        color: var(--blue-300);
      }
    </style>
    <arc-container>
      <h2 class="text5 font-medium leading1 tracking-2 mbs6 mbe5">
        Seamless development, <span class="block-lg">from local to&nbsp;cloud</span>
      </h2>

      <div class="grid-lg col-2-lg gap0 gap2-lg align-items-center-lg mbe4">
        <p class="measure mbe0 mbe-none-lg text1 font-light tracking-1 order-2-lg">
          Scaffold a fresh Architect project with a single&nbsp;command.
        </p>

        <arc-terminal>
          <span slot="command">npm init @architect your-app</span>
          <div slot="output">
            <p>⚬ Bootstrapping new Architect project</p>
            <p>| Project name .. your-app</p>
            <p>| Creating in ... /Users/LouisK/Developer/your-app</p>
            <p>⚬ Installing Architect...</p>
            <p>✓ Your Architect project is ready!</p>
          </div>
        </arc-terminal>
      </div>

      <p class="text2 text-center mb2 decoration" aria-hidden="true">• • •</p>

      <div class="grid-lg col-2-lg gap0 gap2-lg align-items-center-lg mbe4">
        <p class="measure mbe0 mbe-none-lg text1 font-light tracking-1">
          Get a local, production-like environment up and running&nbsp;instantly.
        </p>

        <arc-terminal>
          <span slot="command">npx arc sandbox</span>
          <div slot="output">
            <p>&nbsp;&nbsp;&nbsp;App ⌁ your-app</p>
            <p>Region ⌁ us-west-2</p>
            <p>http://localhost:3333</p>
            <p>✓ Sandbox started in 12ms</p>
            <p>❤︎ Local environment ready!</p>
          </div>
        </arc-terminal>
      </div>

      <p class="text2 text-center mb2 decoration" aria-hidden="true">• • •</p>

      <div class="grid-lg col-2-lg gap0 gap2-lg align-items-center-lg mbe4">
        <p class="measure mbe0 mbe-none-lg text1 font-light tracking-1 order-2-lg">
          Deploy to identical staging and production environments in&nbsp;seconds.
        </p>

        <arc-terminal>
          <span slot="command">npx arc deploy</span>
          <div slot="output">
            <p>&nbsp;&nbsp;&nbsp;App ⌁ your-app</p>
            <p>Region ⌁ us-west-2</p>
            <p>⚬ Creating new private deployment bucket</p>
            <p>✓ Generated CloudFormation deployment</p>
            <p>✓ Deployed & built infrastructure</p>
            <p>✓ Success! Deployed app in 58.984 seconds</p>
          </div>
        </arc-terminal>
      </div>

      <arc-button-divider>
        Dive into the docs
      </arc-button-divider>
    </arc-container>
  `
}
