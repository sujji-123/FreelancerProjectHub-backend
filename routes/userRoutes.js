// backend/routes/userRoutes.js
import express from 'express';
import { getProfile, updateProfile, uploadProfilePicture, getAllClients, getAllFreelancers } from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile/picture', auth, upload.single('profilePicture'), uploadProfilePicture);
router.get('/clients', auth, getAllClients);
router.get('/freelancers', auth, getAllFreelancers);

export default router;