import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import API from "../../services/api"; // Adjust according to your paths
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileAdmin = () => {
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [userId, setUserId] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // 🧲 Fetch user data
  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setFullName(data.name);
        setUserEmail(data.email);
        setPhone(data.phone_number);
        setBirthDate(data.birth_date);
        setUserId(data.id);
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("Failed to load profile.");
      }
    };

    fetchEmployerData();
  }, []);

  // ✅ Update profile
  const handleUpdateUser = async () => {
    if (!fullName || !userEmail || !phone || !birthDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/users/${userId}`,
        {
          name: fullName,
          email: userEmail,
          phone_number: phone,
          birth_date: birthDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  // ✅ Update password
  const handlePasswordUpdate = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPwd !== confirmPwd) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await API.put(
        `/users/${userId}/password`,
        {
          current_password: currentPwd,
          new_password: newPwd,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password updated successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const serverError = error as { response: { data: { message: string }, status: number } };
        const { message } = serverError.response.data;

        if (message === "Mot de passe actuel est incorrect") {
          toast.error("Current password is incorrect.");
        } else if (message === "Le mot de passe est trop faible") {
          toast.error("The new password is too weak.");
        } else {
          toast.error(message || "Error while changing password.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="right-content">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Profile Settings
        </Typography>

        {/* 📄 Personal information form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🧑 Edit My Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateUser}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 🔒 Password form */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            🔐 Change Password
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePasswordUpdate}
              >
                Update Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* 🔔 Notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProfileAdmin;
