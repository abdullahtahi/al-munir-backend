export class Branch {}
import { IsEmail } from 'class-validator';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'WebsiteSetting',
  timestamps: false,
  paranoid: true,
})
export class WebsiteSetting extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  vision: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  phone: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string;

  @Column(DataType.STRING)
  facebookLink: string;

  @Column(DataType.STRING)
  youtubeLink: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  sucessStories: string;

  @Column(DataType.STRING)
  trustedTutors: string;

  @Column(DataType.STRING)
  schedule: string;
  
  @Column(DataType.STRING)
  courses: string;

}

