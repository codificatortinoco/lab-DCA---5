import { dispatcher } from './Dispatcher';
import { Actions } from './Actions';

type CartItem = {
    product: any;
    quantity: number;
};

class CartStore {
    private cartItems: CartItem[] = [];
    private listeners: (() => void)[] = [];

    constructor() {
        dispatcher.register(this.handleAction.bind(this));
        this.loadCartFromLocalStorage();
        this.emitChange();
    }

    private loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
            console.log('Loaded cart items:', this.cartItems);
        }
    }

    private saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }

    private handleAction(action: any) {
        switch (action.type) {
            case Actions.ADD_TO_CART:
                this.addToCart(action.payload);
                break;
            case Actions.REMOVE_FROM_CART:
                this.removeFromCart(action.payload);
                break;
            case Actions.UPDATE_CART_ITEM:
                this.updateCartItem(action.payload.productId, action.payload.quantity);
                break;
            case Actions.CLEAR_CART:
                this.clearCart();
                break;
        }
        this.saveCartToLocalStorage();
        this.emitChange();
    }

    private addToCart(product: any) {
        const existingItem = this.cartItems.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({ product, quantity: 1 });
        }
    }

    private removeFromCart(productId: number) {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    }

    private updateCartItem(productId: number, quantity: number) {
        const item = this.cartItems.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    private clearCart() {
        this.cartItems = [];
    }

    public getCartItems(): CartItem[] {
        return [...this.cartItems];
    }

    public getTotalItems(): number {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    public getTotalPrice(): number {
        return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    public addChangeListener(listener: () => void): void {
        this.listeners.push(listener);
    }

    public removeChangeListener(listener: () => void): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    private emitChange(): void {
        this.listeners.forEach(listener => listener());
    }
}

export const cartStore = new CartStore();
