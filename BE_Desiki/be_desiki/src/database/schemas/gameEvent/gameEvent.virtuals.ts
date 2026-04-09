export function apply_Virtuals(schema) {
    // Define virtuals here if needed
    // For example, you can add a virtual for formatted dates or other computed properties
    schema.virtual('gameEventRewardResults', {
        ref: 'GameEventRewardResult',
        localField: '_id',
        foreignField: 'gameEventId',
    });
}
