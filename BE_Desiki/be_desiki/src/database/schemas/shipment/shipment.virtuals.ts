export function apply_Virtuals(schema: any) {
    schema.virtual('shipmentProducts', {
        ref: 'ShipmentProduct',           // Tên model ShipmentProduct
        localField: '_id',                // Trường ở Shipment
        foreignField: 'shipmentId',       // Trường ở ShipmentProduct
        justOne: false
    });
}
