import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { SkinTypeRepository } from 'src/database/schemas/skinType/skinType.repository';
import { SkinStatusRepository } from 'src/database/schemas/skinStatus/skinStatus.repository';
import { ProductSkinTypeRepository } from 'src/database/schemas/productSkinType/productSkinType.repository';
import { ProductSkinStatusRepository } from 'src/database/schemas/productSkinStatus/productSkinStatus.repository';

@Injectable()
export class SkinsService {
    constructor(
        private readonly skinTypeRepository: SkinTypeRepository,
        private readonly skinStatusRepository: SkinStatusRepository,
        private readonly productSkinTypeRepository: ProductSkinTypeRepository,
        private readonly productSkinStatusRepository: ProductSkinStatusRepository,

        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }



}
