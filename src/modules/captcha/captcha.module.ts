import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Module({
  controllers: [],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
