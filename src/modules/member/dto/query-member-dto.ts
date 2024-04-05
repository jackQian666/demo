import {
  IsEmail,
  IsEmpty,
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryMemberDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsOptional()
  weiXin?: number;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsInt()
  @IsOptional()
  idCard?: number;

  @IsInt()
  @IsOptional()
  businessLicense?: number;

  @IsInt()
  pageNum?: number;

  @IsInt()
  pageSize?: number;
}
