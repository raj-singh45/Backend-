import { Router } from "express";
import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/auth.js";
import cookieParser from "cookie-parser";
const router = Router();

/**
 * @POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(400).json({
      message: "User already exist ",
      errors: [
        {
          field: "email",
          message: "user already exist",
        },
      ],
    });
  }
  const user = await userModel.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });
  const { accessToken, refreshToken } = generateTokens({ userId: user._id });

  //saving into user db
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });
  res.status(201).json({
    message: "User registered succesfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken,
    },
  });
});

/**
 * @GET /api/auth/me
 *
 */

router.get("/me", async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = verifyAccessToken(accessToken);

    const user = await userModel.findById(decoded._id);

    res.status(200).json({
      message: "User fetch successfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(200).json({
      message: "unauthorized invalid or expired accesstoeken ",
    });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const decoded = verifyRefreshToken(refreshToken);

  const user = await userModel.findById(decoded._id);
  if (user.refreshToken !== refreshToken) {
    //JO DB ME TOKEN HAI AUR JO REQ ME TOKEN HAI KYA WO BARABAR HAI
    user.refreshToken = null; //kisi ke paas token mil bhi gya to wo nya access token generate ni kr payega usse bhi login krnaa pdega
    await user.save();
    return res.status(401).json({
      message: "Unauthorized, refresh token mismatched",
    });
  }
  //agar same token hua dono me to
  const { accessToken, refreshToken: newRefreshToken } = generateTokens({
    userId: user._id,
  });
  res.cookie("refreshtoken", newRefreshToken, { httpOnly: true });
  user.refreshToken = newRefreshToken;
  await user.save();

  res.status(200).json({
    message: "token refresh succesfullly",
    accessToken,
  });
});
export default router;
