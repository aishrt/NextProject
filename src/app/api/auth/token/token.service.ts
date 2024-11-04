import { expiration } from "@/config/jwt";
import { tokenTypes } from "@/config/token";

import moment from "moment";
import jwt from "jsonwebtoken";
import Token from "@/models/token.model";

const generateToken = (
  userId: string,
  expires: moment.Moment,
  type: string,
  secret = expiration.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};
const saveToken = async (
  token: string,
  userId: string,
  expires: moment.Moment,
  type: string,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};
export const generateResetPasswordToken = async (user: { id: string }) => {
  const expires = moment().add(
    expiration.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    // "minutes"
    "hours"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};
