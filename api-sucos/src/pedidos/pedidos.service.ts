import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoStatus } from './pedidoStatus.enum';
import { User } from 'src/auth/entities/user.entity';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
  ) {}

  private readonly sabores = [
    'Laranja',
    'Limão',
    'Morango',
    'Manga',
    'Cajá',
    'Maracujá',
    'Caju',
    'Abacaxi',
  ];

  private readonly opcoesPersonalizacao = [
    'Sem açúcar',
    'Com gelo',
    'Sem água',
    'Extra gelo',
    'Com leite',
    'Com leite condesado',
  ];

  private readonly maquinas = [
    { id: 1, latitude: -23.55052, longitude: -46.633308, status: 'disponível' },
    {
      id: 2,
      latitude: -22.906847,
      longitude: -43.172896,
      status: 'manutenção',
    },
    {
      id: 3,
      latitude: -19.916681,
      longitude: -43.934493,
      status: 'disponível',
    },
  ];

  async findAll(userId: number): Promise<Pedido[]> {
    return this.pedidosRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(
    pedidoData: Partial<Pedido>,
    req: RequestWithUser,
  ): Promise<Pedido> {
    const user = req.user as User;

    if (!this.sabores.includes(pedidoData.sabor)) {
      throw new BadRequestException(`Sabor inválido: ${pedidoData.sabor}`);
    }

    const personalizacoes = pedidoData.personalizacao
      ?.split(',')
      .map((p) => p.trim());
    for (const p of personalizacoes) {
      if (!this.opcoesPersonalizacao.includes(p)) {
        throw new BadRequestException(`Personalização inválida: ${p}`);
      }
    }

    const maquinaExistente = this.maquinas.find(
      (maquina) => maquina.id === pedidoData.maquina,
    );
    if (!maquinaExistente) {
      throw new BadRequestException(`Máquina inválida: ${pedidoData.maquina}`);
    }

    const pedido = this.pedidosRepository.create({
      ...pedidoData,
      status: PedidoStatus.PENDENTE,
      user,
    });

    const savedPedido = await this.pedidosRepository.save(pedido);
    this.fabricarSuco(savedPedido.id);

    return savedPedido;
  }

  async update(id: number, updates: Partial<Pedido>): Promise<Pedido> {
    await this.pedidosRepository.update(id, updates);

    const updatedPedido = await this.pedidosRepository.findOneBy({ id });

    if (
      updatedPedido &&
      updatedPedido.status !== PedidoStatus.PRONTO_PARA_RETIRADA
    ) {
      this.fabricarSuco(updatedPedido.id);
    }

    return updatedPedido;
  }

  async remove(id: number): Promise<void> {
    await this.pedidosRepository.delete(id);
  }

  findAllSabores(): string[] {
    return this.sabores;
  }

  findAllOpcoesPersonalizacao(): string[] {
    return this.opcoesPersonalizacao;
  }

  async atualizarStatus(pedidoId: number, status: PedidoStatus): Promise<void> {
    await this.pedidosRepository.update(pedidoId, { status });
  }

  findAllSucos(): { sabores: string[]; opcoesPersonalizacao: string[] } {
    return {
      sabores: this.sabores,
      opcoesPersonalizacao: this.opcoesPersonalizacao,
    };
  }

  async fabricarSuco(pedidoId: number): Promise<void> {
    await this.atualizarStatus(pedidoId, PedidoStatus.EM_PREPARACAO);

    setTimeout(async () => {
      await this.atualizarStatus(pedidoId, PedidoStatus.MISTURANDO);
    }, 10000);

    setTimeout(async () => {
      await this.atualizarStatus(pedidoId, PedidoStatus.PRONTO_PARA_RETIRADA);
    }, 20000);
  }

  async findOne(id: number): Promise<Pedido> {
    return this.pedidosRepository.findOneBy({ id });
  }
}
