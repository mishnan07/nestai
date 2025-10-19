import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findByCognitoSub(cognitoSub: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { cognitoSub },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async update(cognitoSub: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findByCognitoSub(cognitoSub);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async verifyPhone(cognitoSub: string): Promise<User> {
    return await this.update(cognitoSub, { phoneVerified: true });
  }
}