// src/maquinas/entities/maquina.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Maquina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  tempo_preparo: string;
}
