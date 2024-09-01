import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sabores')
export class Sabor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;
}
