# `npx deploy`

Deploys code in `/src` to `staging`. If `ARC_DEPLOY=production` is set, the code in `/src` will be deployed to `production`. (A lot of other things happen under the hood, outlined below.)

If the local `.arc` file has defined (and created) `@static` buckets, then the contents of `.static` are deployed to the appropriate S3 bucket. More about [working with static assets here](/guides/static-assets).

### Looking under the hood at `deploy`

`arc`'s deploy process does a number of things during each deploy! In summary:

- Checks for valid `package.json` & `package-lock.json` files in each function
- Removes each function's local `node_modules` folder and does a fresh install of all modules
- Populates each function with [`arc` shared code](/guides/sharing-common-code) via `/src/shared`
- Compresses and uploads each function directory to its corresponding Lambda

> Reminder: All `arc` npm run scripts require `AWS_PROFILE` and `AWS_REGION` environment variables set. Learn more in the [Prerequisites guide](/quickstart).

<script src="https://asciinema.org/a/181947.js" id="asciicast-181947" async data-autoplay="true" data-size="big"></script>
