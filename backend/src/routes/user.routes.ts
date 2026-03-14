import { Router } from "express";
import {
    registerUser,
    loginUser,
    verifyOTP,
    googleAuth,
    getCurrentUser,
    refreshAccessToken,
    logoutUser,
    updateAccountDetails,
    deleteAccount,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/google-auth").post(googleAuth);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/delete-account").delete(verifyJWT, deleteAccount);

export default router;
