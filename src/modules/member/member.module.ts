import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { CaptchaModule } from '~/modules/captcha/captcha.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), CaptchaModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
