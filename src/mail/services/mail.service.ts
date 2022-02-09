import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = process.env.CLIENT_URL + `/activation/${user.id}`;

    const result = await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: '"../templates/confirmation',
      context: {
        code: user.activationCode,
        email: user.email,
        url,
      },
    });

    return result.messageId;
  }

  async sendPasswordReset(user: User) {
    const url = process.env.CLIENT_URL + `/password/${user.resetToken}`;

    const result = await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'password-change-request',
      template: '../templates/password-change',
      context: {
        email: user.email,
        url,
      },
    });

    return result.messageId;
  }
}
