import { Router } from "express";
import discountController from "../controllers/discountController.js";
import transaction from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/isAuthenticated.js";
import feedback from "../controllers/feedback.controller.js";

const router = Router();
router.get('/discount', discountController);
router.get('/dashboard',authMiddleware, transaction);
router.post('/feedback', authMiddleware, feedback)

export default router;