import express from "express";
import path from "path";
import morgan from "morgan";

import { getUiRouter } from "./routes";

const LOG_FORMAT_DEBUG =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":req[Authorization]"';
const LOG_FORMAT = "tiny";

export default function () {
  const app = express();

  app.use(morgan(LOG_FORMAT));

  // Serve assets from the bundle without auth
  app.use("/assets", express.static(path.join(__dirname, "assets")));

  // Forward all other requests to the UI router, which we expect to
  // handle most user requests.
  const uiRouter = getUiRouter();
  app.use("/", uiRouter);

  return app;
}
