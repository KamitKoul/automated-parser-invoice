import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { Stack } from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      await API.post("/auth/register", form);
      toast.success("Account created successfully. Please login.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <ReceiptLong sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h3" fontWeight={700} color="primary.main">
          Invoice Parser AI
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Join us and simplify your workflow
        </Typography>
      </Stack>

      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 4, 
          width: '100%', 
          bgcolor: 'background.paper',
          borderRadius: 2
        }} 
        component="form" 
        onSubmit={submitHandler}
      >
        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your details below to get started
        </Typography>

        <TextField
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          fullWidth
          margin="normal"
        />

        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          color="primary" 
          disabled={loading} 
          fullWidth 
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/" fontWeight={600} underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}