import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";

import routes from "./routes/";

const app = express();
const port = process.env.PORT || 4000;
const router = express.Router();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

/** set up routes {API Endpoints} */
routes(router);

app.use("/api", router);

if (process.env.NODE_ENV !== "test")
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });

export default app;
