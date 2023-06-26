/* Configs - Environment Data */
import ConfigKeyProd from "./env-prod";
import ConfigKeyDev from "./env-dev";
import ConfigKeyLocal from "./env-local";

let ConfigKey: any;

if (process.env.NODE_ENV === "production") {
  ConfigKey = ConfigKeyProd;
} else if (process.env.NODE_ENV === "development") {
  ConfigKey = ConfigKeyDev;
} else {
  ConfigKey = ConfigKeyLocal;
}

export default ConfigKey;
