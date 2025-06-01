import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { UserModel } from '../../models/users/user.model';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const created = await this.userModel.create(user);

    return created;
  }

  async find(
    filters: FilterQuery<UserModel>,
    page: number,
    limit: number,
  ): Promise<UserModel[]> {
    const list = await this.userModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return list;
  }

  async findById(id: string): Promise<UserModel> {
    const v = await this.userModel.findById(id).exec();
    if (!v) throw new NotFoundException('Usuário não encontrado');
    return v;
  }

  async update(id: string, vehicle: Partial<UserModel>): Promise<UserModel> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, vehicle, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Usuário não encontrado');

    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Usuário não encontrado');
  }

  async count(filters: FilterQuery<UserModel>): Promise<number> {
    return this.userModel.countDocuments(filters).exec();
  }

  async findOne(query: object) {
    return this.userModel.findOne(query);
  }
}
