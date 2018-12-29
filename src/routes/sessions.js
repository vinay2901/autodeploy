import { ApplicationError } from "../lib/errors";
import { decodeToken, generateToken } from "../lib/token";
import { route } from "./";
import { STATUS_CODES } from "../lib/statusCodes";
// middleware that verifies that a token is present and is legitimate.
export const verify = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send(STATUS_CODES[3002]);
  }
  // strip the leading "Bearer " part from the rest of the token string
  const tokenandUserId = authHeader.substring("Bearer ".length);
  var token = tokenandUserId.split(",");
  try {
    const decoded = await decodeToken(token[1]);
    if (token[0] != decoded.id) {
      throw new ApplicationError("Not found");
    }
    req.body.userId = token[0];
    next();
  } catch (err) {
    // assume failed decoding means bad token string
    return res.status(401).send(STATUS_CODES[3001]);
  }
};
