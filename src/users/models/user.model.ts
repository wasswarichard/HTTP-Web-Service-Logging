import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
}
