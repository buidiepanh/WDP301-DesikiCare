export function apply_Indexes(schema: any) {
    schema.index({ shipmentId: 1, productId: 1 }, { unique: true });
}
