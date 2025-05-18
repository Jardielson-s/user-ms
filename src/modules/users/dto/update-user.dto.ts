import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Jonh joe', description: 'User name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '0000000000', description: 'User ein' })
  @IsString()
  @IsOptional()
  ein: string;

  @ApiProperty({ example: 22, description: 'User age' })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({ example: 'Jonh.joe@gmail.com', description: 'User email' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'Jonh*joe1234', description: 'User password' })
  @IsString()
  @IsOptional()
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
  @IsOptional()
  address: { street: string; addressNumber: string; postalCode: number };
}
