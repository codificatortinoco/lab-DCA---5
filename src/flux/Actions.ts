export class Actions {
    static ADD_TO_CART = 'ADD_TO_CART';
    static REMOVE_FROM_CART = 'REMOVE_FROM_CART';
    static UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
    static CLEAR_CART = 'CLEAR_CART';

    static addToCart(product: any) {
        return {
            type: Actions.ADD_TO_CART,
            payload: product
        };
    }

    static removeFromCart(productId: number) {
        return {
            type: Actions.REMOVE_FROM_CART,
            payload: productId
        };
    }

    static updateCartItem(productId: number, quantity: number) {
        return {
            type: Actions.UPDATE_CART_ITEM,
            payload: { productId, quantity }
        };
    }

    static clearCart() {
        return {
            type: Actions.CLEAR_CART
        };
    }
}
