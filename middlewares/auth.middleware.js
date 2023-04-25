const TokenHelper = require("../helpers/token.helper.js");

module.exports = async (req, res, next) => {
  try {
    const tokenFromClient = req.header("Authorization").split(" ")[1];

    if (tokenFromClient) {
      const decoded = await TokenHelper.verifyAccessToken(tokenFromClient);
      if (decoded) {
        req.decoded = decoded;
        return next();
      } else {
        return res.status(401).json({ message: "unauthorized" });
      }
    } else {
      return res.status(403).json({ message: "no token provided" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
