import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { QueryMemberDto } from './dto/query-member-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { FindManyOptions, FindOperator, Like, Repository } from 'typeorm';
import { LoginMemberDto } from './dto/login-member-dto';
import { CaptchaService } from '~/modules/captcha/captcha.service';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorEnum } from '~/constants/error-code.constant';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '~/constants/system.constant';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private readonly captchaService: CaptchaService,
    private readonly jwtService: JwtService,
  ) {}

  register(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
  }

  async login(loginMemberDto: LoginMemberDto) {
    const { username, email, phone, captcha, captchaId, password } =
      loginMemberDto;

    if (captcha && captchaId) {
      await this.captchaService.checkImgCaptcha(captchaId, captcha);
    }

    let usernameResult: Member = null;
    let emailResult: Member = null;
    let phoneResult: Member = null;
    let lastResult: Member = null;

    if (username) {
      usernameResult = await this.memberRepository.findOne({
        where: { username: username },
      });
    }

    if (email) {
      emailResult = await this.memberRepository.findOne({
        where: { email: email },
      });
    }

    if (phone) {
      phoneResult = await this.memberRepository.findOne({
        where: { phone: phone },
      });
    }

    if (!usernameResult && !emailResult && !phoneResult) {
      throw new BusinessException(ErrorEnum.MEMBER_NOT_EXIST);
    }

    if (usernameResult) {
      lastResult = usernameResult;
    }

    if (emailResult) {
      lastResult = emailResult;
    }

    if (phoneResult) {
      lastResult = phoneResult;
    }

    if (lastResult != null && lastResult.password === password) {
      //置空密码
      const { password, ...result } = lastResult;

      //生成token
      const payload = {
        id: result.id,
        username: result.username,
        phone: result.phone,
      };

      const token = await this.jwtService.signAsync(payload);

      //返回结果
      return {
        token: token,
        memberInfo: result,
      };
    }

    throw new BusinessException(ErrorEnum.MEMBER_PASSWORD_ERROR); //抛出密码错误异常
  }

  async findAll(queryMember: QueryMemberDto) {
    const queryWhere = {} as {
      username: FindOperator<string>;
      nickname: string;
      email: string;
      phone: string;
      weiXin: number;
      businessLicense: number;
      idCard: number;
    };
    const queryOption = {} as FindManyOptions;
    // {username?:string,nickname:string,email?:string,phone?:string,weiXin?:number,businessLicense?:number,idCard?:number}
    if (queryMember.username) {
      queryWhere.username = Like(`%${queryMember.username}%`);
    }
    if (queryMember.nickname) {
      queryWhere.nickname = queryMember.nickname;
    }

    if (queryMember.email) {
      queryWhere.email = queryMember.email;
    }
    if (queryMember.phone) {
      queryWhere.phone = queryMember.phone;
    }
    if (queryMember.weiXin != null || queryMember.weiXin != undefined) {
      queryWhere.weiXin = queryMember.weiXin;
    }
    if (
      queryMember.businessLicense != null ||
      queryMember.businessLicense != undefined
    ) {
      queryWhere.businessLicense = queryMember.businessLicense;
    }
    if (queryMember.idCard != null || queryMember.idCard != undefined) {
      queryWhere.idCard = queryMember.idCard;
    }

    if (Object.keys(queryWhere).length > 0) {
      queryOption.where = queryWhere;
    }
    queryOption.skip = queryMember.pageNum - 1;
    queryOption.take = queryMember.pageSize;

    return await this.memberRepository.find(queryOption);
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
