import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Query, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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

@Controller('accounts')
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
    @Body() body: { username: string, password: string }
  ) {
    const token = await this.accountsService.login(body.username, body.password);
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
    @Body() body: {
      account: Account,
      imageBase64: string
    }
  ) {
    await this.accountsService.addAccount({ ...body.account, roleId: 1 }, body.imageBase64);
    return { message: 'Register successfully' };
  }

  // Thêm account mới
  @Post('')
  @Roles('Manager')
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  async addAccount(
    @Body() body: {
      account: Account,
      imageBase64: string
    }
  ) {
    await this.accountsService.addAccount(body.account, body.imageBase64);
    return { message: 'Add account successfully' };
  }

  // Lấy danh sách accounts nhân viên
  @Get('staffs')
  @Roles('Manager')
  @UseGuards(RolesGuard)
  async getStaff() {
    const accounts = await this.accountsService.getAllStaff();
    return {
      "accounts": accounts,
    };
  }

  // Lấy danh sách accounts khách hàng
  @Get('customers')
  @Roles('Manager',"Staff")
  @UseGuards(RolesGuard)
  async getCustomer() {
    const accounts = await this.accountsService.getAllCustomer();
    return {
      "accounts": accounts,
    };
  }

  // Lấy account detail (không gồm danh sách background, service đảm nhiệm và lịch nghỉ)
  @Get(':accountId')
  @UseGuards(LoginJwtGuard)
  async getAccountById(
    @Param('accountId') accountId: Types.ObjectId
  ) {
    const account = await this.accountsService.getAccountDetail(accountId);
    return {
      "account": account,
    };
  }

  // Cập nhật account
  @Post(':accountId')
  @UseGuards(LoginJwtGuard)
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  async updateAccountById(
    @Param('accountId') accountId: Types.ObjectId,
    @Body() body: {
      account: Account,
      imageBase64: string
    }
  ) {
    await this.accountsService.updateAccount(accountId, body.account, body.imageBase64);
    return { message: 'Update successfully' };
  }

  // Xóa account
  @Delete(':accountId')

  async deleteAccountById(
    @Param('accountId') accountId: Types.ObjectId
  ) {
    await this.accountsService.deleteAccount(accountId);
    return { message: 'Delete successfully' };
  }






  //////////////////////////////////////////////////////////////////////////////////////////////////////////


  @Get('test/hello')
  async hello() {
    return { message: 'Hello' };
  }

  @Get('test/test_exception')
  async test_exception(
    @Body() body: { password: string }
  ) {
    throw new HttpException('Test exception', 500);
  }

  @Get('test/test_undeleteAllAccount')
  async test_undeleteAllAccount() {
    await this.accountsService.undeleteAllAccount();
    return { message: 'Undelete all account successfully' };
  }

  @Post('test/test_uploadImage')
  async test_uploadImage(
    @Body() body: { image: string }
  ) {
    const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH');
    await this.fileService.saveBase64File(body.image, folderPath, "ngu_2");
    return { message: 'Upload image successfully' };
  }

  @Post('test/test_deleteImage')
  async test_deleteImage(
    @Body() body: { image: string }
  ) {
    const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH');
    await this.fileService.deleteFile(folderPath, body.image);
    return { message: 'Delete image successfully' };
  }

  @Post('test/test_deleteFolder')
  async test_deleteFolder(
    @Body() body: { image: string }
  ) {
    const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH');
    await this.fileService.deleteFolder(folderPath + "/nguuuuuu");
    return { message: 'Delete image successfully' };
  }

  @Post('test/test_copyFile')
  async test_copyFile(
    @Body() body: { image: string }
  ) {
    const folderPath = this.configService.get<string>('imagePathConfig.ACCOUNT_IMAGE_PATH');
    const sourcePath = folderPath ;
    const sourceFileName = "unknown.jpg";
    const destinationPath = folderPath + "/hahaha";
    const destinationFileName = "unknown_222.jpg";
    await this.fileService.copyFile(sourcePath,sourceFileName, destinationPath,destinationFileName);
    return { message: 'Copy image successfully' };
  }





}
