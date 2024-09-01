import { Module } from '@nestjs/common';
import { MaquinasController } from './maquinas.controller';
import { MaquinasService } from './maquinas.service';

@Module({
  controllers: [MaquinasController],
  providers: [MaquinasService],
})
export class MaquinasModule {}
