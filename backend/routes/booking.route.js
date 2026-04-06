import express from 'express';
import {
  getBookingByOrderId,
  updateBookingSchedule,
  getAllBookings,
  deleteBooking,
} from '../controllers/booking.controller.js';
import { verifyToken, requireAdmin } from '../controllers/shreeWebAuth.controller.js';

const router = express.Router();

// Public routes
router.get('/order/:orderId', getBookingByOrderId);
router.put('/order/:orderId/schedule', updateBookingSchedule);

// Admin routes
router.get('/', verifyToken, requireAdmin, getAllBookings);
router.delete('/:id', verifyToken, requireAdmin, deleteBooking);

export default router;
