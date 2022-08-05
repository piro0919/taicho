// path: ./config/env/production/database.ts

import { parse } from "pg-connection-string";

const config = parse(process.env.DATABASE_URL);

// eslint-disable-next-line import/no-anonymous-default-export, unused-imports/no-unused-vars
export default ({ env }): Record<string, unknown> => ({
  connection: {
    client: "postgres",
    connection: {
      database: config.database,
      host: config.host,
      password: config.password,
      port: config.port,
      ssl: {
        rejectUnauthorized: false,
      },
      user: config.user,
    },
    debug: false,
  },
});
