import express from "express";
import {
  createCheckoutSession,
  handleSuccess,
  createPaymentIntent,
  confirmPayment,
} from "../controllers/payment.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create Stripe Checkout Session (Hosted Page)
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Handle payment success
router.get("/success", handleSuccess);

// Create payment intent (for embedded checkout)
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

// Confirm payment status
router.post("/confirm-payment", verifyToken, confirmPayment);

export default router;
