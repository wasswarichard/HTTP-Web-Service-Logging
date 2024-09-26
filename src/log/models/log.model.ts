import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table
export class Log extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp: Date;

  @Column({
    type: DataType.ENUM('info', 'warning', 'error'),
    allowNull: false,
  })
  level: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  containsLocalhostUrls: boolean;
}
