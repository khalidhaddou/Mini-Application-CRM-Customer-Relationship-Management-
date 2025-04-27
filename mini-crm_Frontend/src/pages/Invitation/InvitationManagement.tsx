import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Grid,
  InputAdornment,
  Modal,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import API from "../../services/api";

interface Invitation {
  id: string;
  name: string;
  email: string;
  companyId: string;
  status: "pending" | "accepted" | "rejected";
}

const InvitationManagement: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newInvitationName, setNewInvitationName] = useState("");
  const [newInvitationEmail, setNewInvitationEmail] = useState("");
  const [newInvitationCompanyId, setNewInvitationCompanyId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "pending" | "accepted" | "rejected">("All");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");  // Store the message to display
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");  // Severity for the snackbar
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);

  // ▶️ Fetch invitations from API
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await API.get("/invitations");
        const fetchedInvitations = response.data.map((inv: any) => ({
          ...inv,
          status: inv.status as "pending" | "accepted" | "rejected",
        }));
        setInvitations(fetchedInvitations);
      } catch (err) {
        console.error("Error loading invitations:", err);
        setError("Unable to load invitations.");
        setSnackbarMessage("Unable to load invitations.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchInvitations();
  }, []);

  // ▶️ Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await API.get("/companies");
        setCompanies(response.data);
      } catch (err) {
        console.error("Error loading companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewInvitationName("");
    setNewInvitationEmail("");
    setNewInvitationCompanyId("");
  };

  const isEmailUnique = (email: string) => !invitations.some(inv => inv.email === email);

  const handleAddInvitation = async () => {
    if (!newInvitationName || !newInvitationEmail || !newInvitationCompanyId) {
      setError("Name, email, and company are required.");
      setSnackbarMessage("Name, email, and company are required.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isEmailUnique(newInvitationEmail)) {
      setError("The email already exists.");
      setSnackbarMessage("The email already exists.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const adminId = user.id;
      console.log(adminId);
      const response = await API.post("/invitations", {
        name: newInvitationName,
        email: newInvitationEmail,
        company_id: newInvitationCompanyId,
        user_id: adminId,
      });

      const newInvitation = {
        ...response.data,
        status: response.data.status as "pending" | "accepted" | "rejected",
      };

      setInvitations([...invitations, newInvitation]);
      handleCloseModal();
      
      // Success message
      setSnackbarMessage("Invitation sent successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

    } catch (err) {
      setError("Error sending the invitation.");
      setSnackbarMessage("Error sending the invitation.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      const updatedInvitations = invitations.map((inv) =>
        inv.id === id && inv.status === "pending"
          ? { ...inv, status: "rejected" as "rejected" }
          : inv
      );
      setInvitations(updatedInvitations);

      await API.put(`/invitations/${id}`);
      
      // Success message
      setSnackbarMessage("Invitation cancelled successfully.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Error cancelling invitation:", err);
      setError("Error cancelling the invitation.");
      setSnackbarMessage("Error cancelling the invitation.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Company", "Status"];
    const rows = invitations.map((inv) => [inv.id, inv.name, inv.email, inv.companyId, inv.status]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invitations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchSearch =
      (inv.name && inv.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.email && inv.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === "All" || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <Box className="right-content">
      <Typography variant="h6" gutterBottom>Invitation Management</Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            SelectProps={{ native: true }}
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </TextField>
        </Grid>

        <Grid item xs={6} md={1.5}>
          <Button fullWidth variant="contained" onClick={handleOpenModal}>Invite</Button>
        </Grid>

        <Grid item xs={6} md={1.5}>
          <Button fullWidth variant="outlined" onClick={exportCSV}>Export</Button>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Typography variant="body2">📨 Invitations: {invitations.length}</Typography>
        <Typography variant="body2">🕒 Pending: {invitations.filter(i => i.status === "pending").length}</Typography>
        <Typography variant="body2">✅ Accepted: {invitations.filter(i => i.status === "accepted").length}</Typography>
        <Typography variant="body2">❌ Rejected: {invitations.filter(i => i.status === "rejected").length}</Typography>
      </Box>

      {filteredInvitations.map((inv) => (
        <Card key={inv.id} sx={{ mb: 2 }}>
          <CardHeader
            title={inv.name}
            subheader={inv.email}
            action={
              inv.status === "pending" ? (
                <Button size="small" variant="outlined" color="error" onClick={() => handleCancelInvitation(inv.id)}>
                  Cancel
                </Button>
              ) : (
                <Chip
                  label={inv.status === "accepted" ? "Accepted" : "Rejected"}
                  color={inv.status === "accepted" ? "success" : "error"}
                />
              )
            }
          />
        </Card>
      ))}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 4, backgroundColor: "white", maxWidth: 400, mx: "auto", mt: "15%", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>New Invitation</Typography>
          <TextField fullWidth label="Employee Name" value={newInvitationName} onChange={(e) => setNewInvitationName(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Employee Email" type="email" value={newInvitationEmail} onChange={(e) => setNewInvitationEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            select
            label="Select Company"
            value={newInvitationCompanyId}
            onChange={(e) => setNewInvitationCompanyId(e.target.value)}
            sx={{ mb: 2 }}
            SelectProps={{ native: true }}
          >
            <option value="">Choose a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </TextField>
          <Button fullWidth variant="contained" onClick={handleAddInvitation}>Send Invitation</Button>
        </Box>
      </Modal>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default InvitationManagement;
