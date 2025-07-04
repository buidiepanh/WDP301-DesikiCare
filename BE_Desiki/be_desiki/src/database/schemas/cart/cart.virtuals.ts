export function apply_Virtuals(schema) {
    schema.virtual('cartItems', {
        ref: 'CartItem',                
        localField: '_id',              
        foreignField: 'cartId',            
        justOne: false
    });
}
