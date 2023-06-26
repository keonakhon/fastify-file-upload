import { RouteShorthandOptions } from "fastify";
import FastifyAuth from "@fastify/auth";

// Hooks
import {
  authorizeAdminRole,
  authorizeCustomerRole
} from "../../hooks/verify-token";

// Utils or Helpers
import { imageModification } from "../../utils/modify-image";
import { getImageFromS3 } from "../../utils/s3-function";
import { findLogByUserIdAndFile, findLogByFile } from "../../utils/img-log";
import errorHandler from "../../utils/errors/error-handler";
import * as Error4xxHandler from "../../utils/errors/english/4xx.json";

const imageRoutes = async (fastify: any) => {
  fastify
    .decorate("asyncVerifyAdminRoleJWT", authorizeAdminRole)
    .decorate("asyncVerifyCustomerRoleJWT", authorizeCustomerRole)
    .register(FastifyAuth)
    .after(() => {
      fastify.route({
        method: ["POST"],
        url: "/admin/upload",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyAdminRoleJWT]),
        handler: async (req: any, reply: any) => {
          const { method, routerPath } = req;

          try {
            // Data pass from pre handler
            const userID = req.userID;

            // Data from req body
            const parts = req.body.upload_file;

            const imageType = req.body.track.value.toLowerCase();
            let objectID = req.body.object_id?.value;

            if (!objectID) {
              objectID = undefined;
            }

            // Modify image to webp and upload to S3
            const uploadedData = await imageModification(
              parts,
              imageType,
              "dashboard",
              objectID,
              userID
            );

            return reply.code(201).send(uploadedData);
          } catch (err) {
            return errorHandler(method, routerPath, reply, err);
          }
        }
      });

      fastify.route({
        method: ["POST"],
        url: "/user/upload",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyCustomerRoleJWT]),
        handler: async (req: any, reply: any) => {
          const { method, routerPath } = req;

          try {
            // Data pass from pre handler
            const userID = req.userID;

            // Data from req body
            const parts = req.body.upload_file;

            const imageType = req.body.track.value.toLowerCase();
            let objectID = req.body.object_id?.value;

            if (!objectID) {
              objectID = undefined;
            }

            const allowedPath: string = process.env.UNALLOW_IMG_PATH!;
            const imgPath = imageType;

            // Throw error on the forbidden img path
            if (!allowedPath.includes(imgPath)) {
              throw Error4xxHandler.NoPermissionToAccessImgPath;
            }

            // Modify image to webp and upload to S3
            const uploadedData = await imageModification(
              parts,
              imageType,
              "client",
              objectID,
              userID
            );

            return reply.code(201).send(uploadedData);
          } catch (err) {
            return errorHandler(method, routerPath, reply, err);
          }
        }
      });

      fastify.route({
        method: ["GET"],
        url: "/user/img/:type/:image",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyCustomerRoleJWT]),
        handler: async (req: any, reply: any) => {
          const { method, routerPath } = req;

          try {
            // Data pass from pre handler
            const userID = req.userID;

            // Data from req body
            const params = req.params;
            const imgPath = params.type.toLowerCase();
            const fileName = params.image;

            // Check User Id, Filename and Path in DB whether it matches or not
            await findLogByUserIdAndFile(userID, fileName, imgPath);

            // Get Image Object from AWS S3
            const s3Object = await getImageFromS3(imgPath, fileName);
            const readStreamFromS3 = s3Object.createReadStream();

            return reply.type("image/png").send(readStreamFromS3);
          } catch (err) {
            return errorHandler(method, routerPath, reply, err);
          }
        }
      });

      fastify.route({
        method: ["GET"],
        url: "/admin/img/:type/:image",
        logLevel: "warn",
        preHandler: fastify.auth([fastify.asyncVerifyAdminRoleJWT]),
        handler: async (req: any, reply: any) => {
          const { method, routerPath } = req;

          try {
            // Data pass from pre handler
            const userID = req.userID;

            // Data from req body
            const params = req.params;
            const imgPath = params.type.toLowerCase();
            const fileName = params.image;

            // Check Filename and Path in DB
            await findLogByFile(fileName, imgPath);

            // Get Image Object from AWS S3
            const s3Object = await getImageFromS3(imgPath, fileName);
            const readStreamFromS3 = s3Object.createReadStream();

            return reply.type("image/png").send(readStreamFromS3);
          } catch (err) {
            return errorHandler(method, routerPath, reply, err);
          }
        }
      });

      fastify.route({
        method: ["GET"],
        url: "/img/:type/:image",
        logLevel: "warn",
        handler: async (req: any, reply: any) => {
          const { method, routerPath } = req;

          try {
            const params = req.params;

            const unallowedPath: string = process.env.UNALLOW_IMG_PATH!;
            const imgPath = params.type.toLowerCase();

            // Throw error on the forbidden img path
            if (unallowedPath.includes(imgPath)) {
              throw Error4xxHandler.NoPermissionToAccessImgPath;
            }

            // Get Image Object from AWS S3
            const s3Object = await getImageFromS3(params.type, params.image);
            const readStreamFromS3 = s3Object.createReadStream();

            return reply.type("image/png").send(readStreamFromS3);
          } catch (err) {
            return errorHandler(method, routerPath, reply, err);
          }
        }
      });
    });
};

export default imageRoutes;
