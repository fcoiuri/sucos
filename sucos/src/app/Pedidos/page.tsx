'use client';
import * as React from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import withAuth from '../withAuth';
import { StyledButton } from '@/src/components/StyledButton';
import styles from './Pedidos.module.css';
import { format } from 'date-fns';
import { Pedido } from '@/src/interfaces/pedido.interface';
import NovoPedido from '@/src/components/NovoPedido';
import { toast, ToastContainer } from 'react-toastify';
import AlertDialog from '@/src/components/AlertDialog';

const Pedidos = () => {
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [open, setOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [pedidoIdToCancel, setPedidoIdToCancel] = React.useState<number | null>(
    null
  );
  const [pedidoToEdit, setPedidoToEdit] = React.useState<Pedido | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const fetchPedidos = async () => {
    try {
      if (!token) {
        throw new Error('Token não encontrado. Usuário não autenticado.');
      }

      const response = await fetch(`${process.env.BASE_URL}pedidos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }

      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  React.useEffect(() => {
    fetchPedidos();
  }, [token]);

  const handleClose = () => {
    setOpen(false);
    setPedidoToEdit(null);
  };

  const getStatus = (st: number): string => {
    const status: Record<number, string> = {
      1: 'Em preparação',
      2: 'Misturando',
      3: 'Pronto para retirada',
    };

    return status[st];
  };

  const statusStyle = (status: number): string => {
    const colors: Record<number, string> = {
      1: '#fff3cd',
      2: '#cce5ff',
      3: '#d4edda',
    };

    return colors[status];
  };

  const handleAlertOpen = (id: number) => {
    setPedidoIdToCancel(id);
    setAlertOpen(true);
  };

  const handleAlertClose = () => setAlertOpen(false);

  const handleCancel = async () => {
    if (pedidoIdToCancel !== null) {
      try {
        const response = await fetch(
          `${process.env.BASE_URL}pedidos/${pedidoIdToCancel}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          toast.error('Erro ao cancelar o pedido');
        }

        toast.success('Pedido cancelado com sucesso');
        fetchPedidos();
      } catch (error) {
        toast.error('Erro ao cancelar o pedido');
      }
    }
  };

  const handleEdit = (pedido: Pedido) => {
    setPedidoToEdit(pedido);
    setOpen(true);
  };

  const handleNewOrder = () => {
    setOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return;
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm:ss');
  };

  return (
    <Container>
      <ToastContainer />
      <Typography variant="h4" component="h1">
        Seus Pedidos
      </Typography>

      <StyledButton
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleNewOrder}
      >
        Realizar Novo Pedido
      </StyledButton>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table aria-label="Pedidos de Sucos">
          <TableHead>
            <TableRow>
              <TableCell>Sabor</TableCell>
              <TableCell>Personalização</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.sabor}</TableCell>
                <TableCell>{pedido.personalizacao}</TableCell>
                <TableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusStyle(pedido.status),
                        marginRight: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {getStatus(pedido.status)}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  {formatDate(pedido.dataHoraRetirada) || 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(pedido)}
                    disabled={pedido.status === 3}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleAlertOpen(pedido.id)}
                    disabled={pedido.status === 3}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <NovoPedido
        open={open}
        handleClose={handleClose}
        refetchPedidos={fetchPedidos}
        pedido={pedidoToEdit}
      />

      <AlertDialog
        open={alertOpen}
        handleClose={handleAlertClose}
        handleConfirm={handleCancel}
      />
    </Container>
  );
};

export default withAuth(Pedidos);
