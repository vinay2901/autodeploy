module.exports = {
  apps: [
    {
      name: "poc",
      script: "./build/index.js",
      watch: false,
      env: {
        NODE_ENV: "staging"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
