import { Pipe, PipeTransform } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';

@Pipe({
  name: 'minOrder'
})
export class MinOrderPipe implements PipeTransform {
  constructor(
    private cookieService: CookieService,
  ) { }
  transform(total): boolean {
    const minOrder = Number(this.cookieService.get('restaurant_minOrder'));
    return total < minOrder ? true : false;
  }
}
