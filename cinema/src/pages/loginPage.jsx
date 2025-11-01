import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import { AuthContext } from '../contexts/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = auth.login({ email, password });
    if (res.ok) {
      navigate('/movies/');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ color: 'white', p: 3, display: 'flex', justifyContent: 'center' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: 400 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Login</Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" type="submit">Login</Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
