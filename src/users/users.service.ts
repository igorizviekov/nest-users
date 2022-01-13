import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepo: UsersRepository,
    private jwtService: JwtService
  ) {}

  getUsers(search: string, limit: number, offset: number): Promise<User[]> {
    return this.usersRepo.getUsers(search, limit, offset);
  }

  async getById(id: string): Promise<User> {
    const match = await this.usersRepo.findOne(id);
    if (!match) {
      throw new NotFoundException(`User with ${id} not found.`);
    }
    return match;
  }

  signUp(userDto: UserDto): Promise<User> {
    return this.usersRepo.createUser(userDto);
  }

  async signIn(creadentials: UserDto): Promise<{ accessToken: string }> {
    const { login, password } = creadentials;
    const user = await this.usersRepo.findOne({ login });
    //if user exist in db, sign a jwt token
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { login };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials.');
    }
  }

  async update(id: string, UserToUpdate: User): Promise<User> {
    const target = await this.getById(id);
    Object.keys(UserToUpdate).forEach((key) => {
      target[key] = UserToUpdate[key];
    });
    await this.usersRepo.update(id, target);
    return target;
  }

  async remove(id: string): Promise<object> {
    const res = await this.usersRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`User with ${id} not found.`);
    }
    //contains num of affected rows and a relevant record
    return res;
  }
}
