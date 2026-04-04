import express from 'express';
import {
  getVideoSection,
  updateVideoSection,
  createVideoSection,
  deleteVideoSection
} from '../controllers/shreeWebVideoSection.controller.js';

const router = express.Router();

// GET /backend/shreeweb-video-section - Get video section data
router.get('/', getVideoSection);

// PUT /backend/shreeweb-video-section - Update video section data
router.put('/', updateVideoSection);

// POST /backend/shreeweb-video-section - Create new video section
router.post('/', createVideoSection);

// DELETE /backend/shreeweb-video-section/:id - Delete video section
router.delete('/:id', deleteVideoSection);

export default router;