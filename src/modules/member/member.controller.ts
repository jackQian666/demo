import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { QueryMemberDto } from './dto/query-member-dto';
import { LoginMemberDto } from './dto/login-member-dto';
import { BizException } from '~/common/exceptions/biz.exception';
import SvgCaptcha from 'svg-captcha';
import { isEmpty } from 'lodash';
import { generateUUID } from '~/utils/tool.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Public } from '~/common/decorators/public.decorator';

@Controller('/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Get('/captcha')
  async captcha(
    @Param('width') width: number,
    @Param('height') height: number,
  ) {
    const svg = SvgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(width) ? 100 : width,
      height: isEmpty(height) ? 50 : height,
      charPreset: '1234567890',
    });

    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: generateUUID(),
    };

    await this.cacheManager.set('member_captcha:' + result.id, svg.text, 6000);

    return result;
  }

  @Post('/register')
  register(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.register(createMemberDto);
  }

  @Post('/login')
  login(@Body() loginMemberDto: LoginMemberDto) {
    return this.memberService.login(loginMemberDto);
  }

  @Get('/list')
  findAll(@Query() queryMember: QueryMemberDto) {
    return this.memberService.findAll(queryMember);
  }

  @Get('/666')
  test() {
    throw new BizException('1250:出错了');
    // return '666';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
