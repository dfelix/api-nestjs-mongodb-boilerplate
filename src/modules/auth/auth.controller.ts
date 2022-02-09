import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivationDto } from './dto/activation.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any): any {
    return this.authService.signPayload(req.user);
  }

  @Post('register')
  register(@Body() authRegisterDto: RegisterDto): any {
    return this.authService.register(authRegisterDto);
  }

  @Post('activation/reset')
  activationReset(@Body() req: any): any {
    return this.authService.activationReset(req.username);
  }

  @Post('activation/:id')
  activation(
    @Param('id') id: string,
    @Body() activationDto: ActivationDto,
  ): any {
    return this.authService.activation(id, activationDto);
  }

  @Post('password/reset')
  passwordReset(@Body() req: any): any {
    return this.authService.passwordReset(req.username);
  }

  @Post('password/:token')
  passwordReplace(
    @Param('token') token: string,
    @Body() authRegisterDto: RegisterDto,
  ): any {
    return this.authService.passwordReplace(token, authRegisterDto);
  }
}
