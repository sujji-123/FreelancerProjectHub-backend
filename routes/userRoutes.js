// backend/routes/userRoutes.js
import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadProfilePicture, 
  getAllClients, 
  getAllFreelancers,
  getAllUsers // ADDED: Import the new function
} from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile/picture', auth, upload.single('profilePicture'), uploadProfilePicture);
router.get('/clients', auth, getAllClients);
router.get('/freelancers', auth, getAllFreelancers);
// ADDED: Route to get all users (for messaging)
router.get('/', auth, getAllUsers);

export default router;