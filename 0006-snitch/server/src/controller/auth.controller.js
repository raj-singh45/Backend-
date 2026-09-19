import userModel from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/auth.utils.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({ email });
  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User Already exist with this email address",
      errors: [
        {
          field: "email",
          message: "User  Already exist with this email address ",
        },
      ],
    });
  }

  const user = await userModel.create({
    name,
    email,
    passwordHash: bcryptjs.hash(password, 12),
  });

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });
}
