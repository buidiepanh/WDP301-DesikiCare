export function apply_Virtuals(schema) {
    schema.virtual('orderItems', {
        ref: 'OrderItem',                // Tên model OrderItem
        localField: '_id',                // Trường ở Order
        foreignField: 'orderId',          // Trường ở OrderItem
        justOne: false
    });
}
