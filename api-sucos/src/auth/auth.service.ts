import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser({ username, password }: LoginDto) {
    const findUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!findUser) return null;

    const isPasswordValid = await findUser.validatePassword(password);

    if (isPasswordValid) {
      const { password, ...user } = findUser;
      return this.jwtService.sign(user);
    }
    return null;
  }

  async createUser(authPayloadDto: AuthPayloadDto) {
    const { username, password, name, address, opt_payment } = authPayloadDto;
    const newUser = this.userRepository.create({
      username,
      password,
      name,
      address,
      opt_payment,
    });
    await this.userRepository.save(newUser);
    return { message: 'User created successfully' };
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
