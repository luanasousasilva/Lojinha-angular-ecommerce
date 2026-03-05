import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onSale',
  standalone: true
})
export class OnSalePipe implements PipeTransform {

  transform(value: unknown, ...args: any[]): unknown {
    const [ customText ] = args;
    return value ? (customText || 'EM PROMOÇÃO!') : '';
  }

}
