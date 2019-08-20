import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighLightFilterPipe implements PipeTransform {
 
    transform(text: string, search): string {
        return search ? text.replace(new RegExp(search, 'g'), `<span class="highlight-css">${search}</span>`) : text;
      }
}
