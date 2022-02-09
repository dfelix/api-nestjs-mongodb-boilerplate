import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // https://docs.nestjs.com/security/authentication#jwt-functionality
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ActivationDto } from './dto/activation.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { RegisterResponse } from './entities/register-response';
import { MailService } from 'src/mail/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findOne({ email });
    if (!user) throw new NotFoundException('user-not-found');

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return {
        id: user.id,
        email: user.email,
        roles: user.roles,
      };
    }
    return null;
  }

  async signPayload(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(registrationData: RegisterDto) {
    const createdUser: User = await this.usersService.create({
      email: registrationData.email,
      password: registrationData.password,
    });

    const response = new RegisterResponse();
    response.id = createdUser.id;

    const messageId = await this.mailService.sendUserConfirmation(createdUser);
    if (messageId) response.messageId = messageId;

    return response;
  }

  async activation(id: string, activationData: ActivationDto) {
    return await this.usersService.activation(id, activationData.code);
  }

  async activationReset(email: string) {
    const user = await this.usersService.activationReset({ email });
    if (!user) throw new NotFoundException('user-not-found');

    const messageId = await this.mailService.sendUserConfirmation(user);
    return { messageId };
  }

  async passwordReset(username: string) {
    const user = await this.usersService.passwordReset({ email: username });
    if (!user) throw new NotFoundException('user-not-found');

    const messageId = await this.mailService.sendPasswordReset(user);
    return { messageId };
  }

  async passwordReplace(token: string, registrationData: RegisterDto) {
    const user: User = await this.usersService.findOne({
      email: registrationData.email,
      resetToken: token,
    });
    if (!user) throw new NotFoundException('user-not-found');

    if (user.email != registrationData.email)
      throw new NotFoundException('user-not-found');

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    await this.usersService.passwordReplace(user.email, hashedPassword);

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
