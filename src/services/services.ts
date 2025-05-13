import { Product } from '../types/Catalogue.types';

class ProductService {
    private readonly baseUrl: string = 'https://fakestoreapi.com';

    async getAllProducts(): Promise<Product[]> {
        try {
            const response: Response = await fetch(`${this.baseUrl}/products`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: Product[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            const response: Response = await fetch(`${this.baseUrl}/products/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: Product = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            throw error;
        }
    }
}

export const productService = new ProductService();
