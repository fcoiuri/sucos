import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MaquinasService } from './maquinas.service';
import { Maquina } from './entities/maquina.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('maquinas')
@UseGuards(JwtAuthGuard)
export class MaquinasController {
  constructor(private readonly maquinasService: MaquinasService) {}

  @Get()
  findAll(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ): Maquina[] {
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);
    return this.maquinasService.findAll(userLatitude, userLongitude);
  }
}
