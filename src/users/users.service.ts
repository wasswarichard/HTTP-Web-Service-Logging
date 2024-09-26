import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private UserModel: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async register(createUser: CreateUserDto) {
    const { email, password } = createUser;

    // check if user with email already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`Email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.UserModel.create({
      email,
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

  async login(createUser: CreateUserDto) {
    const { email, password } = createUser;

    // validate user credentials
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException(`Invalid credentials`);
    }
    return this.authService.login(user);
  }
}
