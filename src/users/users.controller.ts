import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  ValidationPipe,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<User[]> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(createUserDto);
  }
}
