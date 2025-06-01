import { IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jonh joe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '19699181010', description: 'User ein' })
  @IsString()
  ein: string;

  @ApiProperty({ example: 22, description: 'User age' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'Jonh.joe@gmail.com', description: 'User email' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Jonh*joe1234', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({
    example: {
      street: 'string st',
      addressNumber: 'test',
      postalCode: 345,
    },
    description: 'User address',
  })
  @IsObject()
  address: { street: string; addressNumber: string; postalCode: number };
}
