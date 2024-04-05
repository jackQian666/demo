import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '~/common/interceptors/transform.interceptor';
import { MemberModule } from '~/modules/member/member.module';
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRE, JWT_SECRET } from '~/constants/system.constant';
import { AuthGuard } from '~/modules/member/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestadimn',
      entities: ['dist/modules/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRE },
    }),
    MemberModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://127.0.0.1:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
  ],
})
export class AppModule {}
