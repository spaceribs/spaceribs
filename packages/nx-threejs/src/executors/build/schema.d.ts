/**
 *
 */
export interface BuildExecutorSchema {
  /**
   * Folder where raw .obj files are located.
   */
  objFolder: string;

  /**
   * Folder where converted glb files will out sent to.
   */
  glbFolder: string;

  /**
   * Folder where converted gltf files will out sent to.
   */
  gltfFolder: string;
}
