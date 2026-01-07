import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../api/axios';
import moment from 'moment';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState({ amount: '', date: moment().format('YYYY-MM-DD'), description: '', categoryId: '' });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            const { data } = await axios.get('/expenses');
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleOpen = (expense = { amount: '', date: moment().format('YYYY-MM-DD'), description: '', categoryId: '' }) => {
        setCurrentExpense({
            ...expense,
            date: moment(expense.date).format('YYYY-MM-DD')
        });
        setIsEdit(!!expense._id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentExpense({ amount: '', date: moment().format('YYYY-MM-DD'), description: '', categoryId: '' });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await axios.put(`/expenses/${currentExpense._id}`, currentExpense);
            } else {
                await axios.post('/expenses', currentExpense);
            }
            fetchExpenses();
            handleClose();
        } catch (error) {
            console.error('Error saving expense', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Expenses
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add Expense
            </Button>
            <Paper elevation={3} sx={{ overflow: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense._id}>
                                <TableCell>{moment(expense.date).format('YYYY-MM-DD')}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell>{expense.categoryId?.name || 'Uncategorized'}</TableCell>
                                <TableCell align="right">${expense.amount}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpen(expense)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(expense._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400, mt: 1 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        fullWidth
                        value={currentExpense.amount}
                        onChange={(e) => setCurrentExpense({ ...currentExpense, amount: e.target.value })}
                    />
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentExpense.date}
                        onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        type="text"
                        fullWidth
                        value={currentExpense.description}
                        onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={currentExpense.categoryId}
                            label="Category"
                            onChange={(e) => setCurrentExpense({ ...currentExpense, categoryId: e.target.value })}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Expenses;
