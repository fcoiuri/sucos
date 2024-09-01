'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { StyledButton } from '../StyledButton';
import { toast, ToastContainer } from 'react-toastify';
import { Pedido } from '@/src/interfaces/pedido.interface';
import { format } from 'date-fns';

interface INovoPedido {
  open: boolean;
  handleClose: () => void;
  refetchPedidos: () => void;
  pedido?: Pedido | null;
}

const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

const NovoPedido = ({
  open,
  handleClose,
  refetchPedidos,
  pedido,
}: INovoPedido) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [statusLocation, setStatusLocation] = useState<boolean>(false);
  const [sabores, setSabores] = useState<string[]>([]);
  const [opcoesPersonalizacao, setOpcoesPersonalizacao] = useState<string[]>(
    []
  );

  const [sabor, setSabor] = useState('');
  const [personalizacao, setPersonalizacao] = useState<string[]>([]);
  const [maquina, setMaquina] = useState('');
  const [dataHoraRetirada, setDataHoraRetirada] = useState('');
  const [maquinas, setMaquinas] = useState([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (pedido) {
      setSabor(pedido.sabor);
      setPersonalizacao(pedido.personalizacao?.split(', ') || []);
      setMaquina(pedido.maquina.toString());
      setDataHoraRetirada(formatDateForInput(pedido.dataHoraRetirada));
    }
  }, [pedido]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatusLocation(true);
    } else {
      setStatusLocation(false);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatusLocation(true);
        }
      );
    }
  };

  useEffect(() => {
    if (lat !== null && lng !== null) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.BASE_URL}maquinas?latitude=${lat}&longitude=${lng}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          setMaquinas(data);

          const responseSucos = await fetch(
            `${process.env.BASE_URL}pedidos/sucos`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const dataSucos = await responseSucos.json();

          console.log(dataSucos);
          setSabores(dataSucos.sabores);
          setOpcoesPersonalizacao(dataSucos.opcoesPersonalizacao);
        } catch (error) {
          console.error('Erro ao buscar máquinas:', error);
        }
      };
      fetchData();
    }
  }, [lat, lng, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const pedidoData = {
      sabor,
      personalizacao: personalizacao.join(', '),
      maquina,
      dataHoraRetirada,
      status: 1,
    };

    try {
      const method = pedido ? 'PATCH' : 'POST';
      const url = pedido
        ? `${process.env.BASE_URL}pedidos/${pedido.id}`
        : `${process.env.BASE_URL}pedidos/create`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });
      if (!response.ok) {
        toast.error('Erro na autenticação');
      }

      toast.success(
        `${pedido ? 'Pedido editado' : 'Pedido realizado'} com sucesso`
      );
      handleClose();
      setSabor('');
      setPersonalizacao([]);
      setMaquina('');
      setDataHoraRetirada('');
      refetchPedidos();
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {pedido ? 'Editar Pedido' : 'Novo Pedido'}
          </Typography>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="sabor-label">Sabor</InputLabel>
            <Select
              labelId="sabor-label"
              value={sabor}
              onChange={(e) => setSabor(e.target.value as string)}
              input={<OutlinedInput label="Sabor" />}
            >
              {sabores.map((sabor) => (
                <MenuItem key={sabor} value={sabor}>
                  {sabor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="personalizacao-label">Personalização</InputLabel>
            <Select
              labelId="personalizacao-label"
              multiple
              value={personalizacao}
              onChange={(e) => setPersonalizacao(e.target.value as string[])}
              input={<OutlinedInput label="Personalização" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {opcoesPersonalizacao.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={personalizacao.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="maquina-label">Máquina</InputLabel>
            <Select
              labelId="maquina-label"
              value={maquina}
              onChange={(e) => setMaquina(e.target.value as string)}
              input={<OutlinedInput label="Máquina" />}
            >
              {maquinas.map((m: any) => (
                <MenuItem key={m.id} value={m.id} sx={{ fontSize: '15px' }}>
                  Máquina {m.id}. Distância:{' '}
                  {(Math.round(m.distance * 100) / 100).toFixed(0)} km. Preparo:{' '}
                  {m.tempo_preparo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data e Hora de Retirada"
            type="datetime-local"
            value={dataHoraRetirada}
            onChange={(e) => setDataHoraRetirada(e.target.value)}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={statusLocation}
          >
            {pedido ? 'Editar Pedido' : 'Criar Pedido'}
          </StyledButton>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default NovoPedido;
