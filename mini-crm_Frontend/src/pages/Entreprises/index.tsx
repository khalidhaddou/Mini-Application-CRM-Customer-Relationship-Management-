import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  Modal,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from "@mui/icons-material/Search";
import { Edit } from "@mui/icons-material";
import moment from "moment";
import API from "../../services/api";

type Company = {
  id: string;
  name: string;
  logo: string;
  website: string;
  email: string;
  description: string;
  phone: string;
  created_at: string;
};

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Omit<Company, "id">>({
    name: "",
    logo: "",
    website: "",
    email: "",
    description: "",
    phone: "",
    created_at: "",
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<keyof Company>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchCompanies = async () => {
    try {
      const res = await API.get("/companies");
      setCompanies(res.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while loading companies.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment(company.created_at).format("DD/MM/YYYY").includes(searchQuery)
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const keyA = a[sortKey];
    const keyB = b[sortKey];

    if (keyA < keyB) return sortDirection === 'asc' ? -1 : 1;
    if (keyA > keyB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOpenModal = (company: Company | null = null) => {
    if (company) {
      setIsEditing(true);
      setSelectedCompany(company);
      setFormData({
        name: company.name,
        logo: company.logo,
        website: company.website,
        email: company.email,
        description: company.description,
        phone: company.phone,
        created_at: company.created_at,
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        logo: "",
        website: "",
        email: "",
        description: "",
        phone: "",
        created_at: moment().format(),
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = async () => {
    try {
      const companyData = { ...formData, creationDate: moment().format() };
      await API.post("/companies", companyData);
      fetchCompanies();
      handleCloseModal();
      setSnackbar({
        open: true,
        message: "Company successfully added.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while adding the company.",
        severity: "error",
      });
    }
  };

  const handleEditCompany = async () => {
    if (selectedCompany) {
      try {
        await API.put(`/companies/${selectedCompany.id}`, formData);
        fetchCompanies();
        handleCloseModal();
        setSnackbar({
          open: true,
          message: "Company successfully updated.",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error while updating the company.",
          severity: "error",
        });
      }
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await API.delete(`/companies/${id}`);
      fetchCompanies();
      setSnackbar({
        open: true,
        message: "Company successfully deleted.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error while deleting the company.",
        severity: "error",
      });
    }
  };

  return (
    <div className="right-content">
      <Typography variant="h6" gutterBottom>
        Company Management
      </Typography>

      <Breadcrumbs separator="•" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="#">
          Dashboard
        </Link>
        <Typography color="text.primary">Companies</Typography>
      </Breadcrumbs>

      <Box sx={{ padding: 4, backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Company List</Typography>
          <Button variant="contained" onClick={() => handleOpenModal()}>Add Company</Button>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search for a company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-key-label">Sort By</InputLabel>
              <Select
                labelId="sort-key-label"
                value={sortKey}
                label="Sort By"
                onChange={(e) => setSortKey(e.target.value as keyof Company)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="creationDate">Creation Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-direction-label">Sort Direction</InputLabel>
              <Select
                labelId="sort-direction-label"
                value={sortDirection}
                label="Sort Direction"
                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Creation Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{moment(company.created_at).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(company)}><Edit /></Button>
                    <Button onClick={() => handleDeleteCompany(company.id)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            {/* Modal for adding or editing */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 500, // Augmenter la largeur du modal
            maxHeight: '90vh', // Ajouter une hauteur maximale pour s'assurer que le modal est contenu à l'écran
            overflowY: 'auto', // Ajouter un défilement vertical si le contenu dépasse la hauteur
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEditing ? "Edit Company" : "Add Company"}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Logo URL"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={isEditing ? handleEditCompany : handleAddCompany}
              variant="contained"
            >
              {isEditing ? "Edit" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>

      </Box>
    </div>
  );
};

export default CompanyManagement;
