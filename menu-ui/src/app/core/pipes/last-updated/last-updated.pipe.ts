import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lastUpdated'
})
export class LastUpdatedPipe implements PipeTransform {
 
    transform(text: string): string {
        if (text) {
            return text.replace('.',' ').split(' ')
            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(' ');
        }
      }
}
