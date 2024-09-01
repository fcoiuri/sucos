import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OptPagamento } from '../enums/optPagamento.enum';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'integer' })
  opt_payment: OptPagamento;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.password);
  }

  @OneToMany(() => Pedido, (pedido) => pedido.user)
  pedidos: Pedido[];
}
