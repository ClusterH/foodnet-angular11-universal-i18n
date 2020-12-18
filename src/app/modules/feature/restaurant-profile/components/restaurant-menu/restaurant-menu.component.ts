import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, ProductList } from '../../models';


@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {
  categoryList: Category[];
  sendList: any[];
  selectedCategory: Category;
  selectedSubCategory: Category;
  productList: ProductList[];
  counts: number;
  imgPath: string = 'http://admin.foodnet.ro/';

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {

    this.selectedCategory = {
      category_id: "",
      category_name: ""
    };

    this.selectedSubCategory = {
      category_id: "",
      category_name: ""
    }

    this.categoryList = [
      {category_name: "Hamburger", category_id: "hamburger"},
      {category_name: "Pizza", category_id: "pizza"},
      {category_name: "Soup", category_id: "soup"},
      {category_name: "Daily menu", category_id: "dailyMenu"},
      {category_name: "Salad", category_id: "salad"},
      {category_name: "Hamburger", category_id: "hamburger"},
      {category_name: "Pizza", category_id: "pizza"},
      {category_name: "Soup", category_id: "soup"},
      {category_name: "Daily menu", category_id: "dailyMenu"},
      {category_name: "Salad", category_id: "salad"},
      {category_name: "Hamburger", category_id: "hamburger"},
      {category_name: "Pizza", category_id: "pizza"},
      {category_name: "Soup", category_id: "soup"},
      {category_name: "Daily menu", category_id: "dailyMenu"},
      {category_name: "Salad", category_id: "salad"},
      {category_name: "Hamburger", category_id: "hamburger"},
      {category_name: "Pizza", category_id: "pizza"},
      {category_name: "Soup", category_id: "soup"},
      {category_name: "Daily menu", category_id: "dailyMenu"},
      {category_name: "Salad", category_id: "salad"}
    ];

    this.productList = [
      {
        product_id: 1,
        variant_id: 1,
        product_name: "Pizza Hawai",
        product_description: "Pizza Hawai",
        product_price: 3000,
        product_imageUrl: "images/2020-12-08T15:28:24.800Z-180.png",
        allergens_name: [
          {
            allergen_name: "fish"
          },
          {
            allergen_name: "fish2"
          }
        ]
      },
      {
        product_id: 3,
        variant_id: 3,
        product_name: "Salad Hawai",
        product_description: "Salad Hawai",
        product_price: 2000,
        product_imageUrl: "images/2020-12-08T15:28:24.800Z-180.png",
        allergens_name: [
          {
            allergen_name: "dish"
          },
          {
            allergen_name: "dish2"
          }
        ]
      },
      {
        product_id: 6,
        variant_id: 6,
        product_name: "Hamburg Hawai",
        product_description: "Hamburg Hawai",
        product_price: 2500,
        product_imageUrl: "images/2020-12-08T15:28:24.800Z-180.png",
        allergens_name: [
          {
            allergen_name: "fish3"
          },
          {
            allergen_name: "fish4"
          }
        ]
      },
      {
        product_id: 7,
        variant_id: 7,
        product_name: "Soup Hawai",
        product_description: "Soup Hawai",
        product_price: 1500,
        product_imageUrl: "images/2020-12-08T15:28:24.800Z-180.png",
        allergens_name: [
          {
            allergen_name: "fish5"
          },
          {
            allergen_name: "fish6"
          }
        ]
      },
    ]
  }

  ngOnInit(): void {
    this.sendList = this.categoryList.map(item => ({name: item.category_name, value: item.category_id}));
  }

  selectedItem(event): void {
    console.log('selectedCategory====>', event.param);
    if(event.type == 'category'){
      this.selectedCategory.category_id = event.param.value;
      this.selectedCategory.category_name = event.param.name;
      console.log("selectedCategory_name====>", this.selectedCategory);
    }
    else if(event.type == 'subcategory'){
      this.selectedSubCategory.category_id = event.param.value;
      this.selectedSubCategory.category_name = event.param.name;
    }
  }

  counterChange(event): void {
    this.counts = event.counts;
  }
}
