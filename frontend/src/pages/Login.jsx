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
  Container,
  useTheme,
  Stack
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined,
  ReceiptLong
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
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'light' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              : 'none'
          }}
          component="form"
          onSubmit={submitHandler}
        >
          {/* Logo Area */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                p: 1, 
                bgcolor: 'primary.main', 
                borderRadius: 2, 
                display: 'flex', 
                color: 'white' 
              }}
            >
              <ReceiptLong fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Invoice AI
            </Typography>
          </Stack>
          
          <Typography component="h1" variant="h5" fontWeight={700} gutterBottom align="center" color="text.primary">
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 5 }}>
            Please enter your details to sign in.
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3 } 
            }}
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
                  <LockOutlined color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            sx={{ 
              py: 1.5, 
              fontSize: '0.95rem', 
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              bgcolor: 'text.primary',
              color: 'background.paper',
              '&:hover': {
                bgcolor: 'text.secondary',
              }
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>
              Don't have an account? <span style={{ fontWeight: 600 }}>Sign up</span>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}