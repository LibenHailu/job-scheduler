import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('commands')
export class CommandEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  type: string;

  // @Column('uuid')
  // agentId: string;
}
