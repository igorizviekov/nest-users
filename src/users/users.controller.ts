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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiDefaultResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUserDto } from './dto/auth-user.dto';
import { DeletedUserDto } from './dto/user-deleted.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiDefaultResponse({
    description: 'User records',
    isArray: true,
    type: UserDto,
  })
  getAll(@Query() query: FilterUsersDto): Promise<UserDto[]> {
    const { search, limit, offset } = query;
    return this.usersService.getUsers(search, Number(limit), Number(offset));
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Get by id',
    isArray: false,
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  getById(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.getById(id);
  }

  //create a new record
  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'New user created',
    isArray: false,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Password is too weak',
    isArray: false,
  })
  @ApiBody({ type: AuthUserDto })
  createOne(@Body() userDto: UserDto): Promise<UserDto> {
    return this.usersService.signUp(userDto);
  }

  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'User signed in successfully. Access token atttached',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentails' })
  @ApiBody({ type: AuthUserDto })
  signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    return this.usersService.signIn(userDto);
  }

  @UseGuards(AuthGuard())
  @Patch('/:id')
  @ApiOkResponse({
    description: 'User updated successfully',
    isArray: false,
    type: UserDto,
  })
  @ApiBearerAuth()
  @ApiBody({ type: AuthUserDto })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentails.' })
  update(@Body() body: AuthUserDto, @Param('id') id: string): Promise<UserDto> {
    return this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User Deleted',
    isArray: false,
    type: DeletedUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentails' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  remove(@Param('id') id: string): Promise<object> {
    return this.usersService.remove(id);
  }
}
