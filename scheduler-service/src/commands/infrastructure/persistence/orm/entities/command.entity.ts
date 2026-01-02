import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('commands')
export class CommandEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column()
  shard: number;

  @Column({ default: false })
  isQueued: boolean;

  @Column({ nullable: true })
  scheduledTime?: number;

  @Column({ nullable: true })
  url?: string;
}
