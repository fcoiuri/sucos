'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { StyledButton } from '@/src/components/StyledButton';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

const SignUp = () => {
  const [optPayment, setOptPayment] = React.useState('');

  const router = useRouter();

  const handleChangeOptPayment = (event: SelectChangeEvent) => {
    setOptPayment(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    const name = data.get('name');
    const address = data.get('address');
    const opt_payment = Number(optPayment);

    try {
      const response = await fetch(`${process.env.BASE_URL}auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          address,
          opt_payment,
        }),
      });
      if (!response.ok) {
        throw new Error('Erro na autenticação');
      }

      toast.success('Conta criada com sucesso');
      router.push('/');
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
          Criar conta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome"
                name="name"
                autoComplete="name"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                name="address"
                label="Endereço"
                id="address"
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Opção de pagamento
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="opt_payment"
                  value={optPayment}
                  label="Opção de pagamento"
                  onChange={handleChangeOptPayment}
                >
                  <MenuItem value={1}>Dinheiro</MenuItem>
                  <MenuItem value={2}>Crédito</MenuItem>
                  <MenuItem value={3}>Débito</MenuItem>
                  <MenuItem value={4}>Pix</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                autoComplete="given-name"
                name="username"
                required
                fullWidth
                id="username"
                label="E-mail"
                autoFocus
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Criar conta
          </StyledButton>
          <Grid container justifyContent="flex-end">
            <div>
              <Link href="/" variant="body2">
                Já tem uma conta? Faça o login
              </Link>
            </div>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
