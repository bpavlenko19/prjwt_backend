const jwt = require("jsonwebtoken");

const signatureAccess = "MySuP3R_z3kr3t_access";
const signatureRefresh = "MySuP3R_z3kr3t_refresh";

const accessTokenLifetime = 20; 
const refreshTokenLifetime = 60 * 60; 
const refreshTokenTokenAge = 7; // Например, значение времени жизни в днях

const verifyAuthorizationMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  ? req.headers.authorization.split(" ")[1]
  : "";

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, signatureAccess);
    req.user = decoded;
  } catch (err) {
    return res.sendStatus(401);
  }
  return next();
}

const verifyRefreshTokenMiddleware = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(refreshToken, signatureAccess);
    req.user = decoded;
  } catch (err) {
    return res.sendStatus(401);
  }
  return next();
}

const getTokens = (login) => ({
  accessToken: jwt.sign({ login }, signatureAccess, {
    expiresIn: `${accessTokenLifetime}s`,
  }),
  refreshToken: jwt.sign({ login }, signatureRefresh, {
    expiresIn: `${refreshTokenLifetime}s`,
  }),
});

module.exports = {
  getTokens,
  refreshTokenTokenAge,
  verifyAuthorizationMiddleware,
  verifyRefreshTokenMiddleware,
};
