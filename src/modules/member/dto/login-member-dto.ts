import {
  IsEmail,
  IsEmpty,
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginMemberDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  phone?: string;

  @IsString()
  password: string;

  @IsString()
  captcha: string;

  @IsString()
  captchaId: string;
}
