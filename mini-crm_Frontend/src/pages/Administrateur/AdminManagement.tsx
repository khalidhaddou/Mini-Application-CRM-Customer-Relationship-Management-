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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import API from "../../services/api";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [formData, setFormData] = useState<Omit<Admin, "id">>({
    name: "",
    email: "",
    role: "admin",
  });

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/admins");
      setAdmins(res.data);
    } catch (error) {
      console.error("Error loading admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenModal = (admin: Admin | null = null) => {
    if (admin) {
      setIsEditing(true);
      setSelectedAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      setIsEditing(false);
      setFormData({ name: "", email: "", role: "admin" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async () => {
    try {
      await API.post("/admins", formData);
      fetchAdmins();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleEditAdmin = async () => {
    if (selectedAdmin) {
      try {
        await API.put(`/admins/${selectedAdmin.id}`, formData);
        fetchAdmins();
        handleCloseModal();
      } catch (error) {
        console.error("Error editing admin:", error);
      }
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await API.delete(`/admins/${id}`);
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="right-content">
      <Typography variant="h6" gutterBottom>
        Admin Management
      </Typography>

      <Breadcrumbs separator="•" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="#">
          Dashboard
        </Link>
        <Typography color="text.primary">Admins</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Admin List</Typography>
          <Button variant="contained" onClick={() => handleOpenModal()}>
            Add Admin
          </Button>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search an admin..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(admin)}>Edit</Button>
                    <Button color="error" onClick={() => handleDeleteAdmin(admin.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
            width: 400,
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEditing ? "Edit Admin" : "Add Admin"}
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
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={isEditing ? handleEditAdmin : handleAddAdmin}
              variant="contained"
            >
              {isEditing ? "Edit" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminManagement;
