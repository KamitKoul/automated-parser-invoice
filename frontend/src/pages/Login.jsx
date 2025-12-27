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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/dashboard";
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
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
          Automate your document processing
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
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to continue
        </Typography>

        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Logging in...' : 'Sign In'}
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" fontWeight={600} underline="hover">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}