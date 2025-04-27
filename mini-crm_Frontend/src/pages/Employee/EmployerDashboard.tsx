import React, { useEffect, useState } from 'react';
import API from "../../services/api";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { Business, Group, Person } from '@mui/icons-material';

interface Colleague {
  id: number;
  name: string;
  email: string;
}

const EmployerDashboard = () => {
  const [employer, setEmployer] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);

  const fetchEmployerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/employer', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployer(response.data.employer);
      setCompany(response.data.company);
      setColleagues(response.data.colleagues);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchEmployerData();
  }, []);

  return (
    <div className="right-content">
      <Box p={4} >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: '#2C3E50' }}>
          Employer Dashboard
        </Typography>

        <Grid container spacing={4}>
          {employer && (
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: 6,
                backgroundColor: '#2196f3', 
                height: '100%',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-5px)',
                },
                transition: 'all 0.3s ease',
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#fff' }}><strong>Name:</strong> {employer.name}</Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Email:</strong> {employer.email}</Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Phone:</strong> {employer.phone_number}</Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Address:</strong> {employer.address}</Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Birth Date:</strong> {employer.birth_date}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {company && (
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: 6,
                backgroundColor: '#ff5722',  
                height: '100%',  
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-5px)',
                },
                transition: 'all 0.3s ease',
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={company.logo}
                      alt={company.name}
                      sx={{ width: 60, height: 60, mr: 2, borderRadius: '50%' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                      Company: {company.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#fff' }}><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{company.website}</a></Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Email:</strong> {company.email}</Typography>
                  <Typography sx={{ color: '#fff' }}><strong>Phone:</strong> {company.phone || 'Not Provided'}</Typography>
                  <Typography sx={{ color: '#fff', mt: 1 }}><strong>Description:</strong> {company.description}</Typography>
                  <Typography sx={{ color: '#fff', mt: 1 }} variant="body2" color="text.secondary">
                    🗓️ Created on: {new Date(company.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: 6,
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-5px)',
              },
              transition: 'all 0.3s ease',
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Group color="action" sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" >Colleagues</Typography>
                </Box>
                <List>
                  {colleagues.map((colleague) => (
                    <React.Fragment key={colleague.id}>
                      <ListItem >
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: '#00796b' }}>{colleague.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={colleague.name}
                          secondary={colleague.email}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EmployerDashboard;
