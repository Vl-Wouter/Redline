import { Module, DynamicModule } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
  static register(options): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: 'MAIL_OPTIONS',
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
