import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    compare = (a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    };
    transform(items: any[], searchText: string, searchType: string, searchTypeType:string): any {
        if(searchText){
            searchText = searchText.toLowerCase();
        }
        if(!items) {
            return [];
        }else if(!searchText){
            return items.sort(this.compare);
        } else if(searchTypeType && searchTypeType === "number"){
            return items.filter(item => {
                return item[searchType] && item[searchType] === Number(searchText);
                }).sort(this.compare);
        }else{
            return items.filter(item => {
                return item[searchType] && item[searchType].toLowerCase().includes(searchText);
                }).sort(this.compare);           
        }
}
}
