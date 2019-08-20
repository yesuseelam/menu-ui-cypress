import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'menuLocationSetTypeFilter'
})
export class MenuLocationSetTypeFilterPipe implements PipeTransform {
    transform(locationSetTypes: any[]): any {
        if (locationSetTypes === null) { return []; }
        return locationSetTypes.filter(locationSetType => {
            if (locationSetType.parentScope === null) {
              return locationSetType;
            }
        });
    }
}
