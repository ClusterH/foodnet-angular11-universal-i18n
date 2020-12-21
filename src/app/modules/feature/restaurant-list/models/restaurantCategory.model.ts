export class Category {
  name?: string;
  category_id?: number;
  category_name?: string;

  constructor() {
    this.name = '';
    this.category_id = null;
    this.category_name = '';
  }
}

export class SubCategory {
  name?: string;
  categoryId?: number;
  subcategoryId?: number;
  subcategories_name?: string;
  propertyValTransId?: number;

  constructor() {
    this.name = '';
    this.categoryId = null;
    this.subcategoryId = null;
    this.subcategories_name = '';
    this.propertyValTransId = null;
  }
}
