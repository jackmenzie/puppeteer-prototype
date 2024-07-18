import { buildServer } from "./server";

const start = async () => {
  const server = await buildServer();

  try {
    await server.listen({ host: "localhost", port: 3000 });

    const address = server.listeningOrigin;
    console.log("Listening on:", address);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
