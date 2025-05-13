import { Product } from '../types/Catalogue.types';
import { productService } from '../services/services';
import { CatalogueCard } from './CatalogueCard';

export class CatalogueContainer extends HTMLElement {
    private products: Product[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.loadProducts();
    }


    public async refreshProducts(): Promise<void> {
        await this.loadProducts();
    }

    public getProducts(): Product[] {
        return [...this.products];
    }

    public filterProducts(predicate: (product: Product) => boolean): void {
        const filteredProducts = this.products.filter(predicate);
        this.render(filteredProducts);
    }

    public sortProducts(compareFn: (a: Product, b: Product) => number): void {
        const sortedProducts = [...this.products].sort(compareFn);
        this.render(sortedProducts);
    }

    private async loadProducts() {
        try {
            this.products = await productService.getAllProducts();
            this.render(this.products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.renderError();
        }
    }

    private render(products: Product[]) {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .error {
                    color: #e53e3e;
                    text-align: center;
                    padding: 20px;
                    font-size: 1.2em;
                }
            </style>

            <div class="container">
                ${products.map(product => `
                    <catalogue-card></catalogue-card>
                `).join('')}
            </div>
        `;

        const cards = this.shadowRoot.querySelectorAll('catalogue-card');
        cards.forEach((card, index) => {
            (card as CatalogueCard).setProduct(products[index]);
        });
    }

    private renderError() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .error {
                    color: #e53e3e;
                    text-align: center;
                    padding: 20px;
                    font-size: 1.2em;
                }
            </style>
            <div class="error">
                Failed to load products. Please try again later.
            </div>
        `;
    }
}
