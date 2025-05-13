import './CartCard';
import { Product } from '../types/Catalogue.types';
import { dispatcher } from '../flux/Dispatcher';
import { Actions } from '../flux/Actions';
import { cartStore } from '../flux/Store';

export class CartContainer extends HTMLElement {
    private cartItems: Map<number, { product: Product; quantity: number }> = new Map();

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const storeItems = cartStore.getCartItems();
        this.cartItems = new Map(storeItems.map(item => [item.product.id, item]));
        this.subscribeToStore();
        this.render();
    }

    private subscribeToStore() {
        cartStore.addChangeListener(() => {
            const cartItems = cartStore.getCartItems();
            this.cartItems = new Map(cartItems.map(item => [item.product.id, item]));
            this.render();
        });
    }

    private calculateTotal(): number {
        let total = 0;
        this.cartItems.forEach(({ product, quantity }) => {
            total += product.price * quantity;
        });
        return total;
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .cart-container {
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .cart-header {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #2c5282;
                }

                .cart-items {
                    margin-bottom: 20px;
                }

                .cart-summary {
                    border-top: 2px solid #eee;
                    padding-top: 20px;
                    margin-top: 20px;
                }

                .total {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #2c5282;
                    text-align: right;
                }

                .empty-cart {
                    text-align: center;
                    color: #666;
                    padding: 40px;
                    font-size: 1.1em;
                }

                .checkout-btn {
                    background-color: #2c5282;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 12px 24px;
                    margin-top: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    width: 100%;
                    font-size: 1.1em;
                }

                .checkout-btn:hover {
                    background-color: #1a365d;
                }

                .checkout-btn:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            </style>

            <div class="cart-container">
                <div class="cart-header">Shopping Cart</div>
                <div class="cart-items">
                    ${this.cartItems.size === 0 
                        ? '<div class="empty-cart">Your cart is empty</div>'
                        : Array.from(this.cartItems.values())
                            .map(({ product, quantity }) => `
                                <cart-card></cart-card>
                            `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="total">Total: $${this.calculateTotal().toFixed(2)}</div>
                </div>
            </div>
        `;

        if (this.cartItems.size > 0) {
            const cartCards = this.shadowRoot.querySelectorAll('cart-card');
            cartCards.forEach((card, index) => {
                const item = Array.from(this.cartItems.values())[index];
                (card as any).setProduct(item.product, item.quantity);
            });
        }
    }
}

