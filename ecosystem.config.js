module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "Tracking",
      script: "server.js",
      instances: 0,
      exec_mode: "cluster",
      env: {},
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "cc",
      host: ["10.1.12.13"],
      ref: "origin/master",
      repo: "git@github.com:khoabeotv/super-barnacle.git",
      path: "/home/cc/super-barnacle",
      "post-deploy": "yarn; yarn build",
    },
  },
};
