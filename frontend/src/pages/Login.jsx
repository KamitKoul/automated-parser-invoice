import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  InputAdornment,
  IconButton,
  Fade,
  Container,
  useTheme
} from '@mui/material';
import { 
  ReceiptLong, 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock 
} from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

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
    <Box 
      className="animated-bg"
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2
      }}
    >
      <Fade in timeout={800}>
        <Container maxWidth="xs">
          <Paper
            className={`glass-card ${theme.palette.mode === 'dark' ? 'dark-mode' : ''}`}
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(20px)',
            }}
            component="form"
            onSubmit={submitHandler}
          >
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: 'primary.main', 
                borderRadius: '50%', 
                mb: 2, 
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)' 
              }}
            >
              <ReceiptLong sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            
            <Typography component="h1" variant="h4" fontWeight={800} gutterBottom align="center" sx={{ color: 'text.primary' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Sign in to manage your invoices effortlessly.
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                py: 1.5, 
                fontSize: '1rem', 
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                boxShadow: '0 3px 5px 2px rgba(37, 99, 235, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #6d28d9 90%)',
                }
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {"Don't have an account? "}
                <span style={{ color: theme.palette.primary.main }}>Sign Up</span>
              </Link>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}