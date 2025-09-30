import express from 'express';
import { generateReport, downloadReport, deleteReport } from '../controllers/reportController.js';

const router = express.Router();

router.post('/generate', generateReport);
router.get('/download/:fileName', downloadReport);
router.delete('/delete/:fileName', deleteReport);

export default router;