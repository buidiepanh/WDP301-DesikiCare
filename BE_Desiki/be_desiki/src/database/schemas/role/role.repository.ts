import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleModel } from "./role.schema";
import { ObjectId } from "mongoose";

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: RoleModel,
  ) {}

  async findById(id: any): Promise<Role | null> {
    return this.roleModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async create(role: Role): Promise<Role> {
    return this.roleModel.create(role);
  }

  async update(id: any, role: Role): Promise<Role | null> {
    return this.roleModel.findByIdAndUpdate(id, role, { new: true }).exec();
  }

  async delete(id: any): Promise<Role | null> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }
}