export interface RestaurantInfo {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_address: string;
  restaurant_AvgDeliveryTime: number;
  minOrder: number;
  result: Array<{
    day: string,
    open: string,
    close: string
  }>
}
