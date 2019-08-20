import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'itemSearchFilter'
})
export class ItemSearchFilterPipe implements PipeTransform {

    public transform(items: any[], searchText: string, searchType: string): any {
        if (searchText) {
            searchText = searchText.toLowerCase();
        }
        if (!items) {
            // if no items return empty
            return [];
        } else if (!searchText) {
            // if no search text return empty
            return items;
        } else {
            if ( searchType === 'tag') {
                return items.filter((item) => {
                    const stripped = item.tag.replace(/[_-]/g, ''); // remove underscores
                    return item.tag.toLowerCase().includes(searchText) || stripped.toLowerCase().includes(searchText);
                });
            } else if ( searchType === 'itemTypeName') {
                return items.filter((item) => {
                return item.itemTypeName.toLowerCase().includes(searchText);
                });
            } else {
                return items.filter((item) => {
                    return item.attributes
                        .filter((attribute) => {
                          const value = attribute.value ? attribute.value.toLowerCase()
                            .replace(/<sup>.<\/sup>/g, '')
                            .replace(/[®™©]/g, '') : '';
                          return attribute.attribute === searchType
                            && attribute.value &&
                            value.includes(searchText);
                        }).length > 0;
                });
            }
        }
}
}
