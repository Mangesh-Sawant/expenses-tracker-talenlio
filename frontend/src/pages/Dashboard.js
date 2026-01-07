import React, { useEffect, useState, useContext } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await axios.get('/reports/summary');
                setSummary(data);
            } catch (error) {
                console.error('Error fetching summary', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    const pieData = {
        labels: summary?.expensesByCategory.map(item => item.categoryName) || [],
        datasets: [
            {
                data: summary?.expensesByCategory.map(item => item.total) || [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user && user.email}
            </Typography>
            <Grid container spacing={3}>
                {/* Total Expenses */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 140,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Expenses
                        </Typography>
                        <Typography component="p" variant="h4">
                            ${summary?.totalExpenses || 0}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Chart */}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 400,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Expenses by Category
                        </Typography>
                        <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {summary?.expensesByCategory.length > 0 ? (
                                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                            ) : (
                                <Typography>No expense data available</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
