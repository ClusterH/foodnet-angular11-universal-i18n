import { Component, OnInit } from '@angular/core';
import { ProductList } from '../../models';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order_Id: string;
  order_created: string;
  order_content: string;
  foodList: ProductList[];
  imgPath: string = 'https://admin.foodnet.ro/';

  constructor() {
    this.foodList = [
      {
        product_id: 111,
        variant_id: 222,
        product_name: "Pizza",
        product_description: "This is test product",
        product_imageUrl: "",
        product_price: 1550,
        allergens_name: [
          {
            allergen_name: "Allergén 1"
          },
          {
            allergen_name: "Allergén 2"
          },
          {
            allergen_name: "Allergén 3"
          },
        ]
      },
      {
        product_id: 112,
        variant_id: 223,
        product_name: "Hambergur",
        product_description: "This is test product",
        product_imageUrl: "",
        product_price: 1590,
        allergens_name: [
          {
            allergen_name: "Allergén 1"
          },
          {
            allergen_name: "Allergén 2"
          },
          {
            allergen_name: "Allergén 3"
          },
        ]
      },
      {
        product_id: 113,
        variant_id: 224,
        product_name: "Soup",
        product_description: "This is test product",
        product_imageUrl: "",
        product_price: 1750,
        allergens_name: [
          {
            allergen_name: "Allergén 1"
          },
          {
            allergen_name: "Allergén 2"
          },
          {
            allergen_name: "Allergén 3"
          },
        ]
      },
    ];
    
   }

  ngOnInit(): void {
  }

}
