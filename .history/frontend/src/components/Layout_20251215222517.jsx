import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from './Header';

export default function Layout({ children }) {
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Box>
      <Header onLogout={logout} />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </Box>
  );
}
