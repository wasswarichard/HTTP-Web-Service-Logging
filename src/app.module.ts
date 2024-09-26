import 'dotenv-defaults/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: parseInt(<string>process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
