import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  async register(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.createUser(authPayloadDto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.authService.findAllUsers();
  }
}
