import express from "express";
import {
  userLogin,
  userRegister,
  userChangePassword,
} from "../controllers/userAuthController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", authenticate, authorize(["admin"]), userRegister);
router.put("/change-password", authenticate, userChangePassword);

export default router;
