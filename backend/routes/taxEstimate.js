import express from 'express';
import { createTaxEstimate, getTaxEstimates } from '../controllers/taxEstimateController.js';

const router = express.Router();

router.post('/create', createTaxEstimate);
router.get('/user/:userId', getTaxEstimates);

export default router;