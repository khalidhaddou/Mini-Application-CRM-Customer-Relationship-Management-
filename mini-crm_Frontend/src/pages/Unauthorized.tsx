// src/pages/Unauthorized.tsx
import React from 'react';
import { Typography, Container } from '@mui/material';

const Unauthorized = () => {
  return (
    <Container>
      <Typography variant="h3" mt={5}>Accès non autorisé</Typography>
      <Typography>Vous n'avez pas les droits nécessaires pour accéder à cette page.</Typography>
    </Container>
  );
};

export default Unauthorized;
