const jwt = require("jsonwebtoken");

class TokenHelper {
      /**
   *
   * @param {String} tokenFromClient
   */
  async verifyAccessToken(tokenFromClient) {
    try {
      const decoded = jwt.verify(
        tokenFromClient,
        process.env.JWT_SECRET
      );
   
      return decoded;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new TokenHelper();