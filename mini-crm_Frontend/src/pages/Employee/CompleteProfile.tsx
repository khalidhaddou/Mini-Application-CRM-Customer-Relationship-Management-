import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    Paper
} from '@mui/material';
import API from '../../services/api';

const CompleteProfile: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !phone || !address || !birthdate) {
            setError('All fields are required.');
            return;
        }

        API.post(`/invitation/complete/${token}`, {
            password,
            phone,
            address,
            birthdate
        })
            .then(() => {
                setSuccess('Profile successfully completed.');
                navigate('/Employee/dashboard');
            })
            .catch(() => {
                setError('An error occurred. Please try again.');
            });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Complete Your Profile
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Phone"
                        type="text"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Address"
                        type="text"
                        fullWidth
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CompleteProfile;
