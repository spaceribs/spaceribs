# nx-web-ext

This library was generated with [Nx](https://nx.dev).

## Quick Start

1. Add `@spaceribs/nx-web-ext` to your project:

   ```bash
   $ npm install @spaceribs/nx-web-ext --save-dev
   # or
   $ yarn add @spaceribs/nx-web-ext --dev
   ```

2. Generate a new chrome extension:

   ```bash
   $ nx g @spaceribs/nx-web-ext:application my-extension

   >  NX  Generating @spaceribs/nx-web-ext:application

   ? What framework would you like to use? …
   angular
   react
   ```

3. Start the chrome extension in development mode:

   ```bash
   $ nx run my-extension:serve

   > nx run my-extension:serve:development

   Entrypoint main [big] 1.32 MiB (1.53 MiB) = runtime.js 7.05 KiB vendor.js 1.31 MiB main.css 112 bytes main.js 7.53 KiB 4 auxiliary assets
   Entrypoint polyfills [big] 334 KiB (393 KiB) = runtime.js 7.05 KiB polyfills.js 327 KiB 2 auxiliary assets
   Entrypoint styles 7.44 KiB (6.11 KiB) = runtime.js 7.05 KiB styles.css 398 bytes 1 auxiliary asset
   chunk (runtime: runtime) main.css, main.js (main) 3.62 KiB (javascript) 75 bytes (css/mini-extract) [initial] [rendered]
   chunk (runtime: runtime) polyfills.js (polyfills) 296 KiB [initial] [rendered]
   chunk (runtime: runtime) runtime.js (runtime) 3.62 KiB [entry] [rendered]
   chunk (runtime: runtime) styles.css (styles) 50 bytes (javascript) 397 bytes (css/mini-extract) [initial] [rendered]
   chunk (runtime: runtime) vendor.js (vendor) (id hint: vendor) 1.29 MiB [initial] [rendered] split chunk (cache group: vendor) (name: vendor)
   webpack compiled successfully (3c3dfb1485cdd31e)
   Application built successfully.
   Running web extension from /Users/spaceribs/dist/projects/my-extension
   Type-checking in progress...
   No errors found.
   Use --verbose or open Tools > Web Developer > Browser Console to see logging
   Installed /Users/spaceribs/dist/projects/my-extension as a temporary add-on
   The extension will reload if any source file changes
   Press R to reload (and Ctrl-C to quit)
   Debugger Port:  61124
   WebExt started successfully.
   ```

4. In the firefox instance, a simple square box should appear in
   the toolbar. Clicking this browser action should display a
   simple popup described as the "action" component.

## Build and Package

1. Bump the version of your extension in the `manifest.json`.
2. Package the extension:

   ```bash
   $ nx run my-extension:package

   > nx run my-extension:build:production

   Entrypoint main 154 KiB = runtime.6877ee6c392522fa.js 1.79 KiB main.ef46db3751d8e999.css 0 bytes main.2368e728f2ffe87b.js 153 KiB
   Entrypoint polyfills 92.7 KiB = runtime.6877ee6c392522fa.js 1.79 KiB polyfills.5ede5f07b79c9d6c.js 90.9 KiB
   Entrypoint styles 1.79 KiB = runtime.6877ee6c392522fa.js 1.79 KiB styles.ef46db3751d8e999.css 0 bytes
   chunk (runtime: runtime) main.ef46db3751d8e999.css, main.2368e728f2ffe87b.js (main) 319 KiB (javascript) 0 bytes (css/mini-extract) [initial] [rendered]
   chunk (runtime: runtime) polyfills.5ede5f07b79c9d6c.js (polyfills) 296 KiB [initial] [rendered]
   chunk (runtime: runtime) styles.ef46db3751d8e999.css (styles) 50 bytes (javascript) 0 bytes (css/mini-extract) [initial] [rendered]
   chunk (runtime: runtime) runtime.6877ee6c392522fa.js (runtime) 4.61 KiB [entry] [rendered]
   webpack compiled successfully (b6bd8837991fc2fa)

   > nx run my-extension:package

   Building web extension from dist/projects/my-extension
   Your web extension is ready: /Users/spaceribs/dist/projects/my-extension-0.0.1.zip
   ```

3. Upload the extension to either the [Mozilla Developer Hub](https://addons.mozilla.org/en-US/developers/) and/or [Chrome Web Store](https://chrome.google.com/webstore/devconsole/).
