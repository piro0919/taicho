/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://taicho.kk-web.link/",
  generateRobotsTxt: true,
};

module.exports = config;
