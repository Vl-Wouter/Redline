import {
  CacheModule,
  Module,
  CacheInterceptor,
  HttpModule,
} from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesModule } from './categories/categories.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReviewsModule } from './reviews/reviews.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import sgTransport from 'nodemailer-sendgrid-transport';
import nodemailer from 'nodemailer';
import { constantsConfig } from './config/constants.config';
import { MailModule } from './mail/mail.module';
import { AlbumsModule } from './albums/albums.module';
import { ArticlesModule } from './articles/articles.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MulterModule.register({
      dest: './uploads',
    }),
    CacheModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'redline-client/dist'),
      exclude: ['/api*'],
    }),
    // MailerModule.forRoot({
    //   transport: `smtps://apikey@domain.com:pass@smtp.domain.com`
    //   ),
    //   defaults: {
    //     from: '"Redline" <noreply@redline.com>',
    //   },
    //   template: {
    //     dir: __dirname + '/templates',
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    HttpModule,
    EventsModule,
    AuthModule,
    CategoriesModule,
    VehiclesModule,
    ReviewsModule,
    UsersModule,
    MailModule.register({
      api_key: constantsConfig.sendgrid.api_key,
      defaults: {
        from: 'woutvlae@student.arteveldehs.be',
      },
    }),
    AlbumsModule,
    ArticlesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
