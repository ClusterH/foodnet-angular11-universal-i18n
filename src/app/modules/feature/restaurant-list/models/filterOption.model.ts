export class FilterOption {
  lang?: string;
  locationId?: number;
  searchString?: string;
  filters?: {
    freeDelivery?: number;
    newest?: number;
    pizza?: number;
    hamburger?: number;
    dailyMenu?: number;
    soup?: number;
    salad?: number;
    money?: number;
    card?: number;
    withinOneHour?: number;
  };

  constructor() {
    this.lang = '';
    this.locationId = 0;
    this.searchString = '';
    this.filters = {
      freeDelivery: 0,
      newest: 0,
      pizza: 0,
      hamburger: 0,
      dailyMenu: 0,
      soup: 0,
      salad: 0,
      money: 0,
      card: 0,
      withinOneHour: 0,
    }
  }
}
