import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isAuthPage) {
    return (
      <Box 
        component="main" 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Sidebar handles both Desktop (Permanent) and Mobile (Temporary) */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        onLogout={logout}
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - 72px)` }, // Subtract collapsed sidebar width
          display: 'flex',
          flexDirection: 'column',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(to right bottom, #f3f4f6, #f9fafb)' 
            : 'linear-gradient(to right bottom, #0f172a, #1e293b)',
        }}
      >
        {/* Mobile Menu Toggle */}
        <Box sx={{ display: { md: 'none' }, mb: 2 }}>
          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            edge="start" 
            onClick={() => setMobileOpen(true)}
            sx={{ bgcolor: 'white', boxShadow: 1, borderRadius: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Container maxWidth="xl" disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
