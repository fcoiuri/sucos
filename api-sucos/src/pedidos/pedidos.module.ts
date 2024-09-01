import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
