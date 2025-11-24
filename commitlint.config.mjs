// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => message.startsWith("merge")],
};


// npm install --save-dev @commitlint/cli @commitlint/config-conventional