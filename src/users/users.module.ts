import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
