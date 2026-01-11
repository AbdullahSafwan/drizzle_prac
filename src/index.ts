import app from "./app";
import config from "./config/env";

const port = config.port;

app.listen(port, () => {
  console.log("listening to port", port);
});

export default app;
