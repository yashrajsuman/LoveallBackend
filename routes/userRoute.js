import { Router } from "express";
import discountController from "../controllers/discountController.js";
import transaction from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/isAuthenticated.js";

const router = Router();

router.get('/discount', discountController);
router.get('/dashboard',authMiddleware, transaction);

export default router;