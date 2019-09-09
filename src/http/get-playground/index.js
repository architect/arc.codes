exports.handler = async function http (req) {
  return {
    headers: {'content-type': 'text/html; charset=utf8'},
    body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Architect Playground</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" type="text/css">
  <style>
    :root {
      --header-height: 4.75rem;
      --dark: #333;
      --zero: #333;
      --one: #666;
      --two: #6a737d;
      --three: #999;
      --four: #ccc;
      --light: #EAEAEA;
      --accent: #00afdd;
      --hover: #00afee;
      --active: #00afcc;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: "Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    }
    .width-100 {
      width: 100%;
    }
    .width-2 {
      width: 2rem;
    }
    .min-width-0 {
      min-width: 0;
    }
    .min-width-2 {
      min-width: 2rem;
    }
    .form-height {
      height: calc(100vh - var(--header-height));
    }
    .text-align-right {
      text-align: right;
    }
    .display-flex {
      display: flex;
    }
    .display-none {
      display: none;
    }
    .display-block {
      display: block;
    }
    .flex-direction-column {
      flex-direction: column;
    }
    .flex-direction-row {
      flex-direction: row;
    }
    .flex-grow-1 {
      flex-grow: 1;
    }
    .align-items-center {
      align-items: center;
    }
    .justify-content-space-between {
      justify-content: space-between;
    }
    .margin-right-8 {
      margin-right: 0.5rem;
    }
    .padding-top-8 {
      padding-top: 0.5rem;
    }
    .padding-right-16 {
      padding-right: 1rem;
    }
    .padding-bottom-8 {
      padding-bottom: 0.5rem;
    }
    .padding-left-16 {
      padding-left: 1rem;
    }
    .padding-16 {
      padding: 1rem;
    }
    .padding-8 {
      padding: 0.5rem;
    }
    .font-size-1 {
      font-size: 1.5rem;
    }
    .font-size-0 {
      font-size: 1rem;
    }
    .font-weight-bold {
      font-weight: bold;
    }
    .border-none {
      border: none;
    }
    .border {
      border: 2px solid;
    }
    .border-right-1 {
      border-right: 1px solid;
    }
    .border-color-light {
      border-color: var(--light);
    }
    .border-color-dark {
      border-color: var(--dark);
    }
    .border-radius-2 {
      border-radius: 2px;
    }
    .border-radius-4 {
      border-radius: 4px;
    }
    .resize-none {
      resize: none;
    }
    .color-dark {
      color: var(--dark);
    }
    .color-one {
      color: var(--one);
    }
    .color-light {
      color: var(--light);
    }
    .background-transparent {
      background: transparent;
    }
    .background-dark {
      background: var(--dark);
    }
    .background-three {
      background: var(--three);
    }
    .fill-light {
      fill: var(--light);
    }
    .overflow-auto {
      overflow: auto;
    }
    .overflow-hidden {
      overflow: hidden;
    }
    .white-space-nowrap {
      white-space: nowrap;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  </style>
</head>
<body class="overflow-hidden">
<div
  class="
    display-flex
    flex-direction-column
  "
>
  <div
    class="
      padding-16
      display-flex
      align-items-center
      justify-content-space-between
      background-dark
    "
  >
    <div
      class="
        display-flex
        align-items-center
      "
    >
      <svg
        class="
          width-2
          min-width-2
          margin-right-8
          fill-light
        "
        viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="m23.7.44c13.02 0 23.63 10.6 23.63 23.63s-10.6 23.63-23.63 23.63-23.63-10.6-23.63-23.63 10.6-23.63 23.63-23.63zm16.22 34.63-16.23-15.73-16.2 15.78c3.68 5.37 9.71 8.57 16.2 8.57 6.52 0 12.55-3.21 16.23-8.62zm3.4-11c0-10.83-8.8-19.63-19.62-19.63s-19.63 8.81-19.63 19.63c0 2.54.49 5.02 1.46 7.39l16.16-15.75c1.1-1.1 2.91-1.09 4.02.02l16.17 15.68c.96-2.35 1.44-4.82 1.44-7.34z" fill-rule="evenodd"/></svg>
      <h1 class="color-light">
        Playground
      </h1>
    </div>

    <div>
      <button
        class="
          display-block
          padding-top-8
          padding-right-16
          padding-bottom-8
          padding-left-16
          white-space-nowrap
          font-size-0
          font-weight-bold
          color-light
          background-transparent
          border
          border-color-light
          border-radius-4
          cursor-pointer
        "
      >
        Share
      </button>
    </div>
  </div>
  <div
    class="
      display-none
      background-dark
      padding-8
      text-align-right
    "
  >
    <input
      id="share"
      type="text"
      name="share"
    />
  </div>
  <section class="flex-grow-1">
    <form
      action="/api/1/package"
      class="
        form-height
        display-flex
      "
    >
      <div
        class="
          display-flex
          flex-direction-column
          border-right-1
          border-color-dark
        "
      >
        <h2
          class="
            padding-top-8
            padding-right-16
            padding-bottom-8
            padding-left-16
            font-size-0
            background-three
            color-light
          "
        >
          .arc
        </h2>
        <div
          class="
            display-flex
            flex-direction-column
            flex-grow-1
            overflow-auto
          "
        >
        <textarea
          class="
            flex-grow-1
            padding-16
            border-none
            resize-none
          "
          name="arc"
        >
    @app
    testapp

    @http
    get /
        </textarea>
      </div>
      </div>
      <div
        class="
          flex-grow-1
          display-flex
          flex-direction-column
          min-width-0
        "
      >
        <h2
          class="
            padding-top-8
            padding-right-16
            padding-bottom-8
            padding-left-16
            font-size-0
            background-three
            color-light
          "
        >
          CloudFormation
        </h2>
        <div
          id="preview"
          class="
            flex-grow-1
            padding-16
            overflow-auto
          "
        ></div>
      </div>
      <button type="submit">arc package</button>
    </form>
  </section>
</div>
<script type="module" src="/intro/playground.js"></script>
</body>
</html>
 `
  }
}
