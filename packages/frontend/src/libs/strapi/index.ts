import axios from "axios";

const strapi = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
  },
});

export default strapi;
