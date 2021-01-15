export interface OrderList {
  order_id?: number;
  restaurant_name?: string;
  total?: number;
  time?: string;
}

export interface OrderDetail {
  product_id: number,
  product_quantity: number,
  product_price: number,
  product_name: string,
  total_product_price: number,
  message: string,
  product_description: string,
  allergenName: Array<string>,
  product_imageUrl: string,
  extras: Extras[],
  emptyExtra?: boolean
}

export interface Extras {
  extra_id: number,
  extra_quantity: number,
  extra_price: number,
  extra_name: string,
  total_extra_price: number
}
