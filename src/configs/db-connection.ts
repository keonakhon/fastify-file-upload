/* Configs - DB Connection */
import { Pool } from "pg";

import ConfigKey from "../utils/environment/env-index";

const pgPool = new Pool({
  connectionString: ConfigKey.HASURA_GRAPHQL_DATABASE_URL
});

export { pgPool };
