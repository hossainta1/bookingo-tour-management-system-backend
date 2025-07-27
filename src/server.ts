/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connect to DB!!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

process.on("SIGTERM", () => {
  console.log("Sigterm signal recived.....  Server Shutting Down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit();
});

process.on("SIGINT", () => {
  console.log("Sigterm signal recived.....  Server Shutting Down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit();
});

// unhandle rejection error hadnle
process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection Detected.....  Server Shutting Down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit();
});

process.on("uncaughtException", (err) => {
  console.log("uncaught Exception Detected.....  Server Shutting Down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit();
});
// unhandle rejection error
// Promise.reject(new Error("I Forgot to catch this error"))

// uncaught rejection error
// throw new Error("I forgot to handle this local error");

/*
* Sometimes facing some error in server
1. unhandle rejection error
2.uncaught rejection error
3. signal termination or sigtam error

*/
