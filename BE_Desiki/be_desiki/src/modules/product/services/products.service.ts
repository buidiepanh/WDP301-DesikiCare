import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { ProductRepository } from 'src/database/schemas/product/product.repository';
import { CategoryRepository } from 'src/database/schemas/category/category.repository';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,

        // @InjectModel(Account.name) private accountModel: AccountModel,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }



}
