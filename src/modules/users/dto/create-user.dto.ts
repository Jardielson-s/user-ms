import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'User id',
    example: '66b7c3de5b2fdf84859dd4c0',
  })
  @IsOptional()
  @IsString()
  _id;

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

  @ApiProperty({
    type: String,
    description: 'User external id',
    example: 'e5d6ba19-7188-4895-9a0d-659dc1d7e5c5',
  })
  @IsOptional()
  @IsString()
  externalId: string;
}
