//connects with databases

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVar.DB_URL);

    // eslint-disable-next-line no-console
    console.log("DB is connected..");

    server = app.listen(envVar.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App is listenning from port ${envVar.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

startServer();

/**
 * Server Errors:
 * 1. Unhandled promise rejection error: Consequence of unused try catch block
 * 2. uncaught exception error: error other than promise
 * 3. signal termination error: sigterm
 */


//Promise.reject(new Error("I forgot to catch this promise.."))
process.on("unhandledRejection", (error) => {
  console.log(
    "Unhandled rejection error detected. Server is shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1); //node js process
    });
  }

  process.exit(1);
});


// 
process.on("uncaughtException", (error) => {
  console.log(
    "uncaught exception error detected. Server is shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1); //node js process
    });
  }

  process.exit(1);
});


//server authority like AWS, vercel sends signal to turn server off
process.on("SIGTERM", () => {
  console.log(
    "SIGTERM signal detected. Server is shutting down..."
  );

  if (server) {
    server.close(() => {
      process.exit(1); //node js process
    });
  }

  process.exit(1);
});


//we forcefully turn off the server
process.on("SIGINT", () => {
  console.log(
    "SIGINT signal detected. Server is shutting down..."
  );

  if (server) {
    server.close(() => {
      process.exit(1); //node js process
    });
  }

  process.exit(1);
});
