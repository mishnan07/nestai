import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile/:sub')
  findOne(@Param('sub') cognitoSub: string) {
    return this.usersService.findByCognitoSub(cognitoSub);
  }

  @Patch('profile/:sub')
  update(@Param('sub') cognitoSub: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(cognitoSub, updateUserDto);
  }

  @Patch('verify-phone/:sub')
  verifyPhone(@Param('sub') cognitoSub: string) {
    return this.usersService.verifyPhone(cognitoSub);
  }
}