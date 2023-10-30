# nx-betterer

## Supported Versions

<a href="https://www.npmjs.com/package/@spaceribs/nx-betterer" rel="nofollow">
  <img src="https://badgen.net/npm/v/@spaceribs/nx-betterer" alt="@spaceribs/nx-betterer NPM package">
</a>

| Package Version | Nx Version | Supported          |
| --------------- | ---------- | ------------------ |
| 2.x             | 17.x       | :white_check_mark: |
| 1.x             | 16.x       | :white_check_mark: |
| 0.x             | 15.x       | :white_check_mark: |

This library was generated with [Nx](https://nx.dev).

## Quick Start

1. Add `@spaceribs/nx-betterer` to your project:

   ```bash
   $ npm install @spaceribs/nx-betterer --save-dev
   # or
   $ yarn add @spaceribs/nx-betterer --dev
   ```

2. Generate the betterer configuration in your project:

   ```bash
   $ nx g @spaceribs/nx-betterer:add my-project

   >  NX  Generating @spaceribs/nx-betterer:init
   ```

3. Open the blank rules configuration added to your project and follow
   the guide at: <https://phenomnomnominal.github.io/betterer/docs/test-definition-file>.

4. Run the executor to generate the initial results file.

   ```bash
   $ nx run my-project:betterer

      \ | /     _         _   _
    '-.ooo.-'  | |__  ___| |_| |_ ___ _ __ ___ _ __
   ---ooooo--- | '_ \/ _ \ __| __/ _ \ '__/ _ \ '__|
    .-'ooo'-.  | |_)|  __/ |_| ||  __/ | |  __/ |
      / | \    |_.__/\___|\__|\__\___|_|  \___|_|

   🎉 Betterer (1,078ms): 1 test done!
   ✅ stricter compilation: "stricter compilation" has already met its goal! ✨
   1 test got checked. 🤔
   1 test met its goal! 🎉
   ```

5. Commit your changes.

NOTE: Keep in mind that due to a lack of ESModule support in NxNrwl, you'll
need to use CommonJS syntax.

## Setup Precommits

If you have husky installed and want to make sure your betterer results are kept up
to date, you can run the following to make sure the file hashes are updated
when you commit:

```bash
npx husky add ./.husky/betterer "npx nx affected --target betterer --precommit"
```

Unless these hashes are kept up to date, CI mode (the default mode) will fail loudly.
You can also run this command manually with:

```bash
nx run my-project:betterer --precommit
```

## Update Results

If you wish to update all of your results, overriding failures, you can run the following:

```bash
nx run my-project:betterer --update
```

## Watch Mode

If you wish to keep betterer open as you fix issues, you can run the following:

```bash
nx run my-project:betterer --watch
```
