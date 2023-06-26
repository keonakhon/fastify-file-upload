import jwt, { JwtPayload } from "jsonwebtoken";

// Configs
import { pgPool } from "../configs/db-connection";

// Utils or Helpers
import ConfigKey from "./environment/env-index";
import * as Error4xxHandler from "./errors/english/4xx.json";

// Verify JWT Token
const verifyToken = async (accessToken: string) => {
  try {
    // Parse JSON of JWT obj key into object
    let jwtSecretKeyOptions = ConfigKey.HASURA_GRAPHQL_JWT_SECRET;
    if (typeof jwtSecretKeyOptions === "string") {
      // Remove single quote ', docker env added it
      const removeQuoteOnJwtSecretKey = jwtSecretKeyOptions.replace(/[']/g, "");
      jwtSecretKeyOptions = JSON.parse(removeQuoteOnJwtSecretKey);
    }

    // Verify JWT Token
    const jwtVerifiedData = (await jwt.verify(
      accessToken,
      jwtSecretKeyOptions.key,
      {
        issuer: jwtSecretKeyOptions.issuer,
        algorithms: [jwtSecretKeyOptions.type]
      }
    )) as JwtPayload;

    // Extract Name to be shorter
    const jwtAbstractedData = jwtVerifiedData["https://hasura.io/jwt/claims"];
    const allowedRoles = jwtAbstractedData["x-hasura-allowed-roles"];
    const defaultRole = jwtAbstractedData["x-hasura-default-role"];
    const userID = jwtAbstractedData["x-hasura-user-id"];

    return { allowedRoles, defaultRole, userID };
  } catch (err) {
    throw err;
  }
};

// Check User Data from DB
const verifyWithExistedUser = async (userID: string) => {
  try {
    const userIDData = await pgPool.query(
      "SELECT id FROM auth.users WHERE id = $1",
      [userID]
    );

    if (!userIDData.rowCount) {
      throw Error4xxHandler.UserDoesNotExist;
    }

    return true;
  } catch (err) {
    throw err;
  }
};

// Authorize Admin Role
const authorizeAdmin = async (allowedRoles: string[], defaultRole: string) => {
  try {
    const allowedMe = allowedRoles.includes("me");
    const allowedUser = allowedRoles.includes("user");
    const allowedAdmin = allowedRoles.includes("admin");

    if (
      !allowedMe ||
      !allowedUser ||
      !allowedAdmin ||
      defaultRole !== "admin"
    ) {
      throw Error4xxHandler.IncorrectAuthorization;
    }

    return true;
  } catch (err) {
    throw err;
  }
};

// Authorize User Role
const authorizeUser = async (allowedRoles: string[], defaultRole: string) => {
  try {
    const allowedMe = allowedRoles.includes("me");
    const allowedUser = allowedRoles.includes("user");

    if (!allowedMe || !allowedUser || defaultRole !== "user") {
      throw Error4xxHandler.IncorrectAuthorization;
    }

    return true;
  } catch (err) {
    throw err;
  }
};

export { verifyToken, verifyWithExistedUser, authorizeAdmin, authorizeUser };
