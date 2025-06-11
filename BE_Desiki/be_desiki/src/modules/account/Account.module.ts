import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AccountController } from './Account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/database/schemas/account/account.schema';
import { Role, RoleSchema } from 'src/database/schemas/role/role.schema';
import { AccountsService } from './services/accounts.service';
import { AccountRepository } from 'src/database/schemas/account/account.repository';
import { RoleRepository } from 'src/database/schemas/role/role.repository';
import { JwtService } from 'src/common/services/jwt.service';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { FileService } from 'src/common/services/file.service';
import { DeliveryAddressRepository } from 'src/database/schemas/deliveryAddress/deliveryAddress.repository';
import { DeliveryAddress, DeliveryAddressSchema } from 'src/database/schemas/deliveryAddress/deliveryAddress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },                        // accounts
      { name: Role.name, schema: RoleSchema },                              // roles
      { name: DeliveryAddress.name, schema: DeliveryAddressSchema }, // delivery addresses
    ]),
    // BookingModule,
    // ServiceModule
  ],
  controllers: [AccountController],
  providers: [
    // Repositories
    AccountRepository,
    RoleRepository,
    DeliveryAddressRepository,
    

    // Inner Services
    AccountsService,

    // Common Services
    JwtService,
    BcryptService,
    FileService


  ],
  exports: [
    // Repositories
    AccountRepository,
    
    // Inner Services
    AccountsService,
  ]
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(

    ).forRoutes(
    );
  }
}
