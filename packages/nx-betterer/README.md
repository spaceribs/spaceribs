# nx-betterer

## Supported Versions

<a href="https://www.npmjs.com/package/@spaceribs/nx-betterer" rel="nofollow">
  <img src="https://badgen.net/npm/v/@spaceribs/nx-betterer" alt="@spaceribs/nx-betterer NPM package">
</a>

| Package Version | Nx Version | Supported          |
| --------------- | ---------- | ------------------ |
| 1.x             | 15.x       | :white_check_mark: |

This library was generated with [Nx](https://nx.dev).

## Quick Start

1. Add `@spaceribs/nx-betterer` to your project:

   ```bash
   $ npm install @spaceribs/nx-betterer --save-dev
   # or
   $ yarn add @spaceribs/nx-betterer --dev
   ```

3. Generate the betterer configuration in your project:

   ```bash
   $ nx g @spaceribs/nx-betterer:add my-project

   >  NX  Generating @spaceribs/nx-betterer:application
   ```

4. Open the blank rules configuration added to your project and follow
   the guide at: <https://phenomnomnominal.github.io/betterer/docs/test-definition-file>.

NOTE: Keep in mind that due to a lack of ESModule support in NxNrwl, you'll
need to use CommonJS syntax.
