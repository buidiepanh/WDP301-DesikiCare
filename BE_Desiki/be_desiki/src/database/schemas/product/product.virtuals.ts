export function apply_Virtuals(schema) {
    schema.virtual('productSkinTypes', {
        ref: 'ProductSkinType',           // Tên model ProductSkinType
        localField: '_id',                // Trường ở Product
        foreignField: 'productId',        // Trường ở ProductSkinType
        justOne: false
    });

    schema.virtual('productSkinStatuses', {
        ref: 'ProductSkinStatus',         // Tên model ProductSkinStatus
        localField: '_id',                // Trường ở Product
        foreignField: 'productId',        // Trường ở ProductSkinStatus
        justOne: false
    });

    schema.virtual('shipmentProducts', {
        ref: 'ShipmentProduct',           // Tên model ShipmentProduct
        localField: '_id',                // Trường ở Product
        foreignField: 'productId',        // Trường ở ShipmentProduct
        justOne: false
    }
    )

    schema.virtual('category', {
        ref: 'Category',                  // Tên model Category
        localField: 'categoryId',         // Trường ở Product
        foreignField: '_id',              // Trường ở Category
        justOne: true
    });
}
