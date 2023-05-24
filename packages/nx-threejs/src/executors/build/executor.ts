import { BuildExecutorSchema } from './schema';
import { logger } from '@nx/devkit';
import obj2gltf from 'obj2gltf';
import * as fs from 'fs';
import * as path from 'path';

export default async function buildExecutor(options: BuildExecutorSchema) {
  const objFiles = fs
    .readdirSync(options.objFolder)
    .filter((fn) => fn.endsWith('.obj'));

  let glbIndex = '';
  let gltfIndex = '';

  for (const file of objFiles) {
    const fileName = path.parse(file).name;

    logger.info(`Converting "${file}" to gltf/glb...`);
    const gltf = await obj2gltf(`${options.objFolder}/${file}`);
    const glb = await obj2gltf(`${options.objFolder}/${file}`, {
      binary: true,
    });

    const gltfData = Buffer.from(JSON.stringify(gltf));

    fs.writeFileSync(`${options.gltfFolder}/${fileName}.gltf`, gltfData);
    fs.writeFileSync(`${options.glbFolder}/${fileName}.glb`, glb);

    gltfIndex += `export { default as ${fileName} } from './${fileName}.gltf';\n`;
    glbIndex += `export { default as ${fileName} } from './${fileName}.glb';\n`;
  }

  fs.writeFileSync(`${options.gltfFolder}/index.ts`, gltfIndex);
  fs.writeFileSync(`${options.glbFolder}/index.ts`, glbIndex);

  return {
    success: true,
  };
}
