// backend/routes/paymentRoutes.js
import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createBankAccount,
  requestBankLoginOtp,
  verifyBankLogin,
  addAmount,
  sendMoney,
  checkBalance,
  withdraw,
  getTransactions,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/account', auth, createBankAccount);
router.post('/account/request-otp', requestBankLoginOtp);
router.post('/account/verify', verifyBankLogin);
router.post('/account/add', auth, addAmount);
router.post('/transfer', auth, sendMoney);
router.get('/balance', auth, checkBalance);
router.post('/withdraw', auth, withdraw);
router.get('/transactions', auth, getTransactions);

export default router;