export interface OrderProductList {
  variantId: number;
  productId: number;
  productPrice: number;
  quantity: number;
  message?: string;
  extras: ExtraList[];
}

export interface ExtraList {
  id: number,
  quantity: number,
  extraPrice: number
}
