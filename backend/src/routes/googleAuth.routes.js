import { Router } from "express";
import {
  googleSignIn,
  forceLogout,
} from "../controllers/googleAuth.controllers.js";

const router = Router();

router.route("/google-signin").post(googleSignIn);
router.route("/force-logout").post(forceLogout);

export default router;
