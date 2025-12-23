import "reflect-metadata";
import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { catchMiddleware } from "@packages/middlewares";
import Console from "@packages/console";
import "./load-env.ts";
import { connectDB } from "./connect/data-source.ts";

await connectDB();

const app = new Application();

app.use(
  oakCors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);

app.use(catchMiddleware);

Console.info("Server is running on port 8080, host: http://localhost:8080");
await app.listen({ port: 8080 });
