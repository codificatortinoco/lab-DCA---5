import { Product } from '../types/Catalogue.types';
import { dispatcher } from '../flux/Dispatcher';
import { Actions } from '../flux/Actions';

export class CartCard extends HTMLElement {
    private product!: Product;
    private quantity: number = 1;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    public setProduct(product: Product, quantity: number = 1): void {
        this.product = product;
        this.quantity = quantity;
        this.render();
    }

    public getProduct(): Product {
        return this.product;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .cart-item {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid #eee;
                    gap: 16px;
                }

                .image {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                }

                .details {
                    flex: 1;
                }

                .title {
                    font-size: 1em;
                    font-weight: bold;
                    margin-bottom: 4px;
                    color: #333;
                }

                .price {
                    color: #2c5282;
                    font-weight: bold;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .quantity-btn {
                    background-color: #2c5282;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .quantity-btn:hover {
                    background-color: #1a365d;
                }

                .quantity {
                    font-weight: bold;
                    min-width: 30px;
                    text-align: center;
                }

                .remove-btn {
                    background-color: #e53e3e;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .remove-btn:hover {
                    background-color: #c53030;
                }
            </style>

            <div class="cart-item">
                <img class="image" src="${this.product.image}" alt="${this.product.title}">
                <div class="details">
                    <div class="title">${this.product.title}</div>
                    <div class="price">$${this.product.price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" id="decrease">-</button>
                    <span class="quantity">${this.quantity}</span>
                    <button class="quantity-btn" id="increase">+</button>
                </div>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        const decreaseBtn = this.shadowRoot.querySelector('#decrease');
        const increaseBtn = this.shadowRoot.querySelector('#increase');
        const removeBtn = this.shadowRoot.querySelector('.remove-btn');

        decreaseBtn?.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                dispatcher.dispatch(Actions.updateCartItem(this.product.id, this.quantity));
                this.render();
            }
        });

        increaseBtn?.addEventListener('click', () => {
            this.quantity++;
            dispatcher.dispatch(Actions.updateCartItem(this.product.id, this.quantity));
            this.render();
        });

        removeBtn?.addEventListener('click', () => {
            dispatcher.dispatch(Actions.removeFromCart(this.product.id));
        });
    }
}

