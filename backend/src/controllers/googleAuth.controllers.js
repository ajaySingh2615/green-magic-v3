import { asyncHandler } from "../utils/asyncHandler.js";
import { googleClient } from "../utils/google.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

const googleSignIn = asyncHandler(async (req, res) => {
  const { idToken, access_token } = req.body;

  if (!idToken && !access_token) {
    throw new ApiError(400, "Google token is required");
  }

  try {
    let payload;

    if (access_token) {
      // If access_token is provided, get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );

      if (!userInfoResponse.ok) {
        throw new ApiError(401, "Invalid Google access token");
      }

      const googleUserInfo = await userInfoResponse.json();
      // Map Google API response to our expected format
      payload = {
        sub: googleUserInfo.id,
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        picture: googleUserInfo.picture,
      };
    } else {
      // verify the Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    const { sub: googleId, email, name, picture } = payload;

    // check if user already exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      // create new user
      user = await User.create({
        fullname: name,
        email,
        googleId,
        avatar: picture,
        username:
          email.split("@")[0] +
          "_" +
          Math.random().toString(36).substring(2, 5), // Generate unique username
      });
    } else if (!user.googleId) {
      // link existing email account with Google
      user.googleId = googleId;
      if (!user.avatar) {
        user.avatar = picture;
      }
      await user.save();
    }

    // generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Add sameSite for better security
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "Google sign in successful"
        )
      );
  } catch (error) {
    console.error("Google OAuth error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Google authentication failed", error);
  }
});

const forceLogout = asyncHandler(async (req, res) => {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    throw new ApiError(404, "Endpoint not found");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "All sessions cleared successfully"));
});

export { googleSignIn, forceLogout };
