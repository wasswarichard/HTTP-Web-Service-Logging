import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { RegistrationRequestDto } from './dto/registration-request.dto';
import { AuthenticationRequestDto } from './dto/authentication-request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private UserModel: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sequelize: Sequelize,
  ) {}

  async register(registrationRequestDto: RegistrationRequestDto) {
    const { email, password } = registrationRequestDto;

    const t = await this.sequelize.transaction();

    try {
      // check if user with email already exists
      await this.findByEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.UserModel.create({
        ...registrationRequestDto,
        password: hashedPassword,
      });

      this.eventEmitter.emit('user.events', {
        userId: user.id,
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            text: `User with ${user.email} has been created`,
          },
        ],
      });
      await t.commit();
      return { message: 'User registered successfully', userId: user.id };
    } catch (error) {
      await t.rollback();
      throw new BadRequestException(
        `User registration failed: ${error.message}`,
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.UserModel.findOne({
        where: { email },
        raw: true,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  findAll(): Promise<User[]> {
    return this.UserModel.findAll();
  }

  findOne(id: number): Promise<User> {
    try {
      return this.UserModel.findOne({ where: { id }, raw: true });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<User[]> {
    try {
      const [_, affectedRows] = await this.UserModel.update(updateUserDto, {
        where: { id },
        returning: true,
      });

      this.eventEmitter.emit('user.events', {
        userId,
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            text: `User with id ${id} has been updated`,
          },
        ],
      });

      return affectedRows;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async login(authenticationRequestDto: AuthenticationRequestDto) {
    return this.authService.login(authenticationRequestDto);
  }
}
