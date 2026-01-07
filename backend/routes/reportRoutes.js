const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// @desc    Get dashboard summary
// @route   GET /api/reports/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Total Expenses
        const totalExpenses = await Expense.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        // Expenses by Category
        const expensesByCategory = await Expense.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$categoryId',
                    total: { $sum: '$amount' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $project: {
                    categoryName: '$category.name',
                    total: 1,
                },
            },
        ]);

        res.json({
            totalExpenses: totalExpenses[0] ? totalExpenses[0].total : 0,
            expensesByCategory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
