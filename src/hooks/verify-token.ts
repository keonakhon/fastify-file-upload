// Utils or Helpers
import {
  verifyToken,
  verifyWithExistedUser,
  authorizeAdmin,
  authorizeUser
} from "../utils/authorize-user";
import errorHandler from "../utils/errors/error-handler";
import * as Error4xxHandler from "../utils/errors/english/4xx.json";

// Verify Admin Role by Token
const authorizeAdminRole = async (req: any, reply: any) => {
  const { method, routerPath } = req;

  try {
    if (!req.headers.authorization) {
      const err = Error4xxHandler.NoTokenWasSent;
      return errorHandler(method, routerPath, reply, err);
    }
    const token = req.headers.authorization.replace("Bearer ", "");

    // Verify JWT Token
    const { allowedRoles, defaultRole, userID } = await verifyToken(token);

    // Authorize User Role and default role has to be admin
    await authorizeAdmin(allowedRoles, defaultRole);

    // Check User Data from DB
    await verifyWithExistedUser(userID);

    req.userID = userID;
    req.allowedRoles = allowedRoles;
    req.defaultRole = defaultRole;

    return;
  } catch (err) {
    return errorHandler(method, routerPath, reply, err, 401);
  }
};

// Verify Customer Role by Token
const authorizeCustomerRole = async (req: any, reply: any) => {
  const { method, routerPath } = req;

  try {
    if (!req.headers.authorization) {
      const err = Error4xxHandler.NoTokenWasSent;
      return errorHandler(method, routerPath, reply, err);
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    // Verify JWT Token
    const { allowedRoles, defaultRole, userID } = await verifyToken(token);

    // Authorize User Role and default role has to be user
    await authorizeUser(allowedRoles, defaultRole);

    // Check User Data from DB
    await verifyWithExistedUser(userID);

    req.userID = userID;
    req.allowedRoles = allowedRoles;
    req.defaultRole = defaultRole;

    return;
  } catch (err) {
    return errorHandler(method, routerPath, reply, err, 401);
  }
};

export { authorizeAdminRole, authorizeCustomerRole };
