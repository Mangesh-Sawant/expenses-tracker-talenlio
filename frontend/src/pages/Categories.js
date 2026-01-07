import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../api/axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', budget: 0 });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleOpen = (category = { name: '', budget: 0 }) => {
        setCurrentCategory(category);
        setIsEdit(!!category._id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCategory({ name: '', budget: 0 });
    };

    const handleSave = async () => {
        try {
            if (isEdit) {
                await axios.put(`/categories/${currentCategory._id}`, currentCategory);
            } else {
                await axios.post('/categories', currentCategory);
            }
            fetchCategories();
            handleClose();
        } catch (error) {
            console.error('Error saving category', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category', error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Categories
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add Category
            </Button>
            <Paper elevation={3}>
                <List>
                    {categories.map((category) => (
                        <ListItem
                            key={category._id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={category.name}
                                secondary={`Budget: $${category.budget}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={currentCategory.name}
                        onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Budget"
                        type="number"
                        fullWidth
                        value={currentCategory.budget}
                        onChange={(e) => setCurrentCategory({ ...currentCategory, budget: Number(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Categories;
