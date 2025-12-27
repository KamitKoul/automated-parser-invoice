import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { ColorModeContext } from '../App';

export default function Header({ onLogout }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Invoice Parser
          </Typography>

          <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/documents">Documents</Button>
          <Button color="inherit" component={RouterLink} to="/upload">Upload</Button>
          
          <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
