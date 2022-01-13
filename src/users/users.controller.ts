import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAll(@Query() query: FilterUsersDto): Promise<User[]> {
    //filter users if filter is applied or return all users
    const { search, limit, offset } = query;
    return this.usersService.getUsers(search, Number(limit), Number(offset));
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }

  @Post('/signup')
  createOne(@Body() userDto: UserDto): Promise<User> {
    return this.usersService.signUp(userDto);
  }

  @Post('/signin')
  signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    return this.usersService.signIn(userDto);
  }
  @UseGuards(AuthGuard())
  @Patch('/:id')
  update(@Body() body: User, @Param('id') id: string): Promise<User> {
    return this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<object> {
    return this.usersService.remove(id);
  }
}
