export function apply_Virtuals(schema: any) {
    schema.virtual('skinStatus', {
        ref: 'SkinStatus',
        localField: 'skinStatusId',
        foreignField: '_id',
        justOne: true
    });
}
