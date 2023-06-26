import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

// Env from .env
dotenv.config();

// Manual Env for AWS
import("./configs/aws-config");

// Initial Database
import initialDB from "./configs/initial-db";
initialDB();

// Routes
import imageRoutesV1 from "./routes/v1/image";

const app: FastifyInstance = Fastify({ logger: true });

// CORS
app.register(cors, {
  origin: "*",
  methods: ["POST, GET"]
});

// Register Media File Content
app.register(import("@fastify/multipart"), {
  attachFieldsToBody: true,
  limits: { fileSize: 770000 }
});

// Upload File Routes
app.register(imageRoutesV1, { prefix: "/v1" });

export default app;
