import { IsArray, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertUsers {
  @ApiProperty({
    type: [CreateUserDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  data: Array<CreateUserDto>;
}
