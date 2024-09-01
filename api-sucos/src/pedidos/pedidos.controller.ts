import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PedidoStatus } from './pedidoStatus.enum';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  findAll(@Req() req: RequestWithUser): Promise<Pedido[]> {
    const userId = req.user.id;
    return this.pedidosService.findAll(userId);
  }

  // @Get()
  // findAll(@Req() req: Request): Promise<Pedido[]> {
  //   // const userId = req.user;
  //   console.log(userId);
  //   const userId = req.user.id;
  //   return;
  //   // return this.pedidosService.findAll(userId);
  // }

  @Post('create')
  create(@Body() pedidoData: Partial<Pedido>, @Req() req: RequestWithUser) {
    return this.pedidosService.create(pedidoData, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updates: Partial<Pedido>,
  ): Promise<Pedido> {
    return this.pedidosService.update(id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.pedidosService.remove(id);
  }

  @Get('sucos')
  findAllSucos(): { sabores: string[]; opcoesPersonalizacao: string[] } {
    return this.pedidosService.findAllSucos();
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: number): Promise<{ status: string }> {
    const pedido = await this.pedidosService.findOne(id);
    return { status: PedidoStatus[pedido.status] };
  }
}
