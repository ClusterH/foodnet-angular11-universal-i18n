import { Pipe, PipeTransform } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';

@Pipe({
  name: 'currencyUnit'
})
export class CurrencyUnitPipe implements PipeTransform {
  constructor(
    private cookieService: CookieService,
  ) { }
  transform(unit: string): string {
    const lang = this.cookieService.get('change_lang');
    return lang == 'hu' ? 'lej' : 'lei';
  }
}
