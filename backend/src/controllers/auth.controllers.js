import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";
import {hashThePassword,isUserPasswordCorrect} from "../utils/hash-password.js";
import { UserRole } from "../generated/prisma/index.js";
import { generateJWTToken } from "../utils/jwt-token.js";
import { asyncHandler } from "../utils/async-handler.js";


export const register = asyncHandler(async (req, res) => {
  
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  try {

    const existingUser = await db.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "User already exists"));
    }

    const hashedPassword = await hashThePassword(password);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const token = generateJWTToken(newUser);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User Registered Successfully"));
  } 
  catch (error) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, `Registration failed: ${error.message}`));
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All Fields are required"));
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Invalid Credentials"));
    }

    const isMatch = await isUserPasswordCorrect(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Invalid Credentials"));
    }

    const token = generateJWTToken(user);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "User Logged In Successfully"));
  } catch (error) {
    console.error("Error Logging In user:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error logging in user"));
  }
});

export const logout = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User is not authenticated"));
  }

  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    console.error("Error Logging Out user:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error logging out user"));
  }
});


export const check = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User is not authenticated"));
  }

  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "User authenticated successfully", req.user))
  } 
  catch (error) {
    console.error("Error checking user:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error checking user"))
    
  }

})
