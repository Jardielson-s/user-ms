import {
  BadRequestException,
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { isValidObjectId, Types } from 'mongoose';
import { UserRepository } from 'src/infra/mongoose/repositories/users/user.repository';
import { SqsProduce } from 'src/infra/sqs/sqs.producer';
import { UserModel } from 'src/infra/mongoose/models/users/user.model';
import { randomUUID } from 'crypto';

export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly repository: UserRepository,
    @Inject(SqsProduce)
    private readonly sqsProduce: SqsProduce,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const emailAlreadyExists = await this.repository.findOne({
        email: data.email,
      });
      const einAlreadyExists = await this.repository.findOne({
        ein: data.ein,
      });
      if (emailAlreadyExists || einAlreadyExists) {
        const message = emailAlreadyExists
          ? 'e-mail already exists'
          : 'ein already exists';
        throw new BadRequestException(message);
      }
      const user = await this.repository.create({
        _id: new Types.ObjectId(),
        ...data,
      });
      const userIntegrations = {
        name: user.name,
        ein: user.ein,
        email: user.email,
        password: user.password,
        phone: user.password,
        postalCode: String(user.address.postalCode),
        address: user.address.street,
        addressNumber: user.address.addressNumber,
        country: 'br',
        city: 'any',
        integrationId: user._id,
      };
      await this.sqsProduce.sendToQueue('users', [userIntegrations]);
      return user;
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async upsert(data: any[]): Promise<{
    errors: object;
    bulkOps: object;
  }> {
    try {
      const errors: Array<{ message: string; entity: Partial<UserModel> }> = [];
      const bulkOps = [];
      for (const input of data) {
        const emailAlreadyExists = await this.repository.findOne({
          email: input.email,
          ...(input._id
            ? { _id: { $ne: new Types.ObjectId(input?._id) } }
            : { externalId: { $ne: input.externalId } }),
        });
        if (emailAlreadyExists) {
          errors.push({
            message: 'Email already exists',
            entity: input,
          });
          continue;
          // return { bulkOps: [], errors: errors };
        }
        const einAlreadyExists = await this.repository.findOne({
          ein: input.ein,
          ...(input._id
            ? { _id: { $ne: new Types.ObjectId(input?._id) } }
            : { externalId: { $ne: input.externalId } }),
        });
        if (einAlreadyExists) {
          errors.push({
            message: 'Ein already exists',
            entity: input,
          });
          continue;
          // return { bulkOps: [], errors: errors };
        }

        // upsert.push(input);
        input._id = new Types.ObjectId(input?._id) ?? new Types.ObjectId();
        bulkOps.push({
          updateOne: {
            filter: { _id: input._id },
            update: { $set: input },
            upsert: true,
          },
        });
      }

      if (bulkOps.length) {
        await this.repository.upsert(bulkOps);
      }
      return { errors, bulkOps };
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
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
      const user = await this.repository.update(_id, updateData);
      const userIntegrations = {
        id: user?.externalId ?? randomUUID(),
        name: user.name,
        ein: user.ein,
        email: user.email,
        password: user.password,
        phone: user.password,
        postalCode: String(user.address.postalCode),
        address: user.address.street,
        addressNumber: user.address.addressNumber,
        country: 'br',
        city: 'any',
        integrationId: user._id,
      };
      await this.sqsProduce.sendToQueue('users', [userIntegrations], 'U');
      return user;
    } catch (error: unknown) {
      console.log(error);
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
