import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Stack,
} from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business'; // Company Icon
import API from "../../services/api";

type Company = {
  id: number;
  name: string;
  logo: string;
  website: string;
  email: string;
  phone: string | null;
  description: string;
  created_at: string;
  updated_at: string;
};

type Employee = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  address: string | null;
  phone_number: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
  is_verified: number;
  company_id: number | null;
  company: Company | null;
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name"); // New: sort field
  const [page, setPage] = useState<number>(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await API.get<Employee[]>("/admin/employee");

        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        setError("Error loading employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    let updatedEmployees = [...employees];

    // Search by employee name
    if (searchName) {
      updatedEmployees = updatedEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by company
    if (selectedCompany) {
      updatedEmployees = updatedEmployees.filter(
        (employee) => employee.company?.name === selectedCompany
      );
    }

    // Dynamic sorting
    updatedEmployees.sort((a, b) => {
      const fieldA = getFieldValue(a, sortField);
      const fieldB = getFieldValue(b, sortField);
      return fieldA.localeCompare(fieldB);
    });

    setFilteredEmployees(updatedEmployees);
    setPage(1);
  }, [searchName, selectedCompany, sortField, employees]);

  const getFieldValue = (employee: Employee, field: string) => {
    switch (field) {
      case "name":
        return employee.name || "";
      case "email":
        return employee.email || "";
      case "company":
        return employee.company?.name || "";
      default:
        return "";
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading)
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
      </Container>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueCompanies = Array.from(
    new Set(employees.map((e) => e.company?.name).filter((name) => name))
  ) as string[];

  return (
    <div className="right-content">
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>

      {/* Filter area */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} marginBottom={2}>
        {/* Search */}
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
        />

        {/* Filter by company */}
        <FormControl fullWidth>
          <InputLabel id="company-filter-label">Filter by company</InputLabel>
          <Select
            labelId="company-filter-label"
            value={selectedCompany}
            label="Filter by company"
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <MenuItem value="">All companies</MenuItem>
            {uniqueCompanies.map((companyName) => (
              <MenuItem key={companyName} value={companyName}>
                {companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort by field */}
        <FormControl fullWidth>
          <InputLabel id="sort-field-label">Sort by</InputLabel>
          <Select
            labelId="sort-field-label"
            value={sortField}
            label="Sort by"
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="company">Company</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.address ?? "Not provided"}</TableCell>
                <TableCell>{employee.phone_number ?? "Not provided"}</TableCell>
                <TableCell>{employee.birth_date ?? "Not provided"}</TableCell>
                <TableCell>
                  {employee.company ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {employee.company.name}
                    </Stack>
                  ) : (
                    "No company"
                  )}
                </TableCell>
                <TableCell>
                  {employee.is_verified ? (
                    <Chip label="Verified" color="success" size="small" />
                  ) : (
                    <Chip label="Not verified" color="error" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredEmployees.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </Container>
    </div>
  );
};

export default EmployeeList;
