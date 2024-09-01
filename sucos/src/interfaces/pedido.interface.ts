export interface Pedido {
  id: number;
  sabor: string;
  personalizacao: string;
  maquina: number;
  dataHoraRetirada: string | null;
  status: number;
}
