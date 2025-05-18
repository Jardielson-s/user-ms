import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

ApiTags('users');
@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private readonly service: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.service.findAll(query);
  // }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.service.findOne(_id);
  }

  @Put(':_id')
  update(@Param('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(_id, dto);
  }

  @Delete(':_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('_id') _id: string) {
    return this.service.remove(_id);
  }
}
