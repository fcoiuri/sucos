import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sabor: string;

  @Column()
  personalizacao: string;

  @Column()
  maquina: number;

  @Column({ type: 'datetime' })
  dataHoraRetirada: Date;

  @Column({ type: 'integer', default: 0 })
  status: number;

  @ManyToOne(() => User, (user) => user.pedidos)
  user: User;
}
