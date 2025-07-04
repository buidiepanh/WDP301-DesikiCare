import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import 'multer';


@Injectable()
export class FileService {
    constructor(
        private readonly configService: ConfigService
    ) { }
    ////////////////////////////////////////////// FILE //////////////////////////////////////////////
    async getImageUrl(rootFolderPath: string, folderName: string | Types.ObjectId, fileName: string): Promise<string> {
        const baseUrl = this.configService.get<string>('appConfig.BASE_URL');
        try {
            fileName = await this.getFullFileName(rootFolderPath + "/" + folderName, fileName);
            if (!fileName) {
                throw new Error(`Không tìm thấy file có base name: ${fileName}`);
            }
        } catch (error) {
            return `${baseUrl}/${rootFolderPath}/unknown.jpg`;
        }
        return `${baseUrl}/${rootFolderPath}/${folderName}/${fileName}`;
    }

    async saveBase64File(
        base64Data: string,
        folderPath: string,
        fileName: string,
    ): Promise<string> {
        try {
            const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
            let extension = '.png';
            let data = base64Data;
            if (matches) {
                const mimeType = matches[1];
                data = matches[2];
                if (mimeType === 'image/jpeg') {
                    extension = '.jpg';
                } else if (mimeType === 'image/png') {
                    extension = '.png';
                } else if (mimeType === 'image/gif') {
                    extension = '.gif';
                }
            }

            const fullFileName = `${fileName}${extension}`;


            const filePath = join(process.cwd(), folderPath, fullFileName);

            const buffer = Buffer.from(data, 'base64');
            await fs.writeFile(filePath, buffer);
            return filePath;
        } catch (error) {
            console.error(`Lỗi khi lưu file có base name ${fileName}:`, error);
            //throw new Error(`Lỗi khi lưu file có base name ${fileName}: ${error}`);
        }

    }

    async saveFile(
        file: Express.Multer.File,
        folderPath: string,
        fileName: string,
    ): Promise<string> {
        try {
            const fullFileName = `${fileName}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;

            const filePath = join(process.cwd(), folderPath, fullFileName);

            await fs.writeFile(filePath, file.buffer);
            return filePath;
        } catch (error) {
            console.error(`Lỗi khi lưu file có base name ${fileName}:`, error);
            //throw new Error(`Lỗi khi lưu file có base name ${fileName}: ${error}`);
        }
    }

    async deleteFile(folderPath: string, fileName: string): Promise<void> {
        try {
            const fileToDelete = await this.getFullFileName(folderPath, fileName);

            if (!fileToDelete) {
                console.log(`Không tìm thấy file có base name: ${fileName}`);
                return;
            }

            const filePath = join(process.cwd(), folderPath, fileToDelete);

            await fs.unlink(filePath);
        } catch (error) {
            console.error(`Lỗi khi xoá file có base name ${fileName}:`, error);
            //throw new Error(`Lỗi khi xoá file có base name ${fileName}: ${error}`);
        }
    }

    async getFullFileName(folderPath: string, fileName: string): Promise<string> {
        try {
            const files = await fs.readdir(process.cwd() + '/' + folderPath);

            const fullFileName = files.find(file => {
                const fileWithoutExt = file.substring(0, file.lastIndexOf('.'));
                return fileWithoutExt === fileName;
            });

            if (!fullFileName) {
                return null;
            }

            return fullFileName;

        } catch (error) {
            console.error(`Lỗi khi lấy tên file có base name ${fileName}:`, error);
            throw new Error(`Lỗi khi lấy tên file có base name ${fileName}: ${error}`);
        }
    }

    async copyFile(sourcePath: string, sourceFileName: string, destinationPath: string, destinationFileName: string): Promise<void> {
        try {
            sourcePath = join(process.cwd(), sourcePath + "/" + sourceFileName);
            destinationPath = join(process.cwd(), destinationPath + "/" + destinationFileName);

            const destinationFolder = join(destinationPath, '..');
            await fs.mkdir(destinationFolder, { recursive: true });


            await fs.copyFile(sourcePath, destinationPath);
        } catch (error) {
            console.error(`Lỗi khi sao chép file:`, error);
            //throw new Error(`Lỗi khi sao chép file: ${error}`);
        }
    }

    ////////////////////////////////////////////// FOLDER //////////////////////////////////////////////
    async createFolder(folderPath: string): Promise<void> {
        try {
            await fs.mkdir(process.cwd() + "/" + folderPath, { recursive: true });
        } catch (error) {
            console.error(`Lỗi khi tạo folder có path ${folderPath}:`, error);
           // throw new Error(`Lỗi khi tạo folder có path ${folderPath}: ${error}`);
        }
    }



    async deleteFolder(folderPath: string): Promise<void> {
        try {
            await fs.rm(process.cwd() + "/" + folderPath, { recursive: true, force: true });
        } catch (error) {
            console.error(`Lỗi khi xoá folder có path ${folderPath}:`, error);
            //throw new Error(`Lỗi khi xoá folder có path ${folderPath}: ${error}`);
        }
    }




}
