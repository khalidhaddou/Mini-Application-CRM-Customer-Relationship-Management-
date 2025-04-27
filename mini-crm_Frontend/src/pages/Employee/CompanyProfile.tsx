import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import API from '../../services/api';

const CompanyProfile = () => {
  const [company, setCompany] = useState<any>(null);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/employer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data.company);
    } catch (err) {
      console.error('Error loading company profile', err);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  if (!company) {
    return <Typography>Loading company profile...</Typography>;
  }

  return (
    <div className="right-content">
    <Box>
      <Paper elevation={5} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(8px)', bgcolor: 'rgba(255,255,255,0.8)' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={company.logo || undefined}
              alt={company.name}
              sx={{
                width: 140,
                height: 140,
                margin: '0 auto',
                bgcolor: 'primary.main',
              }}
            >
              {!company.logo && <BusinessIcon sx={{ fontSize: 50 }} />}
            </Avatar>
            <Typography variant="h5" mt={2}>{company.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {company.email}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              href={company.website}
              target="_blank"
            >
              View Website
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h5" gutterBottom>
              Company Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Name:</Typography>
                <Typography>{company.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography>{company.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Phone:</Typography>
                <Typography>{company.phone || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Website:</Typography>
                <Typography component="a" href={company.website} target="_blank" rel="noopener noreferrer" color="primary">
                  {company.website}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description:</Typography>
                <Typography>{company.description || 'No description provided.'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Created on:</Typography>
                <Typography>{new Date(company.created_at).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Updated on:</Typography>
                <Typography>{new Date(company.updated_at).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
    </div>
  );
};

export default CompanyProfile;
