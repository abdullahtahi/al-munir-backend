import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserLevel, UserRole, ConsultantStatus } from '@/common/enums';
import { Banks } from '../bank/bank.entity';
import { Bonus } from '../bonuses/bonuses.entity';
// import { UserRole, UserLevel, Consultanttatus } from '../../common/enums';
// import { Admission } from './admission.model';
// import { Incentive } from './incentive.model';
// import { Transaction } from './transaction.model';

@Table({
  tableName: 'Consultant',
  timestamps: true,
})
export class Consultant extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cnic: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profile: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  paymentReceipt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: DataType.INTEGER,
    defaultValue: UserLevel.LEVEL_1,
  })
  level: UserLevel;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth: Date;


  @Column({
    type: DataType.TEXT,
    defaultValue: ConsultantStatus.PENDING,
  })
  status: ConsultantStatus;

  @ForeignKey(() => Consultant)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'fkSponsorId',
  })
  sponsorId: number;

  @ForeignKey(() => Banks)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'fkBankId',
  })
  bankId: number;

  @BelongsTo(() => Consultant, 'sponsorId')
  sponsor: Consultant;

  @HasMany(() => Consultant, 'sponsorId')
  downlines: Consultant[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  referralCode: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.00,
  })
  totalEarnings: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.00,
  })
  availableBalance: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0.00,
  })
  withdrawnAmount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  schoolAdmissions: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  academyAdmissions: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  technicalAdmissions: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 0.00,
  })
  completionRate: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  notificationPreferences: object;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emailVerifiedAt: Date;


  // @HasMany(() => Admission)
  // admissions: Admission[];

  // @HasMany(() a=> Incentive)
  // incentives: Incentive[];

  // @HasMany(() => Transaction)
  // transactions: Transaction[];
  @BelongsTo(() => Banks)
  Bank: Banks;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: Consultant) {
    if (user.changed('password')) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      user.password = await bcrypt.hash(user.password, saltRounds);
    }
  }

  @BeforeCreate
  static generateReferralCode(user: Consultant) {
    if (!user.referralCode) {
      user.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get totalAdmissions(): number {
    return this.schoolAdmissions + this.academyAdmissions + this.technicalAdmissions;
  }

  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
