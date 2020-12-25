export interface ProductList {
  product_id?: number;
  variant_id?: number;
  product_name?: string;
  product_description?: string;
  product_price?: number;
  product_imageUrl?: string;
  allergens_name?: Array<{
    allergen_name: string
  }>;
}
