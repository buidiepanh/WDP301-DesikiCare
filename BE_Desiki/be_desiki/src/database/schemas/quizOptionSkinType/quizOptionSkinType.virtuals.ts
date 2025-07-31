export function apply_Virtuals(schema: any) {
    schema.virtual('skinType', {
        ref: 'SkinType',
        localField: 'skinTypeId',
        foreignField: '_id',
        justOne: true
    });
}
