import { Injectable, Inject } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { MailException } from './mail.exception';
import { mailContent } from './constants';

@Injectable()
export class MailService {
  private client;
  private defaults;
  constructor(@Inject('MAIL_OPTIONS') options) {
    this.client = sgMail;
    this.defaults = options.defaults;
    this.client.setApiKey(options.api_key);
  }
  async send(mail: mailContent) {
    try {
      const { to, from, subject, text, html } = mail;
      return this.client.send({
        to,
        from: from ?? this.defaults.from,
        subject,
        text,
        html,
      });
    } catch (err) {
      throw new MailException(err.response.body.message ?? err.message);
    }
  }
}
