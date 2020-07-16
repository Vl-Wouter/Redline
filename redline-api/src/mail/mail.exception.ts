import { HttpException, HttpStatus } from '@nestjs/common';

export class MailException extends HttpException {
  constructor(message?) {
    super(
      message ?? 'An error occured while sending an email',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
}
