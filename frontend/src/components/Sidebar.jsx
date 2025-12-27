import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { 
  Dashboard as DashboardIcon, 
  Description as DescriptionIcon, 
  CloudUpload as UploadFileIcon,
  ReceiptLong,
  Logout,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/ColorModeContext';

const drawerWidth = 240;
const collapsedWidth = 72; // Width when collapsed

export default function Sidebar({ mobileOpen, onClose, onLogout }) {
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [hoverOpen, setHoverOpen] = useState(false);

  const isDesktopOpen = hoverOpen;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Upload Invoice', icon: <UploadFileIcon />, path: '/upload' },
  ];

  const drawerContent = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        overflowX: 'hidden' // Hide text when collapsed
      }}
    >
      {/* Brand Logo Area */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isDesktopOpen ? 'flex-start' : 'center',
          gap: 1.5, 
          minHeight: 64 
        }}
      >
        <ReceiptLong color="primary" sx={{ fontSize: 32 }} />
        {isDesktopOpen && (
          <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
            Invoice
          </Typography>
        )}
      </Box>
      <Divider />

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, px: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, display: 'block' }}>
              <ListItemButton 
                component={RouterLink} 
                to={item.path} 
                onClick={onClose}
                selected={isActive}
                sx={{
                  minHeight: 48,
                  justifyContent: isDesktopOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.lighter' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0,
                    mr: isDesktopOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? 'inherit' : 'text.secondary'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                  sx={{ opacity: isDesktopOpen ? 1 : 0, transition: 'opacity 0.2s' }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      
      {/* Dark Mode Toggle */}
      <Box sx={{ p: 1, pb: 0 }}>
        <ListItemButton 
          onClick={colorMode.toggleColorMode}
          sx={{
            minHeight: 48,
            justifyContent: isDesktopOpen ? 'initial' : 'center',
            px: 2.5,
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0,
              mr: isDesktopOpen ? 3 : 'auto',
              justifyContent: 'center',
              color: 'text.secondary' 
            }}
          >
             {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText 
            primary={theme.palette.mode === 'dark' ? "Light Mode" : "Dark Mode"} 
            sx={{ opacity: isDesktopOpen ? 1 : 0, transition: 'opacity 0.2s' }} 
          />
        </ListItemButton>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 1 }}>
        <ListItemButton 
          onClick={onLogout}
          sx={{
            minHeight: 48,
            justifyContent: isDesktopOpen ? 'initial' : 'center',
            px: 2.5,
            borderRadius: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0,
              mr: isDesktopOpen ? 3 : 'auto',
              justifyContent: 'center',
              color: 'error.main' 
            }}
          >
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontWeight: 600 }} 
            sx={{ opacity: isDesktopOpen ? 1 : 0, transition: 'opacity 0.2s' }} 
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: collapsedWidth }, // Occupy collapsed width in layout
        flexShrink: { md: 0 },
        zIndex: 1200 // Higher z-index to float over content
      }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (Hover Expandable) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: isDesktopOpen ? drawerWidth : collapsedWidth, 
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}