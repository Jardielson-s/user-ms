import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { isValidObjectId } from 'mongoose';
import { UserRepository } from 'src/infra/mongoose/repositories/users/user.repository';
import { SqsProduce } from 'src/infra/sqs/sqs.producer';

export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly repository: UserRepository,
    @Inject(SqsProduce)
    private readonly sqsProduce: SqsProduce,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const user = await this.repository.create(data);
      await this.sqsProduce.sendToQueue('users', [user]);
      return user;
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro desconhecido');
    }
  }

  async findOne(_id: string): Promise<UserEntity> {
    try {
      if (!isValidObjectId(_id)) {
        throw new NotFoundException(
          'ID inválido: o valor fornecido não é um ObjectId',
        );
      }

      return await this.repository.findById(_id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
  async update(
    _id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      if (!isValidObjectId(_id)) {
        throw new BadRequestException(
          'ID inválido: o valor fornecido não é um ObjectId',
        );
      }
      return await this.repository.update(_id, updateData);
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Erro desconhecido');
    }
  }

  async remove(_id: string): Promise<void> {
    try {
      return await this.repository.delete(_id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error);
    }
  }
}
