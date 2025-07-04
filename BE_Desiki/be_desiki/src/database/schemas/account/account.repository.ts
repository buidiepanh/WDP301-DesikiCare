import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Account, AccountModel } from "./account.schema";
import { ClientSession, Types } from "mongoose";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: AccountModel,
  ) { }

  async findById(id: any): Promise<Account | null> {
    return this.accountModel.findById(id).lean().exec();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().lean().exec();
  }

  async findByRoleId(roleId: any): Promise<Account[]> {
    return this.accountModel.find({ roleId: roleId }).lean().exec();
  }

  async findByRoleIds(roleIds: any[]): Promise<Account[]> {
    return this.accountModel.find({ roleId: { $in: roleIds } }).lean().exec();
  }

  async create(account: Account): Promise<Account> {
    return this.accountModel.create(account);
  }

  async update(id: any, account: Account, session : ClientSession): Promise<Account | null | undefined> {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(id, account, { new: true }).session(session).exec();
    return updatedAccount;
  }

  async deactivate(id: Types.ObjectId, isDeactivated: boolean): Promise<Account | null> {
    return this.accountModel.findByIdAndUpdate(id, { isDeactivated }, { new: true }).exec();
  }

}