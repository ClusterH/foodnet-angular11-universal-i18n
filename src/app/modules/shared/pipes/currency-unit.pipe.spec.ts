import { CurrencyUnitPipe } from './currency-unit.pipe';

describe('CurrencyUnitPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyUnitPipe();
    expect(pipe).toBeTruthy();
  });
});
