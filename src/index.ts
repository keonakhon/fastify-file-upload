import server from "./app";

// Environment
import ConfigKey from "./utils/environment/env-index";

const start = async () => {
  try {
    const portApp: number = parseInt(ConfigKey.APP_PORT!) || 30011;
    await server.listen({ port: portApp }, () => {
      console.log(`Server is running at port ${portApp}`);
    });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
