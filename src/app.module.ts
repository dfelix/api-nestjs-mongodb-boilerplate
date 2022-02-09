import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_CONN),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
          user: process.env.SMTP_USER_NAME,
          pass: process.env.SMTP_USER_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_EMAIL_FROM,
      },
      template: {
        dir: join(__dirname, '/mail/templates'),
        adapter: new HandlebarsAdapter(/* helpers */ undefined, {
          inlineCssEnabled: true,
          /** See https://www.npmjs.com/package/inline-css#api */
          inlineCssOptions: {
            url: ' ',
            preserveMediaQueries: true,
          },
        }),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
