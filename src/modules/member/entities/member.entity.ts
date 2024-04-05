import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, comment: '用户名' })
  username: string;

  @Column({ nullable: false, comment: '头像' })
  avatar: string;

  @Column({ nullable: false, comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '电子邮箱' })
  email: string;

  @Column({ nullable: true, comment: '手机号码' })
  phone: string;

  @Column({ nullable: true, comment: '微信' })
  weiXin: number;

  @Column({ nullable: true, comment: '昵称' })
  nickname: string;

  @Column({
    nullable: false,
    default: 0,
    comment: '是否身份证认证 0未认证 1已认证',
  })
  idCard: number;

  @Column({
    nullable: false,
    default: 0,
    comment: '是否营业执照认证 0未认证 1已认证',
  })
  businessLicense: number;

  @DeleteDateColumn({ nullable: false })
  deleteTime: Date;
}
