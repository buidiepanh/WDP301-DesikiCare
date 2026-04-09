import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UnauthorizedException, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './services/accounts.service';
import { HttpExceptionFilter } from 'src/common/filters/HttpException.filter';
import { get, Types } from 'mongoose';
import { Account } from 'src/database/schemas/account/account.schema';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeliveryAddress } from 'src/database/schemas/deliveryAddress/deliveryAddress.schema';

@Controller('Account')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class AccountController {

  constructor(
    private readonly accountsService: AccountsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Đăng nhập tài khoản
  @Post('login')
  async login(
    @Body() body: { loginInfo: { email: string, password: string } }
  ) {
    const { loginInfo } = body;
    const token = await this.accountsService.login(loginInfo.email, loginInfo.password);
    return {
      "token": token,
      "message": "Login successfully"
    };
  }

  // Đăng ký tài khoản mới cho customer
  @Post('register')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  async register(
    @Req() req,
    @Body() body: {
      account: Account & {
        imageBase64: string
      }
    }
  ) {
    const user = req.user;

    if ((body.account.roleId === 1 || body.account.roleId === 2)) {
      if (!user || (user && user.role._id === 3)) {
        throw new UnauthorizedException('You do not have permission to register this account type');
      }
    }
    const errors = await validate(plainToInstance(Account, body.account));
    if (errors.length > 0) {
      console.log('Validation failed. Errors: ', errors);
      throw new HttpException(errors.map((error) => Object.values(error.constraints)).join(', '), 400);
    }
    await this.accountsService.addAccount({ ...body.account });
    return { message: 'Register successfully' };
  }

  // Lấy thông tin người dùng hiện tại
  @Get('me')
  @UseGuards(LoginJwtGuard)
  async getMe(
    @Req() req
  ) {
    const user = req.user;
    const account = await this.accountsService.getAccountDetail(new Types.ObjectId(user._id));
    return account;
  }

  // Lấy thông tin tài khoản theo ID
  @Get('accounts/:accountId')
  async getAccountDetail(
    @Param('accountId') accountId: Types.ObjectId
  ) {

    const account = await this.accountsService.getAccountDetail(new Types.ObjectId(accountId));
    return account;
  }

  // Cập nhật tài khoản
  @Put('accounts/:accountId')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  async updateAccount(
    @Param('accountId') accountId: Types.ObjectId,
    @Body() body: {
      account: Account & {
        imageBase64: string
      }
    }
  ) {
    const errors = await validate(plainToInstance(Account, body.account));
    if (errors.length > 0) {
      console.log('Validation failed. Errors: ', errors);
      throw new HttpException(errors.map((error) => Object.values(error.constraints)).join(', '), 400);
    }
    const updatedAccount = await this.accountsService.updateAccount(new Types.ObjectId(accountId), body.account);
    return {
      message: 'Update account successfully',
    };
  }

  // Cập nhật mật khẩu tài khoản
  @Put('accounts/:accountId/password')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  async updateAccountPassword(
    @Param('accountId') accountId: Types.ObjectId,
    @Body() body: {
      oldPassword: string,
      newPassword: string
    }
  ) {
    
    await this.accountsService.updateAccountPassword(new Types.ObjectId(accountId), body.oldPassword, body.newPassword);
    return {
      message: 'Update account successfully',
    };
  }

  // Vô hiệu / kích hoạt tài khoản
  @Put('accounts/:accountId/deactivate/:isDeactivate')
  async deactivateAccount(
    @Param('accountId') accountId: Types.ObjectId,
    @Param('isDeactivate') isDeactivate: string 
  ) {
    const isDeactivateBool = isDeactivate === 'true' ;

    if (isDeactivate !== 'true' && isDeactivate !== 'false') {
      throw new BadRequestException('Invalid value for isDeactivate parameter');
    }
    const result = await this.accountsService.deactivateAccount(new Types.ObjectId(accountId), isDeactivateBool);
    return {
      message: `Account ${isDeactivate ? 'deactivated' : 'activated'} successfully`,
    };
  }

  // Danh sách tài khoản
  // [WARNING] chỉnh lại sau khi phải lọc role trong danh sách theo role người gửi request và các yếu tốc khác như query string, phân trang, tìm kiếm...
  @Get('accounts')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async getAccounts() {
    const accounts = await this.accountsService.getAccounts(1, 1, 100); // Lấy tất cả tài khoản với phân trang giả lập
    return {
      accounts: accounts
    }
  }

  // Lấy danh sách vai trò
  @Get('roles')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async getRoles() {
    const roles = await this.accountsService.getRoles();
    return {
      roles: roles
    }
  }


  // Lấy danh sách địa chỉ của tài khoản
  @Get('accounts/:accountId/deliveryAddresses')
  async getDeliveryAddresses(
    @Param('accountId') accountId: Types.ObjectId
  ) {
    const deliveryAddresses = await this.accountsService.getDeliveryAddresses(new Types.ObjectId(accountId));
    return {
      deliveryAddresses: deliveryAddresses
    };
  }

  // Thêm địa chỉ cho tài khoản
  @Post('accounts/:accountId/deliveryAddresses')
  @UseGuards(LoginJwtGuard)
  async addDeliveryAddress(
    @Param('accountId') accountId: Types.ObjectId,
    @Body() body: {
      deliveryAddress: DeliveryAddress
    }
  ) {
    const deliveryAddress = await this.accountsService.addDeliveryAddress(new Types.ObjectId(accountId), body.deliveryAddress);
    return {
      message: 'Delivery address added successfully'
    };
    
  }


  // Đặt địa chỉ mặc định cho tài khoản
  @Put('deliveryAddresses/:deliveryAddressId/set-default')
  @UseGuards(LoginJwtGuard)
  async setDefaultDeliveryAddress(
    @Param('deliveryAddressId') deliveryAddressId: Types.ObjectId,
    @Req() req
  ) {
    const user = req.user;
    const result = await this.accountsService.setDefaultDeliveryAddress(new Types.ObjectId(deliveryAddressId), new Types.ObjectId(user._id));
    return {
      message: 'Default delivery address set successfully',
    };
  }

  // Xóa địa chỉ của tài khoản
  @Delete('deliveryAddresses/:deliveryAddressId')
  @UseGuards(LoginJwtGuard)
  async deleteDeliveryAddress(
    @Param('deliveryAddressId') deliveryAddressId: Types.ObjectId,
    @Req() req
  ) {
    const user = req.user;
    const result = await this.accountsService.deleteDeliveryAddress(new Types.ObjectId(deliveryAddressId), new Types.ObjectId(user._id));
    return {
      message: 'Delivery address deleted successfully'
    };
  }

}
