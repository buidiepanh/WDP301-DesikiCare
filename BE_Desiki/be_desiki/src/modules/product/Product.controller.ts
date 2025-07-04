import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, Type, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/common/services/file.service';
import { JwtCheckGuard_With_Option } from 'src/common/guards/Auth/JwtCheckGuard_With_Option.guard';
import { SkinsService } from './services/skins.service';
import { Shipment } from 'src/database/schemas/shipment/shipment.schema';
import { ShipmentsService } from './services/shipments.service';
import { Role } from 'src/database/schemas/role/role.schema';
import { RolesGuard } from 'src/common/guards/Auth/RoleGuard.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Types } from 'mongoose';
import { LoginJwtGuard } from 'src/common/guards/Auth/LoginJwtGuard.guard';

@Controller('Product')
@UseGuards(JwtCheckGuard_With_Option('public_private'))
export class ProductController {

  constructor(
    private readonly productsService: ProductsService,
    private readonly skinsService: SkinsService,
    private readonly shipmentsService: ShipmentsService,

    private readonly configService: ConfigService,
    private readonly fileService: FileService,

  ) { }

  // Lấy danh sách sản phẩm
  // [WARNING] chỉnh lại sau khi phải lọc theo quyền của người gửi request và các yếu tố khác như query string, phân trang, tìm kiếm...
  @Get('products')
  async getProducts(
    @Req() req,
  ) {
    var products = await this.productsService.getProducts();

    if (!req.user || (req.user && req.user.role._id === 3)) {
      products = products.filter(product => product.product.isDeactivated === false);
    }
    return {
      products: products,
    }
  }

  // Thêm sản phẩm mới
  @Post('products')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async createProduct(
    @Body() body: {
      product: {
        categoryId: number;
        name: string;
        description: string;
        volume: number;
        salePrice: number;
        imageBase64: string;
      },
      skinTypeIds?: number[];
      skinStatusIds?: number[];
    }
  ) {
    const product = await this.productsService.createProduct(body);
    return {
      message: "Product created successfully"
    };
  }

  // Lấy chi tiết sản phẩm
  @Get('products/:productId')
  async getProductById(
    @Req() req,
    @Param('productId') productId: Types.ObjectId,
  ) {
    const product = await this.productsService.getProductById(productId);
    if (!req.user || (req.user && req.user.role._id === 3)) {
      if (product.product.isDeactivated === true) {
        throw new BadRequestException('Product is deactivated');
      }
    }
    return product;
  }

  // Cập nhật sản phẩm
  @Put('products/:productId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async updateProduct(
    @Param('productId') productId: Types.ObjectId,
    @Body() body: {
      product: {
        categoryId: number;
        name: string;
        description: string;
        volume: number;
        salePrice: number;
        imageBase64?: string;
      },
      skinTypeIds?: number[];
      skinStatusIds?: number[];
    }
  ) {
    const product = await this.productsService.updateProduct(productId, body);
    return {
      message: "Product updated successfully",
    };
  }

  // Vô hiệu/kích hoạt sản phẩm
  @Put('products/:productId/deactivate/:isDeactivate')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deactivateProduct(
    @Param('productId') productId: Types.ObjectId,
    @Param('isDeactivate') isDeactivate: string
  ) {
    const isDeactivateBool = isDeactivate === 'true';
    if (isDeactivate !== 'true' && isDeactivate !== 'false') {
      throw new BadRequestException('Invalid value for isDeactivate parameter');
    }
    const result = await this.productsService.deactivateProduct(productId, isDeactivateBool);
    return {
      message: `Product ${isDeactivateBool === false ? 'activated' : 'deactivated'} successfully`,
    };
  }

  // Lấy danh sách lô hàng
  // [WARNING] chỉnh lại sau khi phải lọc theo quyền của người gửi request và các yếu tố khác như query string, phân trang, tìm kiếm...
  @Get('shipments')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async getShipments() {
    const shipments = await this.shipmentsService.getShipments();
    return {
      shipments: shipments,
    };
  }

  // Thêm lô hàng
  @Post('shipments')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async createShipment(
    @Body() body: {
      shipment: {
        _id: string,
        shipmentDate: Date,
      }
    }
  ) {
    const shipment = await this.shipmentsService.createShipment(body.shipment);
    return {
      message: "Shipment created successfully",
    };
  }

  // Lấy chi tiết lô hàng
  @Get('shipments/:shipmentId')
  async getShipmentById(
    @Param('shipmentId') shipmentId: string,
  ) {
    const shipment = await this.shipmentsService.getShipmentById(shipmentId);
    return shipment;
  }

  // Cập nhật lô hàng
  @Put('shipments/:shipmentId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async updateShipment(
    @Param('shipmentId') shipmentId: string,
    @Body() body: {
      shipment: {
        shipmentDate: Date,
      }
    }
  ) {
    const shipment = await this.shipmentsService.updateShipment(shipmentId, body.shipment);
    return {
      message: "Shipment updated successfully",
    };
  }

  // Xóa lô hàng
  @Delete('shipments/:shipmentId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deleteShipment(
    @Param('shipmentId') shipmentId: string,
  ) {
    await this.shipmentsService.deleteShipment(shipmentId);
    return {
      message: "Shipment deleted successfully",
    };
  }

  // Lấy chi tiết shipmentProduct
  @Get('shipmentProducts/:shipmentProductId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async getShipmentProductById(
    @Param('shipmentProductId') shipmentProductId: Types.ObjectId,
  ) {
    const shipmentProduct = await this.shipmentsService.getShipmentProductById(shipmentProductId);
    return shipmentProduct;
  }

  // Cập nhật shipmentProduct
  @Put('shipmentProducts/:shipmentProductId')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async updateShipmentProduct(
    @Param('shipmentProductId') shipmentProductId: Types.ObjectId,
    @Body() body: {
      shipmentProduct: {
        quantity: number;
        manufacturingDate: Date;
        expiryDate: Date;
        buyPrice: number;
      }
    }
  ) {
    const shipmentProduct = await this.shipmentsService.updateShipmentProduct(shipmentProductId, body.shipmentProduct);
    return {
      message: "Shipment product updated successfully",
    };
  }

  // Đăng ký shipmentProduct
  @Post('shipmentProducts')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async registerShipmentProduct(
    @Body() body: {
      shipmentProduct: {
        productId: Types.ObjectId;
        shipmentId: string;
        quantity: number;
        manufacturingDate: Date;
        expiryDate: Date;
        buyPrice: number;
      }
    }
  ) {
    const shipmentProduct = await this.shipmentsService.registerShipmentProduct(body.shipmentProduct);
    return {
      message: "Shipment product registered successfully",
    };
  }

  // Vô hiệu/kích hoạt shipmentProduct
  @Put('shipmentProducts/:shipmentProductId/deactivate/:isDeactivate')
  @Roles("admin", "manager")
  @UseGuards(RolesGuard)
  async deactivateShipmentProduct(
    @Param('shipmentProductId') shipmentProductId: Types.ObjectId,
    @Param('isDeactivate') isDeactivate: string
  ) {
    const isDeactivateBool = isDeactivate === 'true';
    if (isDeactivate !== 'true' && isDeactivate !== 'false') {
      throw new BadRequestException('Invalid value for isDeactivate parameter');
    }
    const result = await this.shipmentsService.deactivateShipmentProduct(shipmentProductId, isDeactivateBool);
    return {
      message: `Shipment product ${isDeactivateBool === false ? 'activated' : 'deactivated'} successfully`,
    };
  }

  //  Danh sách skin types
  @Get('skinTypes')
  async getSkinTypes() {
    const skinTypes = await this.skinsService.getSkinTypes();
    return {
      skinTypes: skinTypes,
    };
  }

  // Danh sách skin status
  @Get('skinStatuses')
  async getSkinStatuses() {
    const skinStatuses = await this.skinsService.getSkinStatuses();
    return {
      skinStatuses: skinStatuses,
    };
  }

  // Danh sách categories
  @Get('categories')
  async getCategories() {
    const categories = await this.productsService.getCategories();
    return {
      categories: categories,
    };
  }



}
