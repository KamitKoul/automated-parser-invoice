import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/dashboard" onClick={onClose}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/documents" onClick={onClose}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="Documents" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/upload" onClick={onClose}>
            <ListItemIcon><UploadFileIcon /></ListItemIcon>
            <ListItemText primary="Upload" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
