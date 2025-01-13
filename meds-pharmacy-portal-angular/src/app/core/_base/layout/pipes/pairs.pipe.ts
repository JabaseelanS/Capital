import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pairs'
})
export class PairsPipe implements PipeTransform {

  transform(array) {

    return array.reduce((result, item, index) => (
      index % 2 ? result : [...result, [item, array[index + 1]]]
    ), []);
    
  }

}