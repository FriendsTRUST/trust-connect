module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'TRUST Connect',
    },
  },
  transpileDependencies: [
    'minterjs-util/*/*',
    'minter-js-sdk/*/*',
  ],
  pluginOptions: {
    browserExtension: {
      background: true,
      contentScripts: true,
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            content: 'src/content.js',
          },
        },
      },
    },
  },
};
