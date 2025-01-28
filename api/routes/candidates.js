import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { upload, uploadToS3 } from '../middleware/upload.js';
import Candidate from '../models/Candidate.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const candidates = await Candidate.find({ referredBy: req.userId })
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/',
    auth,
    upload.single('resume'),
    [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
      body('jobTitle').trim().notEmpty().withMessage('Job title is required')
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { name, email, phoneNumber, jobTitle } = req.body;
        let resumeUrl = null;
  
        if (req.file) {
          resumeUrl = await uploadToS3(req.file);
        }
  
        const candidate = new Candidate({
          name,
          email,
          phoneNumber,
          jobTitle,
          resumeUrl,
          referredBy: req.userId
        });
  
        await candidate.save();
        res.status(201).json(candidate);
      } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
      }
    }
  );

router.patch('/:id/status',
  auth,
  [
    body('status')
      .isIn(['Pending', 'Reviewed', 'Hired'])
      .withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const candidate = await Candidate.findOne({
        _id: req.params.id,
        referredBy: req.userId
      });

      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      candidate.status = req.body.status;
      await candidate.save();

      res.json(candidate);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

router.delete('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({
      _id: req.params.id,
      referredBy: req.userId
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;