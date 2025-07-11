//connects with our main app
//connects with controllers, models

import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFoundHandler";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to our tour management system.",
  });
});


//global error handler
app.use(globalErrorHandler);


//url not found handling
app.use(notFound);

export default app;
