import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import Transaction from '../models/Transaction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toCSV = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return 'Date,Description,Category,Amount,Type\n';
    }
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const rows = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.amount,
        t.type
    ].join(','));
    return [headers.join(','), ...rows].join('\n');
};

export const generateReport = async (req, res) => {
    try {
        const { reportType, period, format } = req.body;
        const userId = req.user._id; // Assuming you have user authentication middleware

        // Fetch transactions based on period
        let startDate = new Date();
        let endDate = new Date();
        
        switch(period) {
            case 'Current Month':
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                break;
            case 'Last Month':
                startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
                endDate = new Date(startDate.getFullYear(), startDate.getMonth(), 0);
                break;
            case 'Year to Date':
                startDate = new Date(startDate.getFullYear(), 0, 1);
                break;
        }

        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        const fileName = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`;
        const filePath = path.join(__dirname, '../reports', fileName);
        
        // Generate CSV content
        const csvContent = toCSV(transactions);
        await fs.writeFile(filePath, csvContent);

        // Create report metadata
        const report = {
            fileName,
            reportType,
            period,
            format: 'CSV',
            generatedAt: new Date(),
            path: `/reports/${fileName}`
        };

        res.status(200).json({
            message: 'Report generated successfully',
            report
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
};

export const downloadReport = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '../reports', fileName);
        
        await fs.access(filePath); // Check if file exists
        res.download(filePath);
    } catch (error) {
        console.error('Error downloading report:', error);
        res.status(404).json({ message: 'Report not found' });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '../reports', fileName);
        
        await fs.unlink(filePath);
        // Also remove from database if you're storing metadata
        
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Error deleting report' });
    }
};