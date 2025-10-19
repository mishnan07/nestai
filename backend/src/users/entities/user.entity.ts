import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  LAWYER = 'lawyer',
  STUDENT = 'student',
  CITIZEN = 'citizen',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cognitoSub: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role: UserRole;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}