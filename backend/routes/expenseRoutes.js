const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id })
            .populate('categoryId', 'name')
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add an expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { amount, date, description, categoryId } = req.body;

        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            date,
            description,
            categoryId,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await expense.deleteOne();

        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
