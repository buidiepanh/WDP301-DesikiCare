import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { QuizQuestionRepository } from 'src/database/schemas/quizQuestion/quizQuestion.repository';
import { QuizOptionRepository } from 'src/database/schemas/quizOption/quizOption.repository';
import { QuizOptionSkinTypeRepository } from 'src/database/schemas/quizOptionSkinType/quizOptionSkinType.repository';
import { QuizOptionSkinStatusRepository } from 'src/database/schemas/quizOptionSkinStatus/quizOptionSkinStatus.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { AccountsService } from 'src/modules/account/services/accounts.service';
import { ProductsService } from 'src/modules/product/services/products.service';
import { SkinTypeRepository } from 'src/database/schemas/skinType/skinType.repository';
import { SkinStatusRepository } from 'src/database/schemas/skinStatus/skinStatus.repository';
import { ProductRepository } from 'src/database/schemas/product/product.repository';

@Injectable()
export class QuizService {
    constructor(
        private readonly quizQuestionRepository: QuizQuestionRepository,
        private readonly quizOptionRepository: QuizOptionRepository,
        private readonly quizOptionSkinTypeRepository: QuizOptionSkinTypeRepository,
        private readonly quizOptionSkinStatusRepository: QuizOptionSkinStatusRepository,
        private readonly skinTypeRepository: SkinTypeRepository,
        private readonly skinStatusRepository: SkinStatusRepository,
        private readonly productRepository: ProductRepository,


        private readonly accountsService: AccountsService,

        @InjectConnection() private readonly connection: Connection,

        private readonly bcryptService: BcryptService,
        private readonly jwtService: JwtService,
        private readonly fileService: FileService,

        private readonly configService: ConfigService,
    ) { }

    //----------- Exist Checks -----------
    async getExistQuizQuestionById(questionId: Types.ObjectId): Promise<any> {
        const question = await this.quizQuestionRepository.findById(questionId);
        if (!question) {
            throw new HttpException('Quiz question not found: id ' + questionId, HttpStatus.NOT_FOUND);
        }
        return question;
    }

    async getExistQuizOptionById(optionId: Types.ObjectId): Promise<any> {
        const option = await this.quizOptionRepository.findById(optionId);
        if (!option) {
            throw new HttpException('Quiz option not found: id ' + optionId, HttpStatus.NOT_FOUND);
        }
        return option;
    }

    async getExistSkinTypeById(skinTypeId: number): Promise<any> {
        const skinType = await this.skinTypeRepository.findById(skinTypeId);
        if (!skinType) {
            throw new HttpException('Skin type not found: id ' + skinTypeId, HttpStatus.NOT_FOUND);
        }
        return skinType;
    }

    async getExistSkinStatusById(skinStatusId: number): Promise<any> {
        const skinStatus = await this.skinStatusRepository.findById(skinStatusId);
        if (!skinStatus) {
            throw new HttpException('Skin status not found: id ' + skinStatusId, HttpStatus.NOT_FOUND);
        }
        return skinStatus;
    }

    //----------- Main Functions -----------
    async getQuizQuestionsAndOptions(): Promise<any> {
        try {
            const questions = await this.quizQuestionRepository.findAll();
            const result = [];

            for (const question of questions) {
                const options = await this.quizOptionRepository.findByQuizQuestionId(question._id);
                const quizOptions = [];

                for (const option of options) {
                    const skinTypes = await this.quizOptionSkinTypeRepository.findByQuizOptionId(option._id);
                    const skinStatuses = await this.quizOptionSkinStatusRepository.findByQuizOptionId(option._id);

                    quizOptions.push({
                        quizOption: option,
                        skinTypes: skinTypes.map(skinType => skinType.skinType),
                        skinStatuses: skinStatuses.map(skinStatus => skinStatus.skinStatus)
                    });
                }

                result.push({
                    quizQuestion: question,
                    quizOptions: quizOptions
                });
            }

            return result;
        } catch (error) {
            throw new HttpException('Get quiz questions and options failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createQuizQuestion(questionData: {
        content: string;
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const question = await this.quizQuestionRepository.create({
                content: questionData.content
            }, session);

            await session.commitTransaction();
            return question;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Create quiz question failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async updateQuizQuestion(questionId: Types.ObjectId, updateData: {
        content: string;
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistQuizQuestionById(questionId);

            await this.quizQuestionRepository.update(questionId, {
                content: updateData.content
            }, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update quiz question failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deleteQuizQuestion(questionId: Types.ObjectId): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistQuizQuestionById(questionId);

            // Xóa tất cả relationships và options
            const existingOptions = await this.quizOptionRepository.findByQuizQuestionId(questionId);
            for (const option of existingOptions) {
                console.log("Deleting option:", option._id);
                // Xóa relationships trước
                const skinTypes = await this.quizOptionSkinTypeRepository.findByQuizOptionId(option._id);
                console.log("Deleting skin types for option:", skinTypes.length);
                for (const skinType of skinTypes) {
                    await this.quizOptionSkinTypeRepository.delete(skinType._id);
                }

                const skinStatuses = await this.quizOptionSkinStatusRepository.findByQuizOptionId(option._id);
                for (const skinStatus of skinStatuses) {
                    await this.quizOptionSkinStatusRepository.delete(skinStatus._id);
                }

                await this.quizOptionRepository.delete(option._id);
            }

            // Xóa câu hỏi
            await this.quizQuestionRepository.delete(questionId);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Delete quiz question failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async createQuizOption(questionId: Types.ObjectId, optionData: {
        quizOption: {
            content: string;
        };
        skinTypeIds?: number[];
        skinStatusIds?: number[];
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistQuizQuestionById(questionId);

            const option = await this.quizOptionRepository.create({
                content: optionData.quizOption.content,
                quizQuestionId: questionId
            }, session);

            // Tạo quan hệ với skin types
            if (optionData.skinTypeIds && optionData.skinTypeIds.length > 0) {
                for (const skinTypeId of optionData.skinTypeIds) {
                    await this.getExistSkinTypeById(skinTypeId);
                    await this.quizOptionSkinTypeRepository.create({
                        quizOptionId: option._id,
                        skinTypeId: skinTypeId
                    }, session);
                }
            }

            // Tạo quan hệ với skin status
            if (optionData.skinStatusIds && optionData.skinStatusIds.length > 0) {
                for (const skinStatusId of optionData.skinStatusIds) {
                    await this.getExistSkinStatusById(skinStatusId);
                    await this.quizOptionSkinStatusRepository.create({
                        quizOptionId: option._id,
                        skinStatusId: skinStatusId
                    }, session);
                }
            }

            await session.commitTransaction();
            return option;
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Create quiz option failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async updateQuizOption(optionId: Types.ObjectId, updateData: {
        quizOption?: {
            content: string;
        };
        skinTypeIds?: number[];
        skinStatusIds?: number[];
    }): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const option = await this.getExistQuizOptionById(optionId);

            // Cập nhật nội dung option
            if (updateData.quizOption && updateData.quizOption.content) {
                const updatedOption = {
                    ...option,
                    content: updateData.quizOption.content
                };
                await this.quizOptionRepository.update(optionId, updatedOption, session);
            }

            // Xóa các relationships cũ
            const existingSkinTypes = await this.quizOptionSkinTypeRepository.findByQuizOptionId(optionId);
            for (const skinType of existingSkinTypes) {
                await this.quizOptionSkinTypeRepository.delete(skinType._id);
            }

            const existingSkinStatuses = await this.quizOptionSkinStatusRepository.findByQuizOptionId(optionId);
            for (const skinStatus of existingSkinStatuses) {
                await this.quizOptionSkinStatusRepository.delete(skinStatus._id);
            }

            // Tạo quan hệ mới với skin types
            if (updateData.skinTypeIds && updateData.skinTypeIds.length > 0) {
                for (const skinTypeId of updateData.skinTypeIds) {
                    await this.getExistSkinTypeById(skinTypeId);
                    await this.quizOptionSkinTypeRepository.create({
                        quizOptionId: optionId,
                        skinTypeId: skinTypeId
                    }, session);
                }
            }

            // Tạo quan hệ mới với skin status
            if (updateData.skinStatusIds && updateData.skinStatusIds.length > 0) {
                for (const skinStatusId of updateData.skinStatusIds) {
                    await this.getExistSkinStatusById(skinStatusId);
                    await this.quizOptionSkinStatusRepository.create({
                        quizOptionId: optionId,
                        skinStatusId: skinStatusId
                    }, session);
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Update quiz option failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async deleteQuizOption(optionId: Types.ObjectId): Promise<any> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.getExistQuizOptionById(optionId);

            // Xóa tất cả relationships
            const existingSkinTypes = await this.quizOptionSkinTypeRepository.findByQuizOptionId(optionId);
            for (const skinType of existingSkinTypes) {
                await this.quizOptionSkinTypeRepository.delete(skinType._id);
            }

            const existingSkinStatuses = await this.quizOptionSkinStatusRepository.findByQuizOptionId(optionId);
            for (const skinStatus of existingSkinStatuses) {
                await this.quizOptionSkinStatusRepository.delete(skinStatus._id);
            }

            // Xóa option
            await this.quizOptionRepository.delete(optionId);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw new HttpException('Delete quiz option failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            session.endSession();
        }
    }

    async getQuizResult(optionIds: Types.ObjectId[]): Promise<any> {
        try {
            // Lấy tất cả skin types và skin statuses từ các options đã chọn
            const skinTypeMap = new Map<number, { count: number, skinType: any }>();
            const skinStatusMap = new Map<number, { count: number, skinStatus: any }>();

            for (const optionId of optionIds) {
                await this.getExistQuizOptionById(optionId);

                // Lấy skin types liên quan đến option này (đã populate)
                const skinTypes = await this.quizOptionSkinTypeRepository.findByQuizOptionId(optionId);
                for (const skinTypeRelation of skinTypes) {
                    const key = skinTypeRelation.skinTypeId;
                    const existing = skinTypeMap.get(key);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        skinTypeMap.set(key, {
                            count: 1,
                            skinType: skinTypeRelation.skinTypeId // skinTypeId là populated object
                        });
                    }
                }

                // Lấy skin status liên quan đến option này (đã populate)
                const skinStatuses = await this.quizOptionSkinStatusRepository.findByQuizOptionId(optionId);
                for (const skinStatusRelation of skinStatuses) {
                    const key = skinStatusRelation.skinStatusId;
                    const existing = skinStatusMap.get(key);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        skinStatusMap.set(key, {
                            count: 1,
                            skinStatus: skinStatusRelation.skinStatusId // skinStatusId là populated object
                        });
                    }
                }
            }

            // Lấy top 2 skin types có điểm cao nhất
            const topSkinTypes = Array.from(skinTypeMap.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 2)
                .map(item => item.skinType);

            // Lấy top 2 skin statuses có điểm cao nhất
            const topSkinStatuses = Array.from(skinStatusMap.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, 2)
                .map(item => item.skinStatus);

            // Get recommended products based on skin types and statuses
            const dominantSkinTypeIds = topSkinTypes.map(st => st._id || st);
            const dominantSkinStatusIds = topSkinStatuses.map(ss => ss._id || ss);
            const recommendedProducts = await this.getRecommendedProducts(dominantSkinTypeIds, dominantSkinStatusIds);

//               new ObjectId('665f1a1e72d193188e810002'),
//   new ObjectId('6841621aabefdd2da0e6bdf8'),
//   new ObjectId('68417c9908a4d8b654bebbe0'),
//   new ObjectId('684580c62deeb7c0450a313a'),
//   new ObjectId('6845810c2deeb7c0450a3172'),
//   new ObjectId('665f1a1e72d193188e810001'),
//   new ObjectId('6845d9bd2deeb7c0450a34af'),
//   new ObjectId('685cf7bef80803cb0800f94b'),
//   new ObjectId('686377e872c34c2da91e443c'),
//   new ObjectId('686378fb72c34c2da91e44e4'),
//   new ObjectId('6863789b72c34c2da91e44b1'),
//   new ObjectId('687f44e9fd3fd3b680bf3f43')
            return {
                skinTypes: topSkinTypes,
                skinStatuses: topSkinStatuses,
                recommendedProducts: recommendedProducts
            };
        } catch (error) {
            throw new HttpException('Get quiz result failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async getRecommendedProducts(skinTypeIds: number[], skinStatusIds: number[]): Promise<any[]> {
        try {
            var products = await this.productRepository.findBySkinTypeIdsAndSkinStatusIds(skinTypeIds, skinStatusIds);
            console.log("alooooooooooooooo",products);
            var result = [];
            for (const product of products) {
                const { category, shipmentProducts, productSkinTypes, productSkinStatuses, ...productBase } = product;
                result.push({
                    product: {
                        ...productBase,
                        imageUrl: await this.fileService.getImageUrl(this.configService.get<string>('imagePathConfig.PRODUCT_IMAGE_PATH'), product._id, "main"),
                    },
                    category: category,
                    shipmentProducts: shipmentProducts.map(shipmentProduct => {
                        const { shipmentId: shipment, ...shipmentProductBase } = shipmentProduct;
                        return {
                            shipment: shipment,
                            shipmentProduct: shipmentProductBase
                        }
                    }),
                    productSkinTypes: productSkinTypes.map(productSkinType => productSkinType.skinTypeId),
                    productSkinStatuses: productSkinStatuses.map(productSkinStatus => productSkinStatus.skinStatusId)
                });
            }
            result = result.filter(product => product.product.isDeactivated === false &&
                product.shipmentProducts.length > 0 &&
                // product.shipmentProducts.reduce((acc, sp) => acc + sp.shipmentProduct.quantity, 0) > 0 &&
                product.shipmentProducts.some(sp => sp.shipmentProduct.isDeactivated === false && sp.shipment && (sp.shipment as any).isDeleted === false));
            return result;
        } catch (error) {
            throw new HttpException('Get recommended products failed: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
