import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, TableSortLabel, Box, Pagination,
  Breadcrumbs, Link, TextField, Avatar, Tooltip
} from '@mui/material';
import API from '../../services/api';

interface Colleague {
  id: number;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  birth_date: string;
  role: string;
}

type Order = 'asc' | 'desc';
type SortKey = keyof Colleague;

const ColleagueTable: React.FC = () => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<Order>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 5;

  const fetchColleagues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/employer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColleagues(response.data.colleagues || []);
    } catch (error) {
      console.error('Error fetching colleagues', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleagues();
  }, []);

  const handleSort = (col: SortKey) => {
    const isAsc = sortBy === col && sortDirection === 'asc';
    setSortBy(col);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const filteredColleagues = colleagues.filter((colleague) =>
    colleague.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colleague.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colleague.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedColleagues = [...filteredColleagues].sort((a, b) => {
    const aValue = a[sortBy] ?? '';
    const bValue = b[sortBy] ?? '';
    return (aValue < bValue ? -1 : 1) * (sortDirection === 'asc' ? 1 : -1);
  });

  const paginatedColleagues = sortedColleagues.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        <CircularProgress /> Loading colleagues...
      </Typography>
    );
  }

  return (
    <div className="right-content">
    <Box sx={{ maxWidth: '95%', mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        👥 Employee Management
      </Typography>

      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="#">
          Dashboard
        </Link>
        <Typography color="text.primary">Employees</Typography>
      </Breadcrumbs>

      <TextField
        label="Search for an employee"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {(['name', 'email', 'address', 'phone_number', 'birth_date'] as SortKey[]).map((col) => (
                  <TableCell key={col}>
                    <TableSortLabel
                      active={sortBy === col}
                      direction={sortDirection}
                      onClick={() => handleSort(col)}
                    >
                      {col.replace('_', ' ').toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedColleagues.length > 0 ? (
                paginatedColleagues.map((colleague) => (
                  <TableRow key={colleague.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 30, height: 30 }}>
                          {colleague.name.charAt(0)}
                        </Avatar>
                        {colleague.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Professional email address">
                        <span>{colleague.email}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{colleague.address}</TableCell>
                    <TableCell>{colleague.phone_number}</TableCell>
                    <TableCell>{formatDate(colleague.birth_date)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Pagination
        count={Math.ceil(filteredColleagues.length / rowsPerPage)}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
    </div>
  );
};

export default ColleagueTable;
