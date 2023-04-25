const jwt = require("jsonwebtoken");
const { verifyGoogleToken } = require("../services/auth.service");
const User = require("../models/user.model");

class AuthController {
  static async login(req, res) {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(
          req.body.credential
        );

        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }

        const profile = verificationResponse?.payload;

        let user = await User.findOne({ email: profile.email });
        if (!user) {
          user = new User({
            email: profile?.email,
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
          });
          await user.save();
        }

        res.status(201).json({
          message: "Login was successful",
          accessToken: jwt.sign({ userId: user?._id }, process.env.JWT_SECRET, {
            // expiresIn: "15s",
          }),
          avatar: profile.picture,
          userId: user._id,
          email: user.email
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occured.",
      });
    }
  }
}

module.exports = AuthController;
