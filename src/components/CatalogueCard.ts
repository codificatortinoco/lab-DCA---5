import { Product } from '../types/Catalogue.types';
import { dispatcher } from '../flux/Dispatcher';
import { Actions } from '../flux/Actions';

export class CatalogueCard extends HTMLElement {
    private product!: Product;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    public setProduct(product: Product): void {
        this.product = product;
        this.render();
    }

    public getProduct(): Product {
        return this.product;
    }

    public updateProduct(updates: Partial<Product>): void {
        this.product = { ...this.product, ...updates };
        this.render();
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px;
                    width: 250px;
                    height: 400px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    display: flex;
                    flex-direction: column;
                }

                .card:hover {
                    transform: translateY(-5px);
                }

                .image {
                    width: 100%;
                    height: 200px;
                    object-fit: contain;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 1.1em;
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #333;
                    height: 2.4em;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .price {
                    font-size: 1.2em;
                    color: #2c5282;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .category {
                    color: #666;
                    font-size: 0.9em;
                    margin-bottom: 8px;
                    text-transform: capitalize;
                }

                .rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    margin-top: auto;
                }

                .stars {
                    color: #ffd700;
                    font-size: 1.2em;
                }

                .rating-count {
                    color: #666;
                    font-size: 0.9em;
                }

                .add-to-cart {
                    background-color: #2c5282;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    margin-top: 12px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s;
                    width: 100%;
                }

                .add-to-cart:hover {
                    background-color: #1a365d;
                }

                .add-to-cart:active {
                    transform: scale(0.98);
                }
            </style>

            <div class="card">
                <img class="image" src="${this.product.image}" alt="${this.product.title}">
                <div class="title">${this.product.title}</div>
                <div class="price">$${this.product.price.toFixed(2)}</div>
                <div class="category">${this.product.category}</div>
                <div class="rating">
                    <div class="stars">${'★'.repeat(Math.round(this.product.rating.rate))}${'☆'.repeat(5 - Math.round(this.product.rating.rate))}</div>
                    <span class="rating-count">(${this.product.rating.count} reviews)</span>
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;

        const addToCartButton = this.shadowRoot?.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                dispatcher.dispatch(Actions.addToCart(this.product));
            });
        }
    }
}


