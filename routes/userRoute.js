import { Router } from "express";
import discountController from "../controllers/discountController.js";
const router = Router();
router.get('/discount', discountController);

export default router;