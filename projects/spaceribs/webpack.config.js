module.exports = {
  module: {
    rules: [
      {
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
      },
    ],
  },
};
