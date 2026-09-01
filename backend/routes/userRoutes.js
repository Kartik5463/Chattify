import express from 'express'
import { allUsers, authUser, registerUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router()
router.get('/',protect,allUsers)
router.post('/', registerUser)
router.post('/login', authUser)
export default router;