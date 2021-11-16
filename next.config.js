module.exports = {
  generateBuildId: async () => {
    return require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .replace('\n', '');
  }
};
