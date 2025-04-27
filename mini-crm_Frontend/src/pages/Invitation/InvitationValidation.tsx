import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';

// 🧱 MUI Components
import { Container, Typography, Button, Alert, CircularProgress, Box, Paper } from '@mui/material';

interface InvitationResponse {
    name: string;
    email: string;
}

const InvitationValidation: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        API.get(`/invitation/validate/${token}`)
            .then(response => {
                setInvitation(response.data);
            })
            .catch(() => {
                setError("Le lien d'invitation est invalide ou a expiré.");
            });
    }, [token]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/complete-profile/${token}`);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Validation de l'invitation
                </Typography>

                {error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                ) : invitation ? (
                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Bonjour <strong>{invitation.name}</strong>, veuillez compléter votre profil.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSubmit}
                            sx={{ mt: 3 }}
                        >
                            Compléter le profil
                        </Button>
                    </Box>
                ) : (
                    <Box mt={4}>
                        <CircularProgress />
                        <Typography variant="body2" mt={2}>Chargement...</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default InvitationValidation;
