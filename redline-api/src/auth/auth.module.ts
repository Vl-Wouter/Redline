import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { constantsConfig as config } from 'src/config/constants.config';
import { JwtStrategy } from './jwt.strategy';
import { FollowRepository } from '../users/follow.repository';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: config.auth.jwt.secret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    MailModule.register({
      apiKey: config.sendgrid.apiKey,
      defaults: {
        from: 'woutvlae@student.arteveldehs.be',
      },
    }),
    TypeOrmModule.forFeature([UserRepository, FollowRepository]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
