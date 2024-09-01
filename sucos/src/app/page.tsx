'use client';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { StyledButton } from '../components/StyledButton';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    try {
      const response = await fetch(`${process.env.BASE_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error('Erro na autenticação');
      }

      const result = await response.text();

      localStorage.setItem('token', result);
      toast.success('Login efetuado com sucesso');
      router.push('/Pedidos');
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="E-mail"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <StyledButton type="submit" fullWidth variant="contained">
            Entrar
          </StyledButton>
          <Grid container>
            <Grid size="grow" sx={{ visibility: 'hidden' }}>
              <Link href="#" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid>
              <Link href="/SignUp" variant="body2">
                Não tem conta? Crie agora
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
