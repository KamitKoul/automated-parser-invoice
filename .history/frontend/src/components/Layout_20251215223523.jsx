import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onLogout={logout} />

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, md: 3 }, py: 3 }}>
        <Toolbar sx={{ display: { md: 'none' } }}>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} aria-label="open drawer">
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
