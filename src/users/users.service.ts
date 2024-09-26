import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { RegistrationRequestDto } from './dto/registration-request.dto';
import { AuthenticationRequestDto } from './dto/authentication-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private UserModel: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async register(registrationRequestDto: RegistrationRequestDto) {
    const { email, password } = registrationRequestDto;

    // check if user with email already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`Email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.UserModel.create({
      ...registrationRequestDto,
      password: hashedPassword,
    });
    return { message: 'User registered successfully', userId: user.id };
  }

  async findByEmail(email: string): Promise<User> {
    return this.UserModel.findOne({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.UserModel.findAll();
  }

  findOne(id: number): Promise<User> {
    return this.UserModel.findOne({ where: { id }, raw: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User[]> {
    const [_, affectedRows] = await this.UserModel.update(updateUserDto, {
      where: { id },
      returning: true,
    });
    return affectedRows;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async login(authenticationRequestDto: AuthenticationRequestDto) {
    const { email, password } = authenticationRequestDto;

    // validate user credentials
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException(`Invalid credentials`);
    }
    return this.authService.login(user);
  }
}
