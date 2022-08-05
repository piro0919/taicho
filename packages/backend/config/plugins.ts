module.exports = ({ env }) => ({
  "vercel-deploy": {
    config: {
      apiToken: process.env.VERCEL_DEPLOY_PLUGIN_API_TOKEN,
      appFilter: process.env.VERCEL_DEPLOY_PLUGIN_APP_FILTER,
      deployHook: process.env.VERCEL_DEPLOY_PLUGIN_HOOK,
      roles: ["strapi-super-admin"],
      teamFilter: process.env.VERCEL_DEPLOY_PLUGIN_TEAM_FILTER,
    },
    enabled: true,
  },
});
