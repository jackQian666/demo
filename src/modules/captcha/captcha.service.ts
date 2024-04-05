import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * 校验验证码
   * @param captchaId 验证码id
   * @param captcha 验证码
   */
  async checkImgCaptcha(captchaId: string, captcha: string) {
    const cache_captcha = await this.cache.get('member_captcha:' + captchaId);
    console.log(captcha, cache_captcha);
    if (cache_captcha !== captcha) {
      throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE);
    }
    //验证通过之后使验证码失效
    await this.cache.del('member_captcha:' + captchaId);
  }
}
