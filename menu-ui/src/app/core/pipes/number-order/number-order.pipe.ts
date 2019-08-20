import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberOrder'
})
export class NumberOrderPipe implements PipeTransform {
 
    transform(items, sort) {
        if (items && sort === 'SORT') {
            return items.sort(function(a, b){return a.sequence - b.sequence});
        }else if (items && sort === 'MENU') {
            return items.sort(function(a, b){return a.seqValue - b.seqValue});
        }else if (items && sort === 'SORTITEM'){
            return items.sort(function(a, b){return a.seqvalue - b.seqvalue});
        }else{
            return items;
        }
      }
}
