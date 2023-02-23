import { ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-playwright';

export const config: ScullyConfig = {
  projectRoot: './projects/spaceribs/src',
  sourceRoot: './projects/spaceribs/src',
  projectName: 'spaceribs',
  distFolder: './dist/projects/spaceribs', // output directory of your Angular build artifacts
  outDir: './docs', // directory for scully build artifacts
  defaultPostRenderers: [],
  routes: {},
};
