import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('opcoes_personalizacao')
export class OpcaoPersonalizacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;
}
